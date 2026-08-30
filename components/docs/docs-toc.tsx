'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ThumbsUp, ThumbsDown, Copy, Bot, Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocsToc() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedValue, setVotedValue] = useState<boolean | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentTitle, setCommentTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const handleFeedback = async (isHelpful: boolean) => {
    if (hasVoted || isSubmittingFeedback) return;

    // Optimistic UI Update - Instant visual feedback!
    setHasVoted(true);
    setVotedValue(isHelpful);
    setIsSubmittingFeedback(true);

    let slug = pathname?.replace(/^\/docs\/?/, '');
    if (!slug) slug = 'introduction';

    try {
      const res = await fetch('/api/docs/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isHelpful }),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      const data = await res.json();
      const newFeedbackId = data.feedbackId || null;
      if (newFeedbackId) setFeedbackId(newFeedbackId);

      // Save to localStorage
      localStorage.setItem(`classgrid:docs-feedback:${slug}`, JSON.stringify({
        hasVoted: true,
        votedValue: isHelpful,
        commentSubmitted: false,
        feedbackId: newFeedbackId
      }));
    } catch (e) {
      console.error(e);
      // Revert UI if API fails
      setHasVoted(false);
      setVotedValue(null);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !commentTitle.trim() || !feedbackId || isSubmittingComment) return;

    setIsSubmittingComment(true);
    let slug = pathname?.replace(/^\/docs\/?/, '');
    if (!slug) slug = 'introduction';

    try {
      const res = await fetch('/api/docs/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, feedbackId, title: commentTitle, comment: commentText, isHelpful: votedValue }),
      });

      if (!res.ok) throw new Error('Failed to submit comment');

      setCommentSubmitted(true);
      setShowCommentForm(false);

      // Save comment submitted state to localStorage
      const savedFeedback = localStorage.getItem(`classgrid:docs-feedback:${slug}`);
      if (savedFeedback) {
        try {
          const parsed = JSON.parse(savedFeedback);
          localStorage.setItem(`classgrid:docs-feedback:${slug}`, JSON.stringify({
            ...parsed,
            commentSubmitted: true
          }));
        } catch(e) {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    let slug = pathname?.replace(/^\/docs\/?/, '');
    if (!slug) slug = 'introduction';

    // Check localStorage first
    const savedFeedback = localStorage.getItem(`classgrid:docs-feedback:${slug}`);
    if (savedFeedback) {
      try {
        const parsed = JSON.parse(savedFeedback);
        setHasVoted(parsed.hasVoted || false);
        setVotedValue(parsed.votedValue ?? null);
        setCommentSubmitted(parsed.commentSubmitted || false);
        setFeedbackId(parsed.feedbackId || null);
      } catch (e) {
        setHasVoted(false);
        setVotedValue(null);
        setCommentSubmitted(false);
      }
    } else {
      setHasVoted(false);
      setVotedValue(null);
      setCommentSubmitted(false);
      setFeedbackId(null);
    }
    
    setShowCommentForm(false);
    setCommentText('');
    setCommentTitle('');
    setActiveId('');

    let observer: IntersectionObserver | null = null;

    // Small delay ensures the new page's Markdown DOM has finished rendering before we query it
    const timeoutId = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.docs-content h2, .docs-content h3'));
      const items = elements.map((elem) => ({
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.charAt(1)),
      }));
      
      setHeadings(items);

      // Intersection Observer to highlight active section
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0px 0px -80% 0px' }
      );

      elements.forEach((elem) => observer?.observe(elem));
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  // Auto-open comment form after login redirect with ?openComment=true
  // NOTE: We read localStorage directly here instead of using hasVoted state,
  // because hasVoted is set by the pathname useEffect which may not have run yet
  // (race condition when returning from login redirect).
  useEffect(() => {
    const shouldOpenComment = searchParams.get('openComment') === 'true';
    if (!shouldOpenComment || sessionStatus !== 'authenticated' || !session?.user) return;

    // Read vote state directly from localStorage right now
    let slug = pathname?.replace(/^\/docs\/?/, '');
    if (!slug) slug = 'introduction';
    const saved = localStorage.getItem(`classgrid:docs-feedback:${slug}`);
    let voted = false;
    let alreadyCommented = false;
    let savedFeedbackId: string | null = null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        voted = parsed.hasVoted || false;
        alreadyCommented = parsed.commentSubmitted || false;
        savedFeedbackId = parsed.feedbackId || null;
      } catch (e) {}
    }

    if (!voted || alreadyCommented) return; // nothing to open

    // Restore the state values first so they're correct when the modal renders
    setHasVoted(true);
    if (savedFeedbackId) setFeedbackId(savedFeedbackId);

    const timer = setTimeout(() => {
      setShowCommentForm(true);
      // Clean up the URL param so it doesn't re-trigger on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('openComment');
      window.history.replaceState({}, '', url.toString());
    }, 400);
    return () => clearTimeout(timer);
  }, [sessionStatus, session, searchParams, pathname]);


  const handleCopyMarkdown = () => {
    const el = document.getElementById('markdown-content-wrapper');
    const content = el?.getAttribute('data-markdown') || el?.textContent || 'No content found.';
    navigator.clipboard.writeText(content);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleCopyAI = (aiName: string) => {
    const url = window.location.href;
    const prompt = `Read from ${url} so I can ask questions about its contents`;
    navigator.clipboard.writeText(prompt);

    setTimeout(() => {
      if (aiName === 'ChatGPT') {
        window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank');
      } else if (aiName === 'Claude') {
        window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank');
      }
    }, 1000);
  };

  useEffect(() => {
    if (!activeId) return;
    const activeElement = document.getElementById(`toc-item-${activeId}`);
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  return (
    <aside className="w-[250px] hidden xl:block sticky top-[4.5rem] h-[calc(100vh-4.5rem)] pb-8 pt-4 pl-6 border-l border-slate-200 dark:border-white/10 text-sm flex flex-col">
      <div className="flex flex-col h-full gap-8">
        {/* Is this helpful */}
        <div className="shrink-0">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-3">Is this helpful?</h4>
          <div className="flex gap-2">
            <button
              disabled={hasVoted || isSubmittingFeedback}
              className={`p-2 rounded-full border transition-all duration-300 active:scale-90 ${hasVoted && votedValue === true
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 scale-110'
                : hasVoted
                  ? 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-zinc-600 cursor-not-allowed opacity-50'
                  : 'border-slate-200 dark:border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50 hover:scale-110 text-slate-600 dark:text-zinc-400 cursor-pointer'
                }`}
              onClick={() => handleFeedback(true)}
            >
              <ThumbsUp className="w-4 h-4" fill={hasVoted && votedValue === true ? "currentColor" : "none"} />
            </button>
            <button
              disabled={hasVoted || isSubmittingFeedback}
              className={`p-2 rounded-full border transition-all duration-300 active:scale-90 ${hasVoted && votedValue === false
                ? 'border-red-500/50 bg-red-500/10 text-red-400 scale-110'
                : hasVoted
                  ? 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-zinc-600 cursor-not-allowed opacity-50'
                  : 'border-slate-200 dark:border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 hover:scale-110 text-slate-600 dark:text-zinc-400 cursor-pointer'
                }`}
              onClick={() => handleFeedback(false)}
            >
              <ThumbsDown className="w-4 h-4" fill={hasVoted && votedValue === false ? "currentColor" : "none"} />
            </button>
          </div>
          {hasVoted && !commentSubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-3 text-xs"
            >
              {votedValue === true && (
                <p className="text-emerald-400 font-medium mb-1">Thanks for your feedback!</p>
              )}
              <button 
                onClick={() => {
                  // Require login before allowing comments
                  if (!session?.user) {
                    // Redirect to login, and after login redirect back with ?openComment=true so the form auto-opens
                    const currentPath = pathname || '/docs';
                    const returnUrl = `${currentPath}?openComment=true`;
                    window.location.href = `/login?callbackUrl=${encodeURIComponent(returnUrl)}`;
                    return;
                  }
                  setShowCommentForm(true);
                }}
                className="text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors underline decoration-slate-300 dark:decoration-white/20 underline-offset-2 cursor-pointer"
              >
                {votedValue ? 'What went well?' : 'What could we improve?'}
              </button>
            </motion.div>
          )}
          {commentSubmitted && (
             <motion.div 
             initial={{ opacity: 0, y: -5 }} 
             animate={{ opacity: 1, y: 0 }} 
             className="mt-3 text-xs text-emerald-400/80"
           >
             Feedback received.
           </motion.div>
          )}
        </div>

        {/* Utility Actions */}
        <div className="shrink-0 mb-6 border-b border-slate-200 dark:border-white/10 pb-6 hidden xl:block">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-3">AI Tools</h4>
          <ul className="space-y-1.5 text-[13px]">
            <li className="relative group/nav z-[100]">
              <button className="flex justify-between items-center hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 text-slate-600 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4" />
                  <span>Copy as Markdown</span>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-400 mr-2 opacity-50 group-hover/nav:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute right-0 top-full mt-1 w-[260px] rounded-[10px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 p-1.5 text-left flex flex-col z-[110]">
                <button onClick={handleCopyMarkdown} className="flex flex-col text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group/btn">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white mb-0.5">
                    {copiedMarkdown ? <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <Copy className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-500" />}
                    Copy page
                  </div>
                  <div className="text-[13px] text-slate-500 pl-6 leading-relaxed">Copy page as Markdown for LLMs</div>
                </button>
                <button onClick={() => {
                  const el = document.getElementById('markdown-content-wrapper');
                  const content = el?.getAttribute('data-markdown') || el?.textContent || 'No content found.';
                  const blob = new Blob([content], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }} className="flex flex-col text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group/btn mt-1">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white mb-0.5">
                    <div className="w-4 h-4 rounded-[3px] border border-slate-400 group-hover/btn:border-emerald-500 flex items-center justify-center text-[8px] font-bold text-slate-400 group-hover/btn:text-emerald-500">M↓</div>
                    View as Markdown
                  </div>
                  <div className="text-[13px] text-slate-500 pl-6 leading-relaxed">Open this page as plain text</div>
                </button>
              </div>
            </li>
            <li>
              <button onClick={() => handleCopyAI('ChatGPT')} className="flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 text-slate-600 cursor-pointer">
                <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/images.jpg" alt="ChatGPT" className="w-4 h-4 rounded-full object-cover" />
                <span>Ask ChatGPT</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleCopyAI('Claude')} className="flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors w-full text-left px-2 py-1.5 rounded-md -ml-2 text-slate-600 cursor-pointer">
                <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/claude-color.svg" alt="Claude" className="w-4 h-4" />
                <span>Ask Claude</span>
              </button>
            </li>
          </ul>
        </div>

        {/* On this page */}
        {headings.length > 0 && (
          <div className="flex flex-col flex-1 min-h-0">
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-3 shrink-0">On this page</h4>
            <ul className="space-y-2.5 overflow-y-auto custom-scrollbar pr-2 pb-4 -ml-6 pl-6">
              {headings.map((heading) => (
                <li id={`toc-item-${heading.id}`} key={heading.id} className={`relative shrink-0 ${heading.level === 3 ? 'pl-4' : ''}`}>
                  {activeId === heading.id && (
                    <motion.div 
                      layoutId="toc-indicator"
                      className="absolute -left-6 top-0 bottom-0 w-[2px] bg-slate-900 dark:bg-white rounded-full" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <a
                    href={`#${heading.id}`}
                    className={`block truncate transition-colors py-0.5 ${activeId === heading.id ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Clean Minimal Feedback Modal (Supabase Style) */}
      {showCommentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-[500px] bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-base font-medium text-slate-900 dark:text-white">
                Leave a comment
              </h3>
              <button 
                onClick={() => setShowCommentForm(false)} 
                className="text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-md transition-all duration-200 active:scale-90"
                aria-label="Close comment form"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            </div>

            <div className="p-6">
              {/* Title Field */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Title</label>
                <input
                  type="text"
                  value={commentTitle}
                  onChange={(e) => setCommentTitle(e.target.value)}
                  className="w-full bg-white dark:bg-[#141414] border border-slate-300 dark:border-white/10 rounded-md p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
                  autoFocus
                />
              </div>

              {/* Comment Field */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Comment</label>
                  <span className="text-xs text-slate-500 dark:text-zinc-500">
                    ({session?.user ? 'not anonymous' : 'anonymous'})
                  </span>
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full h-24 bg-white dark:bg-[#141414] border border-slate-300 dark:border-white/10 rounded-md p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              {/* Minimal Warning Message */}
              <div className="flex items-start gap-3 mb-6">
                <span className="text-yellow-500 shrink-0 mt-0.5 text-lg leading-none">💡</span>
                <p className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-medium">Need help or support?</strong> This feedback form is for documentation improvements only. For technical support, please submit a <a href="/support" className="text-emerald-500 hover:text-emerald-400 transition-colors">support request</a>.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowCommentForm(false)}
                  className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitComment}
                  disabled={isSubmittingComment || !commentText.trim() || !commentTitle.trim()}
                  className="px-4 py-2 text-sm font-medium bg-[#24b47e] text-black rounded-md hover:bg-[#20a070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingComment && <Spinner className="w-4 h-4 text-black" />}
                  <span>{isSubmittingComment ? 'Submitting...' : 'Submit feedback'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </aside>
  );
}

"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
type PageType = 'compare' | 'blog' | 'module' | 'solution' | 'case-study' | 'use-case' | 'help-article' | 'docs' | 'general';

type FeedbackWidgetProps = {
  pageTitle: string;
  pageType?: PageType;
  className?: string;
  hideMessage?: boolean;
};

export function FeedbackWidget({ pageTitle, pageType = 'general', className, hideMessage = false }: FeedbackWidgetProps) {
  // Feedback State
  const [feedbackState, setFeedbackState] = useState<'idle' | 'opened' | 'submitted' | 'error'>('idle');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPreview, setFeedbackPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Auto-reset feedback widget after 3 seconds of showing "submitted" or "error" state
  useEffect(() => {
    if (feedbackState === 'submitted' || feedbackState === 'error') {
      const timer = setTimeout(() => {
        setFeedbackState('idle');
        setSelectedEmoji(null);
        setFeedbackText('');
        setFeedbackPreview(false);
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [feedbackState]);

  return (
    <div className={cn("relative flex items-center justify-center w-full py-6", className)}>
      {/* Feedback Widget Wrapper — fixed width, no shape morph */}
      <div className="relative flex flex-col rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900 overflow-hidden w-full max-w-[400px]">

        {/* ── SUBMITTED OR ERROR STATE ── */}
        {feedbackState === 'submitted' || feedbackState === 'error' ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 px-6 text-center">
            {/* Icon circle */}
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full shadow-[0_0_24px_rgba(16,185,129,0.5)] animate-[scale-in_0.3s_ease-out]",
              feedbackState === 'error' ? "bg-red-500 shadow-[0_0_24px_rgba(239,68,68,0.5)]" : "bg-emerald-500"
            )}>
              {feedbackState === 'error' ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className="text-[15px] font-bold text-slate-900 dark:text-white">
              {feedbackState === 'error' ? "Something went wrong" : "Your feedback has been received!"}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {feedbackState === 'error' ? "Please try again later." : "Thank you for your help."}
            </p>
            {/* Keep emojis visible but greyed out */}
            <div className="flex items-center gap-2 mt-1 opacity-40">
              {['🤩', '😐', '😞', '😭'].map((e) => (
                <span key={e} className={cn("text-base transition-all", selectedEmoji === e ? "opacity-100 scale-125" : "grayscale opacity-50")}>{e}</span>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Top Row: Label + Emojis */}
            <div className={cn("flex items-center px-4 py-2.5 w-full", pageType === 'docs' ? "justify-center" : "justify-between")}>
              {pageType !== 'docs' && (
                <span className="text-[13px] font-medium text-muted-foreground">
                  Was this helpful?
                </span>
              )}

              <div className="flex items-center gap-1">
                {['🤩', '😐', '😞', '😭'].map((emoji) => {
                  const labels: Record<string, string> = {
                    '😭': 'Very unhelpful',
                    '😞': 'Unhelpful',
                    '😐': 'Neutral',
                    '🤩': 'Very helpful'
                  };
                  return (
                    <button
                      key={emoji}
                      aria-label={labels[emoji]}
                      onClick={async () => {
                        if (selectedEmoji === emoji && feedbackState === 'opened') {
                          // Clicking the already-selected emoji collapses the card
                          setSelectedEmoji(null);
                          setFeedbackState('idle');
                        } else {
                          setSelectedEmoji(emoji);
                          if (hideMessage) {
                            // OPTIMISTIC UI: Immediately show success state so it feels instant
                            setFeedbackState('submitted');
                            
                            // Send to API in the background
                            fetch('/api/feedback', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                reaction: emoji,
                                message: '',
                                pageUrl: window.location.href,
                                pageTitle: pageTitle,
                                pageType: pageType,
                              }),
                            }).catch((e) => {
                              console.error('Background feedback submission failed:', e);
                              // If it fails, we silently log it so the user's UX isn't interrupted
                            });
                          } else {
                            setFeedbackState('opened');
                          }
                        }
                      }}
                      className={cn(
                        "p-1 transition-all duration-200 hover:scale-125 cursor-pointer",
                        selectedEmoji === emoji
                          ? "grayscale-0 bg-slate-200 dark:bg-white/15 rounded-full scale-110"
                          : "grayscale hover:grayscale-0 opacity-50 hover:opacity-100"
                      )}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expanded area — smooth max-height reveal, NO shape deformation */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                feedbackState === 'opened' ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="border-t border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-neutral-900">
                {/* Write / Preview Tabs */}
                <div className="flex items-center gap-0 px-3 pt-2">
                  <button
                    onClick={() => setFeedbackPreview(false)}
                    className={cn(
                      "px-3 py-1 text-[12px] font-medium rounded-t-md border border-b-0 transition-colors cursor-pointer",
                      !feedbackPreview
                        ? "bg-white dark:bg-neutral-800 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                    )}
                  >
                    Write
                  </button>
                  <button
                    onClick={() => setFeedbackPreview(true)}
                    className={cn(
                      "px-3 py-1 text-[12px] font-medium rounded-t-md border border-b-0 transition-colors cursor-pointer",
                      feedbackPreview
                        ? "bg-white dark:bg-neutral-800 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                    )}
                  >
                    Preview
                  </button>
                </div>

                <div className="px-3 pb-3">
                  {!feedbackPreview ? (
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Your feedback... (**bold**, - lists supported)"
                      aria-label="Your feedback"
                      className="w-full min-h-[80px] bg-white dark:bg-neutral-800 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-300 dark:border-white/10 rounded-b-lg rounded-tr-lg p-3 outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  ) : (
                    <div className="w-full min-h-[80px] bg-white dark:bg-neutral-800 border border-slate-300 dark:border-white/10 rounded-b-lg rounded-tr-lg p-3">
                      {feedbackText.trim() ? (
                        <div className="text-[13px] text-slate-900 dark:text-white prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {feedbackText}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-[13px] text-slate-400">Nothing to preview.</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span className="font-mono bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded text-[9px]">M↓</span>
                        Markdown supported
                      </span>
                      <span className="text-slate-300 dark:text-neutral-600">•</span>
                      <span>Message is optional</span>
                    </span>
                    <button
                      disabled={isSending}
                      onClick={async () => {
                        setIsSending(true);
                        try {
                          const res = await fetch('/api/feedback', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              reaction: selectedEmoji,
                              message: feedbackText,
                              pageUrl: window.location.href,
                              pageTitle: pageTitle,
                              pageType: pageType,
                            }),
                          });
                          if (!res.ok) throw new Error('API Error');
                          setFeedbackState('submitted');
                        } catch (e) {
                          console.error('Feedback submission failed:', e);
                          setFeedbackState('error');
                        } finally {
                          setIsSending(false);
                        }
                      }}
                      className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black text-[13px] font-semibold px-5 py-1.5 rounded-md transition-all duration-200 hover:scale-[1.06] hover:shadow-[0_4px_14px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_4px_14px_rgba(255,255,255,0.2)] active:scale-[0.96] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {isSending ? (
                        <>
                          <Spinner className="w-4 h-4 text-inherit" />
                          Sending…
                        </>
                      ) : (
                        "Send"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

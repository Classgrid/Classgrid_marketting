"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ArticleQuestionBoxProps {
  articleSlug: string;
  articleTitle: string;
}

export function ArticleQuestionBox({ articleSlug, articleTitle }: ArticleQuestionBoxProps) {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  // Check local storage to see if they already submitted a question for this article
  useEffect(() => {
    const key = `asked_question_${articleSlug}`;
    if (localStorage.getItem(key)) {
      setIsSubmitted(true);
      setIsHidden(true); // Hide completely if already submitted in a previous session
    }
  }, [articleSlug]);

  // Hide the success message after 25 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSubmitted && !isHidden) {
      timeout = setTimeout(() => {
        setIsHidden(true);
      }, 25000);
    }
    return () => clearTimeout(timeout);
  }, [isSubmitted, isHidden]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/article-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          articleSlug,
          articleTitle,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        localStorage.setItem(`asked_question_${articleSlug}`, "true");
      } else {
        console.error("Failed to submit question");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isHidden) return null;

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Thanks for sharing!
        </span>
        <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
          We'll review your feedback and update the article soon.
        </span>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors focus:outline-none"
      >
        <span className="text-lg">🙋</span> Have a doubt?
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
        <span className="text-lg">🙋</span> Have a doubt?
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's confusing you?"
          className="w-full text-sm resize-none rounded-xl bg-muted/50 border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-muted-foreground/70"
          rows={3}
          required
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="h-8 px-3 text-xs font-medium rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !question.trim()}
            className="flex-1 h-8 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors"
          >
            {isSubmitting ? (
              <Spinner className="w-3.5 h-3.5 text-inherit" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Send
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

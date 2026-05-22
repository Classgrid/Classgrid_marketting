"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  BarChart3,
  Bot,
  ClipboardList,
  CreditCard,
  FileText,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  MessageCircleMore,
  School,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PageContext } from "@/lib/ai/rag-content";
import { useSession } from "next-auth/react";

type AskAiPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageContext?: PageContext;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  typing?: boolean;
};

type ListItem = {
  indexLabel?: string;
  text: string;
};

type StructuredBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: ListItem[] }
  | { type: "section"; title: string; paragraphs: string[] };

const SUGGESTED_QUESTIONS = [
  "What is Classgrid?",
  "How can my school use Classgrid?",
  "Does Classgrid provide websites?",
  "How do I get started?",
];

function suggestedQuestionsForPage(pageContext?: PageContext) {
  const path = pageContext?.path || "";

  if (path === "/pricing") {
    return [
      "How does Classgrid pricing work?",
      "Which modules are included?",
      "How do I get a quote?",
      "Is pricing fixed or custom?",
    ];
  }

  if (path.startsWith("/product/modules")) {
    return [
      "What does this module do?",
      "Who uses this module?",
      "How does this module help admins?",
      "How do I see a demo?",
    ];
  }

  if (path.startsWith("/support") || path.startsWith("/help-center")) {
    return [
      "How do I raise a support ticket?",
      "What is Classgrid Talk vs support tickets?",
      "I'm from an institution — how do I get help?",
      "Can I track my ticket status?",
    ];
  }

  if (path.startsWith("/terms") || path.startsWith("/privacy") || path.startsWith("/cookies") || path.startsWith("/acceptable-use")) {
    return [
      "Summarize this policy",
      "What data does Classgrid handle?",
      "What should institutions know?",
      "Who do I contact for policy questions?",
    ];
  }

  if (path.includes("contact") || path.includes("demo")) {
    return [
      "What happens after I submit this form?",
      "How do I book a demo?",
      "Who should contact sales?",
      "What details should I include?",
    ];
  }

  return SUGGESTED_QUESTIONS;
}

const panelTransition = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1],
} as const;

const SECTION_ICON_RULES: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /admission|enroll/i, icon: FileText },
  { match: /attendance/i, icon: BarChart3 },
  { match: /exam|result|quiz/i, icon: ClipboardList },
  { match: /fee|payment|billing/i, icon: CreditCard },
  { match: /communicat|chat|notice/i, icon: MessageCircleMore },
  { match: /website|domain|tenant/i, icon: Globe2 },
  { match: /dashboard|analytics|report/i, icon: LayoutDashboard },
  { match: /school|college|institute|coaching/i, icon: School },
];

function formatMessageTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function sanitizeAssistantText(text: string) {
  const normalized = text.replace(/\r/g, "");
  const cleanedLines = normalized.split("\n").map((line) =>
    line
      .replace(/__(.*?)__/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^#{1,6}\s*/g, "")
      .replace(/^>\s*/g, "")
      .replace(/\s+$/g, "")
  );

  return cleanedLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function splitLongParagraph(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= 170) return [trimmed];

  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= 1) return [trimmed];

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((`${current} ${sentence}`.trim()).length <= 170) {
      current = `${current} ${sentence}`.trim();
    } else {
      if (current) chunks.push(current);
      current = sentence;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function extractInlineNumberedItems(text: string) {
  const matches = [...text.matchAll(/(\d+)\.\s+(.+?)(?=(?:\s+\d+\.\s)|$)/g)];
  if (matches.length < 2) return null;

  return matches.map((match) => ({
    indexLabel: `${match[1]}.`,
    text: match[2].trim(),
  }));
}

function parseListBlock(block: string) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const inlineItems = lines.length === 1 ? extractInlineNumberedItems(lines[0]) : null;
  if (inlineItems) return inlineItems;

  const rows: ListItem[] = [];

  for (const line of lines) {
    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    if (numbered) {
      rows.push({ indexLabel: `${numbered[1]}.`, text: numbered[2].trim() });
      continue;
    }

    const bullet = line.match(/^[-*\u2022]\s+(.+)$/);
    if (bullet) {
      rows.push({ text: bullet[1].trim() });
      continue;
    }

    return null;
  }

  return rows.length ? rows : null;
}

function isLikelyHeading(title: string) {
  const trimmed = title.trim().replace(/:$/, "");
  if (!trimmed) return false;

  if (SECTION_ICON_RULES.some((rule) => rule.match.test(trimmed))) return true;

  return /^[A-Za-z][A-Za-z\s/&-]{2,50}$/.test(trimmed) && trimmed.split(/\s+/).length <= 6;
}

function parseSectionBlock(block: string): StructuredBlock | null {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  const firstLine = lines[0];
  const headingWithBody = firstLine.match(/^([^:]{2,60}):\s+(.+)$/);
  if (headingWithBody && isLikelyHeading(headingWithBody[1])) {
    const paragraphs = splitLongParagraph(headingWithBody[2]);
    return {
      type: "section",
      title: headingWithBody[1].trim(),
      paragraphs,
    };
  }

  if (isLikelyHeading(firstLine) && lines.length > 1) {
    const body = lines.slice(1).join(" ");
    return {
      type: "section",
      title: firstLine.replace(/:$/, "").trim(),
      paragraphs: splitLongParagraph(body),
    };
  }

  return null;
}

function buildStructuredBlocks(text: string): StructuredBlock[] {
  const cleaned = sanitizeAssistantText(text);
  if (!cleaned) return [];

  const rawBlocks = cleaned.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
  const blocks: StructuredBlock[] = [];

  for (const rawBlock of rawBlocks) {
    const listItems = parseListBlock(rawBlock);
    if (listItems) {
      blocks.push({ type: "list", items: listItems });
      continue;
    }

    const sectionBlock = parseSectionBlock(rawBlock);
    if (sectionBlock) {
      blocks.push(sectionBlock);
      continue;
    }

    for (const paragraph of splitLongParagraph(rawBlock.replace(/\s+/g, " ").trim())) {
      if (paragraph) {
        blocks.push({ type: "paragraph", text: paragraph });
      }
    }
  }

  return blocks;
}

function getSectionIcon(title: string) {
  const match = SECTION_ICON_RULES.find((rule) => rule.match.test(title));
  return match?.icon ?? HelpCircle;
}

function TypingDots({ reducedMotion }: { reducedMotion: boolean }) {
  const dotClass = "h-1.5 w-1.5 rounded-full bg-muted-foreground";

  if (reducedMotion) {
    return (
      <div className="flex items-center gap-1">
        <span className={dotClass} />
        <span className={dotClass} />
        <span className={dotClass} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className={dotClass}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.14 }}
        />
      ))}
    </div>
  );
}

function isSafeAssistantHref(href: string) {
  return href.startsWith("/") || href.startsWith("#") || /^https?:\/\//i.test(href);
}

function renderInlineText(rawText: string) {
  // Pre-process to fix **[Link](url)** being caught as bold instead of a link
  const text = rawText.replace(/\*\*(\[[^\]]+\]\s*\((?:https?:\/\/|\/|#)[^\s)]+\))\*\*/g, "$1");

  const pattern = /(\[([^\]]+)\]\s*\(((?:https?:\/\/|\/|#)[^\s)]+)\)|\*\*([^*]+)\*\*)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    const fullMatch = match[0];
    const label = match[2];
    const href = match[3];
    const boldText = match[4];

    if (label && href && isSafeAssistantHref(href)) {
      const external = /^https?:\/\//i.test(href);
      // Strip any bold asterisks that might be inside the label: [**Book Demo**](...)
      const cleanLabel = label.replace(/\*\*/g, "");
      
      nodes.push(
        <a
          key={`link-${match.index}`}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="font-semibold text-emerald-600 underline underline-offset-4 transition-colors hover:text-emerald-500 dark:text-emerald-400"
        >
          {cleanLabel}
        </a>
      );
    } else if (boldText) {
      nodes.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-emerald-600 dark:text-emerald-400">
          {boldText}
        </strong>
      );
    } else {
      nodes.push(<span key={`raw-${match.index}`}>{fullMatch}</span>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
}

function AssistantMessageContent({ content }: { content: string }) {
  const blocks = useMemo(() => buildStructuredBlocks(content), [content]);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={`p-${index}`} className="text-slate-700 dark:text-white">
              {renderInlineText(block.text)}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`l-${index}`} className="space-y-2">
              {block.items.map((item, itemIndex) => (
                <li key={`li-${index}-${itemIndex}`} className="flex gap-2 text-slate-700 dark:text-white">
                  <span className="min-w-5 font-medium text-emerald-400">
                    {item.indexLabel ?? "\u2022"}
                  </span>
                  <span>{renderInlineText(item.text)}</span>
                </li>
              ))}
            </ul>
          );
        }

        const Icon = getSectionIcon(block.title);
        return (
          <div key={`s-${index}`} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">{block.title}</h3>
            </div>
            <div className="space-y-2">
              {block.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`sp-${index}-${paragraphIndex}`} className="text-slate-700 dark:text-white">
                  {renderInlineText(paragraph)}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AskAiPanel({ open, onOpenChange, pageContext }: AskAiPanelProps) {
  const { data: session } = useSession();
  const prefersReducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  // Load chat history from session storage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("classgrid_ai_chat_history");
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

  // Save chat history to session storage whenever it updates
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("classgrid_ai_chat_history", JSON.stringify(messages));
    }
  }, [messages]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isTerminated, setIsTerminated] = useState(false);
  const [bannedUntil, setBannedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Live countdown timer for ban expiry
  useEffect(() => {
    if (!bannedUntil) {
      setCountdown("");
      return;
    }

    const tick = () => {
      const now = Date.now();
      const diff = bannedUntil.getTime() - now;

      if (diff <= 0) {
        // Ban expired — unlock the chat!
        setIsTerminated(false);
        setBannedUntil(null);
        setCountdown("");
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${mins}m ${secs.toString().padStart(2, "0")}s`);
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [bannedUntil]);

  // Check if user is already banned on page load
  useEffect(() => {
    async function checkBanStatus() {
      try {
        const res = await fetch("/api/ask-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "__ban_check__" }),
        });
        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          setIsTerminated(true);
          if (data?.bannedUntil) {
            setBannedUntil(new Date(data.bannedUntil));
          }
        }
      } catch (_) {
        // silently ignore network errors
      }
    }
    if (open) void checkBanStatus();
  }, [open]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : null;

  const typingRunRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = input.trim().length > 0 && !submitting;
  const emptyState = useMemo(() => messages.length === 0, [messages.length]);
  const suggestedQuestions = useMemo(() => suggestedQuestionsForPage(pageContext), [pageContext]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow || "auto";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const element = chatScrollRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
  }, [messages, thinking, open]);

  function createMessageId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function wait(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function getCharDelay(char: string) {
    if (prefersReducedMotion) return 0;
    if (/[.!?]/.test(char)) return 30;
    if (/[,;:]/.test(char)) return 20;
    if (char === " ") return 6;
    return 11;
  }

  async function typeAssistantResponse(answer: string) {
    const runId = ++typingRunRef.current;
    const assistantId = createMessageId("assistant");

    setMessages((current) => [
      ...current,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        typing: true,
      },
    ]);

    for (let index = 1; index <= answer.length; index += 1) {
      if (runId !== typingRunRef.current) return;

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: answer.slice(0, index) }
            : message
        )
      );

      const delay = getCharDelay(answer[index - 1]);
      if (delay > 0) {
        await wait(delay);
      }
    }

    if (runId !== typingRunRef.current) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === assistantId ? { ...message, typing: false } : message
      )
    );
  }

  async function askQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || submitting) return;

    setError("");
    setInput("");
    setSubmitting(true);
    setThinking(true);

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        id: createMessageId("user"),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      },
    ];

    setMessages(nextMessages);

    let wasTerminated = false;

    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          userName: session?.user?.name ?? undefined,
          history: nextMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
          pageContext: pageContext,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 403) {
          setIsTerminated(true);
          wasTerminated = true;
          if (payload?.bannedUntil) {
            setBannedUntil(new Date(payload.bannedUntil));
          }
        }
        throw new Error(
          typeof payload?.error === "string" && payload.error.trim().length > 0
            ? payload.error
            : "Unable to answer right now. Please try again."
        );
      }

      const answer =
        typeof payload?.answer === "string" && payload.answer.trim().length > 0
          ? payload.answer
          : session?.user?.name
            ? `Hi ${session.user.name.split(" ")[0]}, I can help you with Classgrid features, pricing, or setup. What would you like to explore?`
            : "I can help you with Classgrid features, pricing, or setup. What would you like to explore?";

      setThinking(false);
      await wait(prefersReducedMotion ? 0 : 100);
      await typeAssistantResponse(answer);
    } catch (apiError: unknown) {
      const rawMessage =
        apiError instanceof Error && apiError.message.trim().length > 0
          ? apiError.message
          : "Unable to answer right now. Please try again.";

      // If terminated, add support info to the message shown in chat
      const fallback = wasTerminated || rawMessage.includes("terminated") || rawMessage.includes("restricted")
        ? `${rawMessage}\n\nIf you believe this is a mistake, please contact us at support@classgrid.in.\n\nTo understand why this action was taken, please read our [Privacy Policy](/privacy) and [Terms of Service](/terms).`
        : rawMessage;

      setThinking(false);
      await wait(prefersReducedMotion ? 0 : 100);
      await typeAssistantResponse(fallback);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    void askQuestion(input);
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.button
            key="ask-ai-overlay"
            type="button"
            aria-label="Close Ask AI panel"
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[79] bg-background/70 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        ) : null}
      </AnimatePresence>

      <motion.aside
        aria-hidden={!open}
        className={cn(
          "fixed z-[80] flex flex-col border-border bg-background shadow-2xl",
          // Mobile: full-screen bottom sheet
          "inset-x-0 bottom-0 h-[100dvh] w-full border-t sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-[400px] sm:border-l sm:border-t-0",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        initial={false}
        animate={
          open
            ? { y: 0, x: 0, opacity: 1 }
            : isMobile
              ? { y: "100%", x: 0, opacity: 0 }
              : { y: 0, x: "100%", opacity: 0 }
        }
        transition={prefersReducedMotion ? { duration: 0 } : panelTransition}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-semibold text-foreground">Ask AI</p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close panel</span>
          </Button>
        </div>

        <div ref={chatScrollRef} className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 px-4 py-4">
            {emptyState ? (
              <>
                <div className="rounded-2xl border border-border bg-card px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.name ? (
                      <span className="mb-1 block font-medium text-foreground">
                        Hi, {session.user.name.split(" ")[0]} 👋
                      </span>
                    ) : null}
                    {pageContext?.title
                      ? `Ask about ${pageContext.title}, Classgrid features, pricing, demos, or support.`
                      : "Ask anything about Classgrid features, pricing, website capabilities, demo process, or support."}
                  </p>
                </div>

                <div className="space-y-2">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-2xl border-border bg-card/40 px-4 py-3 text-left text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => void askQuestion(question)}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
                      {question}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {messages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <motion.div
                      key={message.id}
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.16 }}
                      className={cn(
                        "flex items-end gap-2",
                        isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          isUser
                            ? "order-2 bg-emerald-500 text-white"
                            : "order-1 border border-border bg-muted text-emerald-500"
                        )}
                      >
                        {isUser ? (
                          userInitial ? userInitial : <UserRound className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                      </div>

                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 transition-colors",
                          isUser
                            ? "order-1 max-w-[70%] bg-emerald-500 text-white hover:bg-emerald-500/95"
                            : "order-2 max-w-[75%] border border-border bg-card text-foreground shadow-[0_0_10px_rgba(16,185,129,0.14)] hover:border-emerald-500/30 dark:bg-zinc-800 dark:text-white"
                        )}
                      >
                        {isUser ? (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                          <AssistantMessageContent content={message.content} />
                        )}
                        <p className="mt-1 text-[11px] opacity-70">
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                <AnimatePresence>
                  {thinking ? (
                    <motion.div
                      key="thinking-state"
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                      className="flex items-end gap-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-emerald-500">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl border border-border bg-card px-4 py-3 text-foreground shadow-[0_0_10px_rgba(16,185,129,0.14)] dark:bg-zinc-800 dark:text-white">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Thinking</span>
                          <TypingDots reducedMotion={Boolean(prefersReducedMotion)} />
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-border px-4 py-4">
          {isTerminated ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-500">
              <p>This conversation has been terminated.</p>
              {countdown && (
                <p className="mt-1 text-xs text-red-400">
                  Access resumes in: <span className="font-mono font-bold">{countdown}</span>
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative w-full">
                <textarea
                  id="ask-ai-input"
                  name="askAiQuestion"
                  suppressHydrationWarning
                  ref={inputRef as any}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (canSubmit) void askQuestion(input);
                    }
                  }}
                  placeholder="Ask a Classgrid question..."
                  autoComplete="off"
                  className="min-h-[120px] max-h-[240px] w-full resize-none rounded-2xl border border-border bg-card pb-12 pl-4 pr-12 pt-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 overflow-y-auto [scrollbar-width:thin] leading-relaxed"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="icon"
                  disabled={!canSubmit}
                  className="!absolute !bottom-3 !right-3 !top-auto h-9 w-9 shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                >
                  <ArrowUp className="h-4 w-4 text-white" />
                  <span className="sr-only">Send question</span>
                </Button>
              </div>
            </form>
          )}

        </div>
      </motion.aside>
    </>
  );
}

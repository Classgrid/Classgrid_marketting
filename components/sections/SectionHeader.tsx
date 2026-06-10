import React from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

type SectionSubheadlineProps = {
  children: React.ReactNode;
  className?: string;
};

type SectionBodyTextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
  tone?: "body" | "lead" | "secondary";
};

export function SectionSubheadline({ children, className }: SectionSubheadlineProps) {
  if (!children) return null;

  return (
    <p
      className={cn(
        "mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionBodyText({
  as: Component = "p",
  tone = "body",
  className,
  children,
  ...props
}: SectionBodyTextProps) {
  if (!children) return null;

  return React.createElement(
    Component,
    {
      className: cn(
        tone === "lead" &&
          "text-lg leading-relaxed text-muted-foreground",
        tone === "body" &&
          "text-sm leading-relaxed text-muted-foreground md:text-base",
        tone === "secondary" && "text-sm text-slate-500 dark:text-slate-500",
        className
      ),
      ...props,
    },
    children
  );
}

export function SectionHeader({
  label,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  if (!label && !title && !description) return null;

  return (
    <div className={cn("mb-12 text-center md:mb-16", className)}>
      <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
      {label ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
          {label}
        </p>
      ) : null}
      {title ? (
        <h2
          className={cn(
            "text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl",
            titleClassName
          )}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <SectionSubheadline className={descriptionClassName}>
          {description}
        </SectionSubheadline>
      ) : null}
    </div>
  );
}

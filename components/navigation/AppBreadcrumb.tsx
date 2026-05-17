"use client";

import Link from "next/link";
import { Fragment } from "react";

import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BreadcrumbEntry = {
  label: string;
  href?: string;
};

type BreadcrumbToken =
  | { type: "item"; entry: BreadcrumbEntry }
  | { type: "ellipsis"; hiddenItems: BreadcrumbEntry[] };

type AppBreadcrumbProps = {
  items: BreadcrumbEntry[];
  className?: string;
  listClassName?: string;
};

function buildTokens(items: BreadcrumbEntry[]): BreadcrumbToken[] {
  if (items.length <= 3) {
    return items.map((entry) => ({ type: "item", entry }));
  }

  const first = items[0];
  const hiddenItems = items.slice(1, -2);
  const trailingItems = items.slice(-2);

  const tokens: BreadcrumbToken[] = [{ type: "item", entry: first }];
  if (hiddenItems.length > 0) {
    tokens.push({ type: "ellipsis", hiddenItems });
  }
  for (const entry of trailingItems) {
    tokens.push({ type: "item", entry });
  }
  return tokens;
}

export function AppBreadcrumb({ items, className, listClassName }: AppBreadcrumbProps) {
  const safeItems = (items || []).filter((item) => item?.label?.trim());
  if (safeItems.length === 0) return null;

  const tokens = buildTokens(safeItems);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={cn("text-sm", listClassName)}>
        {tokens.map((token, index) => {
          const isLast = index === tokens.length - 1;
          const isFirst = index === 0;

          return (
            <Fragment key={`${token.type}-${index}`}>
              {!isFirst ? <BreadcrumbSeparator /> : null}

              {token.type === "ellipsis" ? (
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <BreadcrumbEllipsis />
                      <span className="sr-only">Open breadcrumb menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-44">
                      <DropdownMenuGroup>
                        {token.hiddenItems.map((item) => (
                          <DropdownMenuItem key={`${item.label}-${item.href || "item"}`}>
                            {item.href ? (
                              <Link href={item.href} prefetch={false} className="w-full">
                                {item.label}
                              </Link>
                            ) : (
                              <span className="w-full">{item.label}</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  {isLast || !token.entry.href ? (
                    <BreadcrumbPage>{token.entry.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={token.entry.href} prefetch={false} />}>
                      {token.entry.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

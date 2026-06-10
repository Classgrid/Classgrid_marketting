"use client";

import { useTheme } from "next-themes";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ThemeMode = "system" | "light" | "dark";

const options: Array<{ value: ThemeMode; label: string; Icon: typeof MonitorCog }> = [
  { value: "system", label: "System", Icon: MonitorCog },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = (theme as ThemeMode | undefined) ?? "system";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-[#fafafa]/90 p-1 dark:border-zinc-700 dark:bg-zinc-950/90",
        className
      )}
      aria-label="Theme switcher"
      role="group"
    >
      {options.map(({ value, label, Icon }) => {
        const isActive = currentTheme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full text-xs font-medium transition",
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                : "text-slate-500 hover:bg-slate-100 hover:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-white"
            )}
            aria-label={`Switch theme to ${label}`}
            aria-pressed={isActive}
            title={label}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const modes = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeModeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[34px] w-[98px]" />;
  }

  return (
    <div className="inline-flex h-[34px] items-center rounded-full border border-border bg-card p-[3px]">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = theme === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => setTheme(mode.value)}
            className={cn(
              "relative flex h-7 w-8 items-center justify-center rounded-full transition-colors duration-200",
              active
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
            title={mode.label}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

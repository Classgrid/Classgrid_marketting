"use client";

import { useEffect, useState } from "react";
import { Laptop2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const modes = [
  { value: "system", label: "System", icon: Laptop2 },
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
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-[#fafafa] p-1 dark:border-white/15 dark:bg-[#0A0A0A]">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const active = theme === mode.value;

        return (
          <Button
            key={mode.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTheme(mode.value)}
            className={[
              "h-8 w-8 rounded-full p-0",
              active
                ? "bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-white",
            ].join(" ")}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

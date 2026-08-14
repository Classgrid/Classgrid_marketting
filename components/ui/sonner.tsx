"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Spinner className="w-4 h-4 text-inherit" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--error-bg": "hsl(0 84% 60% / 0.12)",
          "--error-text": "hsl(0 84% 60%)",
          "--error-border": "hsl(0 84% 60% / 0.3)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast cursor-pointer",
          error: "!bg-red-50 dark:!bg-[#2e0e0e] !border-red-200 dark:!border-red-900 !text-red-600 dark:!text-red-400 [&_[data-description]]:!text-red-500/80 dark:[&_[data-description]]:!text-red-400/80",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

type BlogFloatingSocialBarProps = {
  shareUrl?: string;
};

type SocialItem = {
  href: string;
  label: string;
  icon: ElementType;
};

const DEFAULT_BLOG_URL = "https://classgrid.in/blog";

export function BlogFloatingSocialBar({ shareUrl }: BlogFloatingSocialBarProps) {
  const [resolvedShareUrl, setResolvedShareUrl] = useState(shareUrl || DEFAULT_BLOG_URL);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (shareUrl?.trim()) {
      setResolvedShareUrl(shareUrl);
      return;
    }
    if (typeof window !== "undefined") {
      setResolvedShareUrl(window.location.href || DEFAULT_BLOG_URL);
    }
  }, [shareUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.05 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const items = useMemo<SocialItem[]>(() => {
    const whatsappMessage = `Hey ClassGrid team! I'm reading this blog post and would like to know more:\n\n${resolvedShareUrl || DEFAULT_BLOG_URL}`;
    const whatsappHref = `https://wa.me/918149277038?text=${encodeURIComponent(whatsappMessage)}`;

    return [
      {
        href: "https://www.instagram.com/classgridedu/",
        label: "Instagram",
        icon: Instagram,
      },
      {
        href: "https://www.facebook.com/profile.php?id=61588646851017",
        label: "Facebook",
        icon: Facebook,
      },
      {
        href: "https://www.youtube.com/channel/UC3ayKBJSpgxEhQQD1Ux6SaA",
        label: "YouTube",
        icon: Youtube,
      },
      {
        href: whatsappHref,
        label: "WhatsApp",
        icon: WhatsappIcon,
      },
    ];
  }, [resolvedShareUrl]);

  return (
    <aside
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-200 md:flex ${
        isFooterVisible ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-label="Share and social links"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition duration-200 hover:scale-105 hover:border-emerald-500 hover:text-emerald-500"
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </aside>
  );
}

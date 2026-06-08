"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  ChevronRight,
  Code2,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Scroll,
  Zap,
} from "lucide-react";
import { buildLangHref, extractLocaleString, type SupportedLang } from "@/lib/locale";
import { getCategoryArticles } from "./actions";

const ICON_MAP: Record<string, any> = {
  BookOpen,
  GraduationCap,
  Code2,
  HelpCircle,
  Zap,
  FileText,
  LayoutGrid,
  Scroll,
  Building2,
  Shield: Building2,
};

const CATEGORY_ACCENT: Record<string, { iconBg: string; iconColor: string }> = {
  "Getting Started": { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  "Guides": { iconBg: "bg-teal-500/10", iconColor: "text-teal-500" },
  "API Reference": { iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500" },
  "I am a Student": { iconBg: "bg-sky-500/10", iconColor: "text-sky-500" },
  "I am a Teacher": { iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
  "I am an Admin": { iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
};

const DEFAULT_ACCENT = { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" };

export default function CategoryPageClient({ slug, lang, initialData }: { slug: string; lang: SupportedLang; initialData: any }) {
  const [categoryData, setCategoryData] = useState<any>(initialData.category);
  const [articles, setArticles] = useState<any[]>(initialData.articles);

  const accent = categoryData ? (CATEGORY_ACCENT[categoryData.title] || DEFAULT_ACCENT) : DEFAULT_ACCENT;
  const IconComp = categoryData ? (ICON_MAP[categoryData.icon] || FileText) : FileText;

  // Group articles by subCategory (fallback to "General")
  const grouped: Record<string, any[]> = {};
  articles.forEach((article) => {
    const group = article.subCategory || "General";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(article);
  });
  const groupNames = Object.keys(grouped);

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-8 pb-16 overflow-hidden selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      <div className="px-6 max-w-4xl mx-auto">

        {/* Category Header */}
        {categoryData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className={`w-16 h-16 rounded-2xl ${accent.iconBg} flex items-center justify-center mb-4`}>
              <IconComp className={`w-8 h-8 ${accent.iconColor}`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
              {categoryData.title}
            </h1>
            <p className="text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </p>
          </motion.div>
        ) : (
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-foreground">Category not found</h1>
          </div>
        )}

        {/* Article Groups */}
        {groupNames.length > 0 ? (
          <div className="space-y-8">
            {groupNames.map((groupName, groupIndex) => (
              <motion.div
                key={groupName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * groupIndex }}
                {/* Group Header */}
                <h2 className="text-xl font-bold text-foreground mb-4 pl-1">{groupName}</h2>

                {/* Articles Card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">                {/* Articles in this group */}
                <div className="flex flex-col">
                  {grouped[groupName].map((article: any, index: number) => (
                    <Link
                      key={`${article.slug}-${index}`}
                      href={buildLangHref(`/help-center/article/${article.slug}`, lang)}
                      className="group flex items-center justify-between p-4 md:p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <h3 className="text-[15px] font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pr-4 truncate">
                        {extractLocaleString(article.title, lang)}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No articles in this category yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

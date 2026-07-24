"use client";

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';

const components = {
  Callout,
  pre: CodeBlock,
  code: ({ children, className }: any) => {
    if (className) return <code className={className}>{children}</code>;
    return <code className="bg-slate-100 dark:bg-white/10 rounded px-1.5 py-0.5 text-[13px] font-mono text-slate-800 dark:text-emerald-400">{children}</code>;
  }
};

export function MdxRenderer({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} components={components} />;
}

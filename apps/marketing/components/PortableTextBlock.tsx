import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-3 text-sm text-slate-300">{children}</p>,
    h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-4 text-lg font-semibold text-white">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l border-white/20 pl-4 text-sm text-slate-200">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">{children}</ul>,
    number: ({ children }) => <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
    link: ({ children, value }) => (
      <a className="underline" href={value?.href} rel="noreferrer">
        {children}
      </a>
    ),
  },
};

export function PortableTextBlock({ value }: { value: unknown }) {
  return <PortableText value={value} components={components} />;
}

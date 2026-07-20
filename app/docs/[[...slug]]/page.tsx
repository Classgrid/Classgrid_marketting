import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsImage } from '@/components/docs/docs-image';
import { DocsNavigation } from '@/components/docs/docs-navigation';
import { DocsFAQItem, DocsFAQSummary } from '@/components/docs/docs-faq';
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 0; // disabled caching for development

async function getDocFromSanity(slug: string) {
  const query = `*[_type == "apiDoc" && slug.current == $slug][0]`;
  return await client.fetch(query, { slug });
}

async function getFirstDocSlug() {
  const query = `*[_type == "apiDoc"] | order(title asc) [0] { "slug": slug.current }`;
  const first = await client.fetch(query);
  return first?.slug || null;
}

export default async function DocPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  
  // If no slug, always open the Introduction page
  const slugPath = resolvedParams.slug ? resolvedParams.slug.join('/') : 'introduction';
  
  const doc = await getDocFromSanity(slugPath!);

  if (!doc) {
    notFound();
  }

  const displayDate = new Date(doc.publishedAt || doc._createdAt);
  const updatedAt = new Date(doc._updatedAt);
  
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dateLabel = `Last updated ${formatter.format(displayDate)}`;

  const jsonLdData = [
    {
      "@type": "TechArticle",
      "@id": `https://classgrid.in/docs/${slugPath}/#article`,
      "headline": doc.title,
      "datePublished": displayDate.toISOString(),
      "dateModified": updatedAt.toISOString(),
      "publisher": { "@id": "https://classgrid.in/#organization" },
      "about": { "@id": "https://classgrid.in/#software" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://classgrid.in/" },
        { "@type": "ListItem", "position": 2, "name": "Docs", "item": "https://classgrid.in/docs" },
        { "@type": "ListItem", "position": 3, "name": doc.title, "item": `https://classgrid.in/docs/${slugPath}` }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <article className="min-w-0 flex-1 pb-24">
      <header className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          {doc.title}
        </h1>
        <p className="text-sm text-zinc-400">
          {dateLabel}
        </p>
      </header>

      <div 
        id="markdown-content-wrapper"
        className="docs-content max-w-none"
        data-markdown={doc.content}
      >
        {doc.content ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={{
              pre: CodeBlock,
              img: ({ src, alt, title }) => <DocsImage src={src} alt={alt} title={title} />,
              code: ({ children, className }) => {
                if (className) return <code className={className}>{children}</code>;
                return <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-emerald-400">{children}</code>;
              },
              callout: (props: any) => <Callout type={props.type || 'info'}>{props.children}</Callout>,
              h2: ({ node, children, ...props }) => {
                const id = props.id;
                return (
                  <h2 {...props} className="group relative scroll-mt-24">
                    {id && (
                      <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-emerald-400 transition-colors font-normal no-underline flex items-center justify-center w-6 h-6" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      </a>
                    )}
                    {children}
                  </h2>
                );
              },
              h3: ({ node, children, ...props }) => {
                const id = props.id;
                return (
                  <h3 {...props} className="group relative scroll-mt-24">
                    {id && (
                      <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-emerald-400 transition-colors font-normal no-underline flex items-center justify-center w-6 h-6" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      </a>
                    )}
                    {children}
                  </h3>
                );
              },
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto w-full my-8 pb-4 custom-scrollbar">
                  <table {...props} className="w-full text-left border-collapse min-w-[600px]">{children}</table>
                </div>
              ),
              details: ({ children, ...props }: any) => (
                <DocsFAQItem open={props.open}>{children}</DocsFAQItem>
              ),
              summary: ({ children }: any) => (
                <DocsFAQSummary>{children}</DocsFAQSummary>
              ),
            }}
          >
            {doc.content}
          </ReactMarkdown>
        ) : (
          <p className="text-zinc-400">This documentation page is currently empty.</p>
        )}
      </div>
      <DocsNavigation />
    </article>
    </>
  );
}

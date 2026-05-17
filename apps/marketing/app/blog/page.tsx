import { blogCopy, blogTopics, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getPageSettings, getPosts } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.blog);

export default async function Page() {
  const [cmsSettings, cmsPosts] = await Promise.all([
    getPageSettings("blog"),
    getPosts(),
  ]);
  const title = cmsSettings?.title ?? blogCopy.title;
  const subtitle = cmsSettings?.subtitle ?? blogCopy.subtitle;
  const posts = cmsPosts?.length ? cmsPosts : blogTopics.map((topic) => ({ title: topic }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {posts.map((post: any) => (
          <article key={post._id ?? post.title} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{blogCopy.cardKicker}</p>
            <h2 className="text-heading mt-2 text-xl font-semibold text-white">{post.title}</h2>
            <p className="mt-3 text-sm text-slate-300">{blogCopy.cardBody}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

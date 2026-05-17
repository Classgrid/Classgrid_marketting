import { pageMeta, reviewsCopy, testimonials } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getPageSettings, getTestimonials } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.reviews);

export default async function Page() {
  const [cmsSettings, cmsTestimonials] = await Promise.all([
    getPageSettings("reviews"),
    getTestimonials(),
  ]);
  const title = cmsSettings?.title ?? reviewsCopy.title;
  const subtitle = cmsSettings?.subtitle ?? reviewsCopy.subtitle;
  const items = cmsTestimonials?.length ? cmsTestimonials : testimonials;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((testimonial: any) => (
          <article
            key={`${testimonial.name ?? testimonial._id}-${testimonial.role ?? testimonial.company ?? ""}`}
            className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5"
          >
            <p className="text-sm text-slate-200">"{testimonial.quote}"</p>
            <p className="mt-4 text-xs tracking-[0.1em] text-blue-200 uppercase">{testimonial.name}</p>
            <p className="text-sm text-slate-300">{testimonial.role}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

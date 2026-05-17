import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CmsFallback } from "@/components/ui/CmsErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { events, getEventBySlug } from "@/content/campusCommunity";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | Classgrid",
      description: "The requested event detail page could not be found.",
    };
  }

  return {
    title: `${event.title} | Classgrid Events`,
    description: event.summary,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return <CmsFallback type="event" backHref="/events" backLabel="Back to Events" />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">

        <Badge
          className={
            event.status === "Upcoming"
              ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15"
              : undefined
          }
          variant={event.status === "Upcoming" ? "default" : "secondary"}
        >
          {event.status}
        </Badge>
        <SectionAccentBar align="left" className="mt-6" />
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">{event.title}</h1>
        <p className="mt-4 max-w-4xl text-base text-muted-foreground sm:text-lg">{event.longDescription}</p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="relative h-[320px] overflow-hidden rounded-xl border border-border bg-muted sm:h-[420px]">
          <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/80 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">Event Highlights</CardTitle>
              <CardDescription>{event.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.highlights.map((point) => (
                <div key={point} className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                  {point}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-emerald-500" />
                <span>{event.dateLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4 text-emerald-500" />
                <span>{event.timeLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>{event.venue}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-2xl">Event Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {event.schedule.map((slot) => (
              <div key={`${slot.time}-${slot.session}`} className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">{slot.time}</p>
                <p className="text-sm text-muted-foreground">{slot.session}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionAccentBar align="left" />
        <h2 className="mb-6 text-2xl font-bold">Mini Gallery</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {event.gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative h-44 overflow-hidden rounded-xl border border-border bg-muted"
            >
              <Image src={image} alt={`${event.title} image ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

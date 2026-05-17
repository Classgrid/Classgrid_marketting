import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { events } from "@/content/campusCommunity";

export const metadata: Metadata = {
  title: "Events | Classgrid",
  description: "Upcoming and past campus events including festivals, lectures, and academic showcases.",
};

export default function EventsPage() {
  const upcomingEvents = events.filter((event) => event.status === "Upcoming");
  const pastEvents = events.filter((event) => event.status === "Past");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15">Campus Events</Badge>
        <SectionAccentBar align="left" className="mt-6" />
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Upcoming & Past Events
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
          Discover major campus events including annual sports day, tech fest, guest lectures, and more.
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionAccentBar align="left" />
        <div className="mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-emerald-500" />
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card key={event.slug} className="overflow-hidden border-border/80">
              <div className="relative h-44 border-b border-border bg-muted">
                <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <Badge className="w-fit bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15">
                  {event.status}
                </Badge>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.summary}</CardDescription>
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
                <Button asChild size="sm" className="bg-emerald-500 text-black hover:bg-emerald-500/90">
                  <Link href={`/events/${event.slug}`}>View Event</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionAccentBar align="left" />
        <div className="mb-6 flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Past Events</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pastEvents.map((event) => (
            <Card key={event.slug} className="overflow-hidden border-border/80">
              <div className="relative h-44 border-b border-border bg-muted">
                <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  {event.status}
                </Badge>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/events/${event.slug}`}>See Highlights</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

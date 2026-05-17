import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { PlayCircle } from "lucide-react";
import { galleryItems } from "@/content/campusCommunity";

export const metadata: Metadata = {
  title: "Gallery | Classgrid",
  description: "Campus photo and video gallery showcasing facilities, labs, classrooms, and celebrations.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="space-y-5">
          <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15">Gallery</Badge>
          <SectionAccentBar align="left" className="mb-0" />
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Campus Photo & Video Gallery
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Explore facilities, labs, classrooms, and celebrations through a premium masonry layout designed for
            admissions trust.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {galleryItems.map((item) => (
            <Card key={item.id} className="mb-4 break-inside-avoid overflow-hidden border-border/80">
              <div className={`relative ${item.heightClass} border-b border-border bg-muted`}>
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                {item.kind === "video" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                    <PlayCircle className="h-12 w-12 text-foreground" />
                  </div>
                ) : null}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                {item.kind === "video" ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={item.href || "#"}>Watch Clip</Link>
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Card className="border-border/80 bg-card p-6 text-center">
          <SectionAccentBar />
          <h2 className="text-2xl font-bold">Want to experience the campus in person?</h2>
          <p className="mt-2 text-muted-foreground">
            Book a guided visit and meet department mentors before admissions close.
          </p>
          <div className="mt-4">
            <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-500/90">
              <Link href="/demo">Schedule Campus Visit</Link>
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}

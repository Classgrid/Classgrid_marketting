import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import Link from "next/link";
import { alumniStories } from "@/content/campusCommunity";

export const metadata: Metadata = {
  title: "Alumni Network | Classgrid",
  description: "Notable alumni success stories, career outcomes, and testimonials for admissions trust.",
};

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return `${parts[0]?.charAt(0) || ""}${parts[1]?.charAt(0) || ""}`.toUpperCase();
}

export default function AlumniPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15">Alumni Network</Badge>
        <SectionAccentBar align="left" className="mt-6" />
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          Alumni Success Stories
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
          Strong alumni outcomes build institutional trust. Explore where our graduates are currently working and
          studying.
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-emerald-500">12,000+</CardTitle>
              <CardDescription>Active alumni community</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-emerald-500">450+</CardTitle>
              <CardDescription>Alumni in top global organizations</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-emerald-500">90+</CardTitle>
              <CardDescription>Alumni-led mentorship sessions yearly</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {alumniStories.map((alumni) => (
            <Card key={`${alumni.name}-${alumni.batch}`} className="border-border/80">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-border">
                    <AvatarFallback className="bg-muted text-foreground">{getInitials(alumni.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{alumni.name}</CardTitle>
                    <CardDescription>{alumni.batch}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-sm font-semibold text-foreground">{alumni.currentRole}</p>
                  <p className="text-sm text-muted-foreground">{alumni.currentOrg}</p>
                </div>
                <p className="text-sm text-muted-foreground">"{alumni.quote}"</p>
                <p className="text-sm font-medium text-foreground">{alumni.achievement}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Card className="border-border/80 bg-card p-6 text-center">
          <SectionAccentBar />
          <h2 className="text-2xl font-bold">Want outcomes like these for your career?</h2>
          <p className="mt-2 text-muted-foreground">
            Start your admission journey and join a network that keeps creating leaders.
          </p>
          <div className="mt-4">
            <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-500/90">
              <Link href="/demo">Apply Now</Link>
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}

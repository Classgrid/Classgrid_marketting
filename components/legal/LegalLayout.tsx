import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Mail, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { LegalBodyClass } from "@/components/legal/LegalBodyClass";
import { LegalTOC } from "@/components/legal/LegalTOC";
import { LegalSection } from "@/components/legal/LegalSection";
import { Reveal } from "@/components/sections/Reveal";
import { DocumentHero } from "@/components/ui/DocumentHero";
import type { LegalIntroContent, LegalSection as LegalSectionData } from "@/components/legal/types";

type LegalLayoutProps = {
  title: string;
  updated: string;
  effectiveDate: string;
  description: string;
  pageLabel: string;
  intro: LegalIntroContent;
  sections: LegalSectionData[];
};

type ContactVariant = "grievance" | null;

type PortableTextBlock = {
  _type?: string;
  children?: Array<{ text?: string }>;
};

function normalizeToken(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
}

function resolveContactVariant(section: LegalSectionData): ContactVariant {
  const idToken = normalizeToken(section.id);
  const titleToken = normalizeToken(section.title);

  if (idToken.includes("grievance-officer") || titleToken.includes("grievanceofficer")) {
    return "grievance";
  }

  return null;
}

function isLegacyContactLine(input: string) {
  const normalized = input.toLowerCase();
  return (
    normalized.includes("name:") ||
    normalized.includes("designation:") ||
    normalized.includes("email:") ||
    normalized.includes("support email:") ||
    normalized.includes("sales email:") ||
    normalized.includes("phone:") ||
    normalized.includes("whatsapp") ||
    normalized.includes("website:") ||
    normalized.includes("address:") ||
    normalized.includes("nikhil patil") ||
    normalized.includes("@classgrid.in")
  );
}

function blockToText(block: PortableTextBlock) {
  return (block.children ?? []).map((child) => child?.text ?? "").join(" ").trim();
}

function filterLegacyContactBlocks(content: unknown) {
  if (!Array.isArray(content)) return content;

  return content.filter((block) => {
    if (!block || typeof block !== "object") return true;
    if ((block as PortableTextBlock)._type !== "block") return true;

    const text = blockToText(block as PortableTextBlock);
    return !isLegacyContactLine(text);
  });
}

function LegalContactCard() {
  const title = "Grievance Officer";
  const subtitle = "For grievance, privacy, and compliance communication.";
  const role = "Grievance Officer, Classgrid Technologies";

  return (
    <Card className="my-5 overflow-hidden border-border/80 bg-card/60 backdrop-blur-xl">
      <CardContent className="space-y-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              {title}
            </Badge>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="grid gap-2 rounded-lg border border-border bg-background/40 p-4">
          <p className="flex items-center gap-2 text-sm text-foreground">
            <UserRound className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold">Name:</span>
            <span>Nikhil Shinde</span>
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Designation:</span>{" "}
            {role}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Working Hours:</span>{" "}
            Monday to Saturday, 9:00 AM to 6:00 PM IST
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="border-border bg-background/50">
            <a href="mailto:nikhil.shinde@classgrid.in">
              <Mail className="mr-2 h-4 w-4" />
              nikhil.shinde@classgrid.in
            </a>
          </Button>
          <Button asChild variant="outline" className="border-border bg-background/50">
            <a href="mailto:support@classgrid.in">
              <Mail className="mr-2 h-4 w-4" />
              support@classgrid.in
            </a>
          </Button>
          <Button asChild variant="outline" className="border-border bg-background/50">
            <a href="tel:+918623947038">
              <Phone className="mr-2 h-4 w-4" />
              Call +91 8623947038
            </a>
          </Button>
          <Button asChild variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            <a href="https://wa.me/918623947038" target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp +91 8623947038
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="text-[0.95rem] font-medium leading-8 text-muted-foreground">{children}</p>,
    h2: ({ children }: any) => <h3 className="mt-8 text-[1.1rem] font-bold text-emerald-500">{children}</h3>,
    h3: ({ children }: any) => <h4 className="mt-6 text-base font-semibold text-emerald-500">{children}</h4>,
  },
  types: {
    legalTable: ({ value }: any) => (
      <div className="my-6 overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {(value?.headers ?? []).map((header: string) => (
                <TableHead key={header} className="whitespace-normal text-sm font-semibold text-foreground">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(value?.rows ?? []).map((row: { _key: string; cells: string[] }) => (
              <TableRow key={row._key}>
                {(row.cells ?? []).map((cell: string, index: number) => (
                  <TableCell key={`${row._key}-${index}`} className="whitespace-normal align-top text-sm text-muted-foreground">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }: any) => <em className="text-foreground/90">{children}</em>,
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isHttp = href.startsWith("http");
      return (
        <a
          href={href}
          className="font-medium text-emerald-500 underline underline-offset-2 hover:text-emerald-500/90"
          rel={isHttp ? "noreferrer" : undefined}
          target={isHttp ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  listItem: {
    bullet: ({ children }: any) => <li className="ml-5 list-disc text-[0.95rem] leading-8 text-muted-foreground">{children}</li>,
  },
};

export function LegalLayout({
  title,
  updated,
  effectiveDate,
  description,
  pageLabel,
  intro,
  sections,
}: LegalLayoutProps) {
  return (
    <div className="legal-page-root min-h-screen bg-background text-foreground">
      <LegalBodyClass />

      {/* Flex row: sticky sidebar + main content side by side */}
      <div className="flex min-h-screen">
        <LegalTOC sections={sections} />

        <main className="flex-1 min-w-0">
        <section className="border-b border-border bg-background">
          <div className="w-full max-w-[780px] px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-9">
            <DocumentHero 
              badgeLabel={`Legal Document / ${pageLabel}`}
              title={title}
              subtitles={[updated, effectiveDate]}
              description={description}
              showAccentBar={false}
            />
          </div>
        </section>

        <section className="w-full max-w-[780px] px-4 py-12 sm:px-6 xl:pl-6 xl:pr-8">
          <Card className="border-border bg-card/40">
            <CardContent className="space-y-6 py-6 sm:py-7">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">{intro.introductionHeading}</h2>
                <div className="space-y-3">
                  {intro.introductionParagraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[0.95rem] leading-8 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              {intro.scopeParagraphs.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{intro.scopeHeading}</h3>
                  <div className="space-y-3">
                    {intro.scopeParagraphs.map((paragraph) => (
                      <p key={paragraph} className="text-[0.95rem] leading-8 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="mt-10">
            {sections.map((section, index) => (
              (() => {
                const contactVariant = resolveContactVariant(section);
                const content = contactVariant ? filterLegacyContactBlocks(section.content) : section.content;
                const showBody = section.body && !(contactVariant && isLegacyContactLine(section.body));
                const bullets =
                  section.bullets?.filter((bullet) => !(contactVariant && isLegacyContactLine(bullet))) ?? [];

                return (
                  <LegalSection
                    key={section.id}
                    id={section.id}
                    number={String(index + 1).padStart(2, "0")}
                    title={section.title.replace(/^\s*\d+[\.\)]\s*/, "")}
                    meta={[updated]}
                  >
                    {contactVariant ? <LegalContactCard /> : null}
                    {content ? <PortableText value={content} components={portableTextComponents} /> : null}
                    {showBody ? <p className="text-[0.95rem] font-medium leading-8 text-muted-foreground">{section.body}</p> : null}
                    {bullets.length ? (
                      <ul className="space-y-2">
                        {bullets.map((bullet) => (
                          <li key={bullet} className="ml-5 list-disc text-[0.95rem] leading-8 text-muted-foreground">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </LegalSection>
                );
              })()
            ))}
          </div>

          <Card className="mt-6 border-border bg-card transition-colors duration-300 hover:border-emerald-500/40">
            <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Need legal help?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contact our team for policy, security, or compliance clarifications.
                </p>
              </div>
              <Button asChild className="bg-emerald-500 transition-transform duration-200 hover:scale-[1.02] hover:bg-emerald-500/90">
                <Link href="/contact">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      </div>{/* end flex row */}
    </div>
  );
}

export type LegalSection = {
  id: string;
  title: string;
  content?: any;
  body?: string;
  bullets?: string[];
};

export type LegalIntroContent = {
  introductionHeading: string;
  introductionParagraphs: string[];
  scopeHeading: string;
  scopeParagraphs: string[];
};

export type LegalLink = {
  label: string;
  href: string;
  slug: string;
};

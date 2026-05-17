export const PRICING_INTENT_TERMS = [
  "pricing",
  "price",
  "plans",
  "plan",
  "fees",
  "fee",
  "cost",
  "costing",
  "subscription",
  "billing",
  "quote",
  "quotation",
  "enterprise",
  "premium",
] as const;

export const BOOK_DEMO_INTENT_TERMS = [
  "book a demo",
  "book demo",
  "demo",
  "join",
  "register",
  "registration",
  "onboarding",
  "onboard",
  "how do we use",
  "how to use",
  "process",
  "what happens after",
  "institution registration",
  "schedule",
  "meeting",
  "walkthrough",
  "consultation",
] as const;

export const FORBIDDEN_ONBOARDING_PHRASES = [
  "create account to begin",
  "create an account to begin",
  "self onboarding",
  "self-onboarding",
  "instant setup",
  "instant activation",
  "instant access",
  "start immediately",
  "start using instantly",
  "get started",
] as const;

export const PREFERRED_ONBOARDING_PHRASES = [
  "Book a Demo",
  "schedule discussion",
  "institution consultation",
  "platform walkthrough",
  "demo session",
  "Classgrid team will connect",
  "guided onboarding process",
] as const;

function includesAnyTerm(text: string, terms: readonly string[]) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

export function detectPricingIntent(question: string) {
  return includesAnyTerm(question, PRICING_INTENT_TERMS);
}

export function detectBookDemoIntent(question: string) {
  return includesAnyTerm(question, BOOK_DEMO_INTENT_TERMS);
}

export function expandRetrievalQueryForIntent(question: string) {
  const additions: string[] = [];

  if (detectPricingIntent(question)) {
    additions.push("pricing plans fees subscription billing quote cost pricing page");
  }

  if (detectBookDemoIntent(question)) {
    additions.push("Book a Demo demo form schedule meeting walkthrough onboarding consultation");
  }

  return additions.length ? `${question}\n${additions.join("\n")}` : question;
}

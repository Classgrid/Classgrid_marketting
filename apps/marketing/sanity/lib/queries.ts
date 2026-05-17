export const postsQuery = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  body
}`;

export const changelogEntriesQuery = `*[_type == "changelogEntry"] | order(publishedAt desc){
  _id,
  title,
  summary,
  publishedAt,
  body
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  name,
  role,
  company,
  quote,
  rating,
  avatar
}`;

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(_createdAt desc){
  _id,
  title,
  summary,
  client,
  results,
  "slug": slug.current,
  heroImage
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  title,
  summary,
  client,
  results,
  "slug": slug.current,
  heroImage,
  body
}`;

export const faqItemsQuery = `*[_type == "faqItem"] | order(_createdAt asc){
  _id,
  question,
  answer,
  category
}`;

export const campaignPagesQuery = `*[_type == "campaignPage"] | order(_createdAt desc){
  _id,
  title,
  campaignId,
  headline,
  subheadline,
  cta,
  ctaLink,
  "slug": coalesce(seo.slug, campaignId)
}`;

export const campaignPageBySlugQuery = `*[_type == "campaignPage" && (seo.slug == $slug || campaignId == $slug)][0]{
  _id,
  title,
  campaignId,
  headline,
  subheadline,
  targetAudience,
  painPoints,
  heroImage,
  benefits,
  cta,
  ctaLink,
  socialProof,
  "slug": coalesce(seo.slug, campaignId)
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  _id,
  headline,
  body,
  mission,
  vision,
  teamImage,
  values
}`;

export const homePageQuery = `*[_type == "homePage"][0]{
  _id,
  headline,
  subheadline,
  trustedBy,
  machineShowcase,
  pillars,
  stats,
  moduleHighlights,
  footerCta,
  whatsNew
}`;

export const featuresPageQuery = `*[_type == "featuresPage"][0]{
  _id,
  headline,
  subheadline,
  features,
  coreModules
}`;

export const pricingPageQuery = `*[_type == "pricingPage"][0]{
  _id,
  headline,
  subheadline,
  plans,
  moduleMatrix,
  premiumSection,
  faq,
  contactSales
}`;

export const demoPageQuery = `*[_type == "demoPage"][0]{
  _id,
  headline,
  subheadline,
  benefits,
  formFields,
  ctaButton,
  successMessage
}`;

export const integrationsPageQuery = `*[_type == "integrationsPage"][0]{
  _id,
  headline,
  subheadline,
  integrations,
  apiDocumentation,
  customIntegrationCta
}`;

export const tourPageQuery = `*[_type == "tourPage"][0]{
  _id,
  headline,
  subheadline,
  steps,
  videoUrl
}`;

export const supportPageQuery = `*[_type == "supportPage"][0]{
  _id,
  headline,
  subheadline,
  supportChannels,
  knowledgeBaseUrl
}`;

export const contactPageQuery = `*[_type == "contactPage"][0]{
  _id,
  headline,
  subheadline,
  contacts,
  officeLocations,
  formFields
}`;

export const salesContactPageQuery = `*[_type == "salesContactPage"][0]{
  _id,
  kicker,
  title,
  titleAccent,
  body,
  metrics,
  form{
    title,
    subtitle,
    submitLabel,
    fields{
      email,
      institution,
      role,
      rolePlaceholder,
      roles
    }
  },
  socialProof{
    kicker,
    names
  }
}`;

export const useCasesLandingPageQuery = `*[_type == "useCasesLandingPage"][0]{
  _id,
  headline,
  subheadline,
  links
}`;

export const useCasePageByAudienceQuery = `*[_type == "useCasePage" && audience == $audience][0]{
  _id,
  audience,
  headline,
  subheadline,
  benefits,
  heroImage,
  testimonial,
  cta
}`;

export const institutionPagesQuery = `*[_type == "institutionPage"]{
  _id,
  institutionType,
  label,
  headline,
  subline,
  capabilities,
  counters
}`;

export const institutionPageByTypeQuery = `*[_type == "institutionPage" && institutionType == $institutionType][0]{
  _id,
  institutionType,
  label,
  headline,
  subline,
  capabilities,
  counters
}`;

export const policyPageByTypeQuery = `*[_type == "policyPage" && pageType == $pageType][0]{
  _id,
  pageType,
  headline,
  lastUpdated,
  content,
  sections
}`;

export const statusPageQuery = `*[_type == "statusPage"][0]{
  _id,
  kicker,
  headline,
  subheadline,
  systems
}`;

export const pageSettingsBySlugQuery = `*[_type == "pageSettings" && slug == $slug][0]{
  _id,
  slug,
  title,
  subtitle,
  kicker,
  body,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref
}`;

export const comparisonPagesQuery = `*[_type == "comparisonPage"] | order(competitorName asc){
  _id,
  competitorName,
  slug,
  headline
}`;

export const comparisonPageBySlugQuery = `*[_type == "comparisonPage" && slug == $slug][0]{
  _id,
  competitorName,
  slug,
  headline,
  intro,
  comparisonTable,
  uniqueAdvantages,
  cta
}`;

import { client } from './client'
import {
  aboutPageQuery,
  campaignPagesQuery,
  campaignPageBySlugQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  changelogEntriesQuery,
  comparisonPageBySlugQuery,
  comparisonPagesQuery,
  contactPageQuery,
  demoPageQuery,
  faqItemsQuery,
  featuresPageQuery,
  homePageQuery,
  integrationsPageQuery,
  institutionPageByTypeQuery,
  institutionPagesQuery,
  pageSettingsBySlugQuery,
  policyPageByTypeQuery,
  postsQuery,
  pricingPageQuery,
  salesContactPageQuery,
  statusPageQuery,
  supportPageQuery,
  testimonialsQuery,
  tourPageQuery,
  useCasePageByAudienceQuery,
  useCasesLandingPageQuery,
} from './queries'

async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params)
  } catch {
    return null
  }
}

export const getHomePage = () => safeFetch(homePageQuery)
export const getAboutPage = () => safeFetch(aboutPageQuery)
export const getFeaturesPage = () => safeFetch(featuresPageQuery)
export const getPricingPage = () => safeFetch(pricingPageQuery)
export const getDemoPage = () => safeFetch(demoPageQuery)
export const getTourPage = () => safeFetch(tourPageQuery)
export const getIntegrationsPage = () => safeFetch(integrationsPageQuery)
export const getSupportPage = () => safeFetch(supportPageQuery)
export const getContactPage = () => safeFetch(contactPageQuery)
export const getSalesContactPage = () => safeFetch(salesContactPageQuery)
export const getUseCasesLandingPage = () => safeFetch(useCasesLandingPageQuery)
export const getUseCasePage = (audience: string) => safeFetch(useCasePageByAudienceQuery, { audience })
export const getInstitutionPages = () => safeFetch(institutionPagesQuery)
export const getInstitutionPage = (institutionType: string) =>
  safeFetch(institutionPageByTypeQuery, { institutionType })
export const getPolicyPage = (pageType: string) => safeFetch(policyPageByTypeQuery, { pageType })
export const getStatusPage = () => safeFetch(statusPageQuery)
export const getPageSettings = (slug: string) => safeFetch(pageSettingsBySlugQuery, { slug })

export const getPosts = () => safeFetch(postsQuery)
export const getCaseStudies = () => safeFetch(caseStudiesQuery)
export const getCaseStudyBySlug = (slug: string) => safeFetch(caseStudyBySlugQuery, { slug })
export const getTestimonials = () => safeFetch(testimonialsQuery)
export const getFaqItems = () => safeFetch(faqItemsQuery)
export const getChangelogEntries = () => safeFetch(changelogEntriesQuery)
export const getCampaignPages = () => safeFetch(campaignPagesQuery)
export const getCampaignBySlug = (slug: string) => safeFetch(campaignPageBySlugQuery, { slug })
export const getComparisonPages = () => safeFetch(comparisonPagesQuery)
export const getComparisonBySlug = (slug: string) => safeFetch(comparisonPageBySlugQuery, { slug })

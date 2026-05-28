import { client } from './client'
import {
  aboutPageQuery,
  campaignPagesQuery,
  campaignPageBySlugQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  caseStudySettingsQuery,
  changelogEntriesQuery,
  changelogEntryBySlugQuery,
  changelogSettingsQuery,
  compareHubPageQuery,
  comparisonPageBySlugQuery,
  comparisonPagesQuery,
  contactPageQuery,
  demoPageQuery,
  faqItemsQuery,

  homeChromeQuery,
  homePageQuery,
  appEcosystemQuery,
  classgridIntegrationsQuery,
  classgridTalkQuery,
  circularTimelineQuery,
  integrationsPageQuery,
  institutionPageByTypeQuery,
  institutionPagesQuery,
  legalPageBySlugQuery,
  latestChangelogEntryQuery,
  pageSettingsBySlugQuery,
  policyPageByTypeQuery,
  postsQuery,
  pricingPageQuery,
  salesContactPageQuery,
  statusPageQuery,
  supportPageQuery,
  testimonialsQuery,
  testimonialVideosQuery,
  tourPageQuery,
  useCasePageByAudienceQuery,
  useCasesLandingPageQuery,
  clientLogosQuery,
  moduleBySlugQuery,
  allModulesQuery,
  solutionPageBySlugQuery,
  allSolutionModulesQuery,
  solutionModuleBySlugQuery,
  homeStatsQuery,
  sectionSettingsQuery,
  turboClassgridQuery,
  isometricStackQuery,
  classgridVideoQuery,
  classgridTeamVisionQuery,
} from './queries'

const SANITY_REVALIDATE_SECONDS = 300
const DEV_SANITY_TIMEOUT_MS = 15000   // increased: CDN can be slow from India
const PROD_SANITY_TIMEOUT_MS = 10000
const DEV_CACHE_TTL_MS = 60_000  // 60 s — fast enough for dev, avoids hitting Sanity on every hot reload
const PROD_CACHE_TTL_MS = SANITY_REVALIDATE_SECONDS * 1000

const inMemoryFetchCache = new Map<string, { expiresAt: number; value: unknown }>()

type SafeFetchOptions = {
  disableInMemoryCache?: boolean
}

function getCacheKey(query: string, params?: Record<string, unknown>) {
  return `${query}::${JSON.stringify(params ?? {})}`
}

function getQueryLabel(query: string): string {
  const match = query.match(/\*\[_type\s*==\s*"([^"]+)"\]/)
  return match ? match[1] : query.slice(0, 40)
}

async function safeFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: SafeFetchOptions
): Promise<T | null> {
  const shouldUseInMemoryCache = !options?.disableInMemoryCache
  const cacheKey = getCacheKey(query, params)
  const label = getQueryLabel(query)
  const now = Date.now()
  const cached = shouldUseInMemoryCache ? inMemoryFetchCache.get(cacheKey) : null
  // Only serve from cache if value is non-null (never cache failures)
  if (shouldUseInMemoryCache && cached && cached.expiresAt > now && cached.value !== null) {
    return cached.value as T
  }

  const isDev = process.env.NODE_ENV === 'development'
  const cacheTtlMs = isDev ? DEV_CACHE_TTL_MS : PROD_CACHE_TTL_MS
  const timeoutMs = isDev ? DEV_SANITY_TIMEOUT_MS : PROD_SANITY_TIMEOUT_MS
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const start = Date.now()
  try {
    const response = await client.fetch<T>(query, params, {
      next: isDev ? undefined : { revalidate: SANITY_REVALIDATE_SECONDS },
      // In dev: bypass Next.js fetch cache (in-memory cache handles dedup).
      // In prod: use 'default' so Next.js ISR fetch cache works with revalidate above.
      cache: isDev ? 'no-store' : 'default',
      signal: controller.signal,
    })

    const elapsed = Date.now() - start
    // console.log(`[sanity] ✅ ${label}: ${elapsed}ms — got ${Array.isArray(response) ? response.length + ' items' : response ? 'object' : 'NULL'}`)

    // Only cache successful non-null responses
    if (shouldUseInMemoryCache && response !== null && response !== undefined) {
      inMemoryFetchCache.set(cacheKey, {
        value: response,
        expiresAt: now + cacheTtlMs,
      })
    }

    return response
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[sanity] ❌ ${label}: FAILED after ${Date.now() - start}ms — ${msg}`)
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

export const getHomePage = () => safeFetch(homePageQuery)
export const getCircularTimeline = () => safeFetch(circularTimelineQuery)
export const getHomeChrome = () => safeFetch(homeChromeQuery)
export const getAboutPage = () => safeFetch(aboutPageQuery)

export const getPricingPage = () => safeFetch(pricingPageQuery)
export const getDemoPage = () => safeFetch(demoPageQuery)
export const getTourPage = () => safeFetch(tourPageQuery)
export const getIntegrationsPage = () => safeFetch(integrationsPageQuery)
export const getClassgridIntegrations = () => safeFetch(classgridIntegrationsQuery)
export const getClassgridTalks = () => safeFetch(classgridTalkQuery)
export const getSupportPage = () => safeFetch(supportPageQuery)
export const getContactPage = () => safeFetch(contactPageQuery)
export const getSalesContactPage = () => safeFetch(salesContactPageQuery)
export const getUseCasesLandingPage = () => safeFetch(useCasesLandingPageQuery)
export const getUseCasePage = (audience: string) => safeFetch(useCasePageByAudienceQuery, { audience })
export const getInstitutionPages = () => safeFetch(institutionPagesQuery)
export const getInstitutionPage = (institutionType: string) =>
  safeFetch(institutionPageByTypeQuery, { institutionType })
export const getPolicyPage = (pageType: string) => safeFetch(policyPageByTypeQuery, { pageType })
export const getLegalPageBySlug = async (slug: string) => {
  const normalized = slug.toLowerCase().trim()
  const slugCandidates =
    normalized === 'cookies'
      ? ['cookies', 'cookie']
      : normalized === 'cookie'
        ? ['cookie', 'cookies']
        : [normalized]

  for (const candidate of slugCandidates) {
    const result = await safeFetch(legalPageBySlugQuery, { slug: candidate })
    if (result) {
      return result
    }
  }

  return null
}
export const getStatusPage = () => safeFetch(statusPageQuery)
export const getPageSettings = (slug: string) => safeFetch(pageSettingsBySlugQuery, { slug })

export const getPosts = () => safeFetch(postsQuery)
export const getCaseStudies = () => safeFetch(caseStudiesQuery)
export const getCaseStudyBySlug = (slug: string) => safeFetch(caseStudyBySlugQuery, { slug })
export const getTestimonials = () => safeFetch(testimonialsQuery)
export const getTestimonialVideos = () => safeFetch(testimonialVideosQuery)
export const getFaqItems = () => safeFetch(faqItemsQuery)
export const getChangelogSettings = () => safeFetch(changelogSettingsQuery)
export const getChangelogEntries = () => safeFetch(changelogEntriesQuery)
export const getChangelogEntryBySlug = (slug: string) => safeFetch(changelogEntryBySlugQuery, { slug })
export const getLatestChangelogEntry = () => safeFetch(latestChangelogEntryQuery)
export const getCampaignPages = () => safeFetch(campaignPagesQuery)
export const getCampaignBySlug = (slug: string) => safeFetch(campaignPageBySlugQuery, { slug })
export const getCompareHubPage = () => safeFetch(compareHubPageQuery)
export const getComparisonPages = () => safeFetch(comparisonPagesQuery)
export const getComparisonBySlug = (slug: string) => safeFetch(comparisonPageBySlugQuery, { slug }, { disableInMemoryCache: true })
export const getClientLogos = () => safeFetch(clientLogosQuery)
export const getModuleBySlug = (slug: string) => safeFetch(solutionModuleBySlugQuery, { slug }, { disableInMemoryCache: true })
export const getAllModules = () => safeFetch(allModulesQuery, undefined, { disableInMemoryCache: true })
export const getSolutionPage = (slug: string) => safeFetch(solutionPageBySlugQuery, { slug }, { disableInMemoryCache: true })
export const getAllSolutionModules = () => safeFetch(allSolutionModulesQuery, undefined, { disableInMemoryCache: true })
export const getSolutionModule = (slug: string) => safeFetch(solutionModuleBySlugQuery, { slug })
export const getHomeStats = () => safeFetch(homeStatsQuery)
export const getSectionSettings = () => safeFetch(sectionSettingsQuery)

export const getTurboClassgrid = () => safeFetch(turboClassgridQuery)
export const getIsometricStack = () => safeFetch(isometricStackQuery)
export const getAppEcosystem = () => safeFetch(appEcosystemQuery)
export const getCaseStudySettings = () => safeFetch(caseStudySettingsQuery)
export const getClassgridVideo = () => safeFetch(classgridVideoQuery)
export const getClassgridTeamVision = () => safeFetch(classgridTeamVisionQuery)

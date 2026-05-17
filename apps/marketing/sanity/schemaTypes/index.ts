import { type SchemaTypeDefinition } from 'sanity'
import { aboutPageType } from './aboutPageType'
import { campaignPageType } from './campaignPageType'
import { caseStudyType } from './caseStudyType'
import { changelogEntryType } from './changelogEntryType'
import { comparisonPageType } from './comparisonPageType'
import { contactPageType } from './contactPageType'
import { demoPageType } from './demoPageType'
import { faqItemType } from './faqItemType'
import { featureType, featuresPageType } from './featuresPageType'
import { homeModuleHighlightType, homePageType, homePillarType, homeStatType } from './homePageType'
import { integrationItemType, integrationsPageType } from './integrationsPageType'
import { institutionCounterType, institutionPageType } from './institutionPageType'
import { pageSettingsType } from './pageSettingsType'
import { policyPageType } from './policyPageType'
import { postType } from './postType'
import { pricingPageType, pricingPlanType } from './pricingPageType'
import {
  salesContactFormType,
  salesContactMetricType,
  salesContactPageType,
  salesContactRoleType,
  salesContactSocialProofType,
} from './salesContactPageType'
import { statusPageType, statusSystemType } from './statusPageType'
import { supportPageType } from './supportPageType'
import { testimonialType } from './testimonialType'
import { tourPageType, tourStepType } from './tourPageType'
import { useCasePageType } from './useCasePageType'
import { useCasesLandingLinkType, useCasesLandingPageType } from './useCasesLandingPageType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pageSettingsType,
    homePillarType,
    homeStatType,
    homeModuleHighlightType,
    homePageType,
    useCasesLandingLinkType,
    useCasesLandingPageType,
    institutionCounterType,
    institutionPageType,
    statusSystemType,
    statusPageType,
    featureType,
    featuresPageType,
    pricingPlanType,
    pricingPageType,
    integrationItemType,
    integrationsPageType,
    tourStepType,
    tourPageType,
    aboutPageType,
    demoPageType,
    supportPageType,
    contactPageType,
    salesContactMetricType,
    salesContactRoleType,
    salesContactFormType,
    salesContactSocialProofType,
    salesContactPageType,
    comparisonPageType,
    policyPageType,
    useCasePageType,
    postType,
    changelogEntryType,
    faqItemType,
    testimonialType,
    caseStudyType,
    campaignPageType,
  ],
}

import type { SchemaTypeDefinition } from "sanity";
import { moduleType } from "./moduleType";
import { apiDocType } from "./apiDocType";
import { safetyIncidentType } from "./safetyIncidentType";
import {
  aboutLogoItemType,
  aboutPageType,
  aboutTeamMemberType,
  aboutTimelineItemType,
  aboutValueType,
} from './aboutPageType'
import { campaignPageType } from './campaignPageType'
import { caseStudyType } from './caseStudyType'
import { caseStudySettingsType } from './caseStudySettingsType'
import { communityReviewType } from './communityReviewType'
import { websiteFeedbackType } from './websiteFeedbackType'
import { articleQuestionType } from './articleQuestionType'
import { changelogEntryType } from './changelogEntryType'
import { changelogSettingsType } from './changelogSettingsType'
import { compareHubPageType } from './compareHubPageType'
import { comparisonPageType } from './comparisonPageType'
import { contactPageType } from './contactPageType'
import { demoPageType } from './demoPageType'
import { faqItemType } from './faqItemType'

import {
  homeAudienceTabType,
  homeDemoFormCopyType,
  homeEcosystemFeatureType,
  homeEcosystemRoleType,
  homeFooterColumnType,
  homeFormOptionType,
  homeIntegrationLogoType,
  homeLinkType,
  homeModuleCardType,
  homeModuleHighlightType,
  homeNavItemType,
  homeNavSectionType,
  homeOrganizationCardType,
  homePageType,
  homePillarType,
  homePlatformAudienceCardType,
  homeProductVideoType,
  homeShowcaseSlideType,
  homeSocialLinkType,
  homeStatType,
  homeTimelineRingType,
  homeTimelineTabType,
  homeTrustLogoType,
} from './homePageType'
import { classgridIntegrationType } from './classgridIntegrationType'
import { legalPageType } from './legalPageType'
import { clientLogoType } from './clientLogoType'
import { homeStatsType } from './homeStatsType'

import { postType } from './postType'
import { pricingPageType, pricingPlanType } from './pricingPageType'
import {
  salesContactFormType,
  salesContactMetricType,
  salesContactPageType,
  salesContactRoleType,
  salesContactSocialProofType,
} from './salesContactPageType'

import { supportPageType } from './supportPageType'
import { helpCategoryType } from './helpCategoryType'
import { helpArticleType } from './helpArticleType'
import { testimonialType } from './testimonialType'
import { classgridTalkType } from './classgridTalkType'
import testimonialVideoType from './testimonialVideoType'

import { useCasePageType } from './useCasePageType'
import { useCasesLandingLinkType, useCasesLandingPageType } from './useCasesLandingPageType'
import { solutionPageType } from './solutionPageType'
import { solutionModuleType } from './solutionModuleType'
import { richBodyType } from './richBodyType'
import { localeStringType } from './localeStringType'
import { localeTextType } from './localeTextType'
import { localeRichBodyType } from './localeRichBodyType'
import { acknowledgementType } from './acknowledgementType'
import { teamMemberType } from './teamMemberType'
import { sectionSettingsType } from './sectionSettingsType'
import { isometricStackType } from './isometricStackType'
import { turboClassgridType } from './turboClassgridType'
import { appEcosystemType } from './appEcosystemType'
import {
  circularTimelineRingType,
  circularTimelineRoleType,
  circularTimelineTabType,
  circularTimelineType,
} from './circularTimelineType'
import { classgridVideoType } from './classgridVideoType'
import { classgridTeamVisionType } from './classgridTeamVisionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    richBodyType,
    localeStringType,
    localeTextType,
    localeRichBodyType,
    homePillarType,
    homeEcosystemFeatureType,
    homeEcosystemRoleType,
    homeStatType,
    homeModuleCardType,
    homeModuleHighlightType,
    homeShowcaseSlideType,
    clientLogoType,
    homeTrustLogoType,
    homeOrganizationCardType,
    homeTimelineRingType,
    homeTimelineTabType,
    circularTimelineRingType,
    circularTimelineTabType,
    circularTimelineRoleType,
    circularTimelineType,
    homePlatformAudienceCardType,
    homeAudienceTabType,
    homeLinkType,
    homeNavSectionType,
    homeNavItemType,
    homeFooterColumnType,
    homeSocialLinkType,
    homeFormOptionType,
    homeDemoFormCopyType,
    homeIntegrationLogoType,
    homeProductVideoType,
    homePageType,
    useCasesLandingLinkType,
    useCasesLandingPageType,
    homeStatsType,


    pricingPlanType,
    pricingPageType,
    classgridIntegrationType,
    legalPageType,

    aboutValueType,
    aboutTimelineItemType,
    aboutTeamMemberType,
    aboutLogoItemType,
    aboutPageType,
    demoPageType,
    supportPageType,
    helpCategoryType,
    helpArticleType,
    contactPageType,
    salesContactMetricType,
    salesContactRoleType,
    salesContactFormType,
    salesContactSocialProofType,
    salesContactPageType,
    compareHubPageType,
    comparisonPageType,

    useCasePageType,
    solutionPageType,
    solutionModuleType,
    postType,
    changelogSettingsType,
    changelogEntryType,
    faqItemType,
    testimonialType,
    classgridTalkType,
    testimonialVideoType,
    caseStudyType,
    caseStudySettingsType,
    campaignPageType,
    communityReviewType,
    moduleType,
    acknowledgementType,
    teamMemberType,
    sectionSettingsType,
    isometricStackType,
    turboClassgridType,
    appEcosystemType,
    websiteFeedbackType,
    articleQuestionType,
    classgridVideoType,
    classgridTeamVisionType,
    apiDocType,
    safetyIncidentType,
  ],
}

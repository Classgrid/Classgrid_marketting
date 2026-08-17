export const postsQuery = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  category,
  tags,
  author,
  authorImage,
  authorBio,
  authors[]{
    name,
    image,
    profileLink,
    bio
  },
  references[]{title, url},
  excerpt,
  publishedAt,
  coverImage
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  category,
  tags,
  author,
  authorImage,
  authorBio,
  authorProfileLink,
  authors[]{
    name,
    image,
    profileLink,
    bio
  },
  readingTimeOverride,
  references[]{title, url},
  excerpt,
  publishedAt,
  coverImage,
  "ogImageUrl": coverImage.asset->url + "?w=1200&h=630&fit=crop&fm=jpg",
  "body": select(
    defined(body.en) || defined(body.hi) || defined(body.mr) => {
      "en": body.en[]{
        ...,
        _type == "video" => {
          ...,
          "videoUrl": coalesce(videoFile.asset->url, url)
        }
      },
      "hi": body.hi[]{
        ...,
        _type == "video" => {
          ...,
          "videoUrl": coalesce(videoFile.asset->url, url)
        }
      },
      "mr": body.mr[]{
        ...,
        _type == "video" => {
          ...,
          "videoUrl": coalesce(videoFile.asset->url, url)
        }
      }
    },
    body[]{
      ...,
      _type == "video" => {
        ...,
        "videoUrl": coalesce(videoFile.asset->url, url)
      }
    }
  ),
  contentSections[]{
    heading,
    topText,
    text,
    bottomText,
    mediaType,
    layout,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, heading),
    "videoUrl": coalesce(videoFile.asset->url, videoUrl)
  },
  "prevPost": *[_type == "post" && publishedAt < ^.publishedAt] | order(publishedAt desc)[0]{ title, "slug": slug.current },
  "nextPost": *[_type == "post" && publishedAt > ^.publishedAt] | order(publishedAt asc)[0]{ title, "slug": slug.current }
}`;

export const changelogSettingsQuery = `*[_type == "changelogSettings"][0]{
  _id,
  seoTitle,
  metaDescription,
  ogImage,
  heroHeadline,
  heroSubheadline
}`;

export const changelogEntriesQuery = `*[_type == "changelogEntry"] | order(releaseDate desc){
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  metaDescription,
  ogImage,
  ogImageUrl,
  versionLabel,
  releaseDate,
  updateType,
  modules,
  summary,
  image,
  relatedTourLabel,
  relatedTourHref
}`;

export const changelogEntryBySlugQuery = `*[_type == "changelogEntry" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  metaDescription,
  ogImage,
  ogImageUrl,
  versionLabel,
  releaseDate,
  updateType,
  modules,
  summary,
  content,
  image,
  relatedTourLabel,
  relatedTourHref,
  authors[]{
    name,
    image,
    profileLink
  }
}`;

export const latestChangelogEntryQuery = `*[_type == "changelogEntry"] | order(releaseDate desc)[0]{
  _id,
  "slug": slug.current,
  releaseDate
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  name,
  role,
  company,
  quote,
  rating,
  "avatarUrl": avatar.asset->url,
  "avatarAlt": coalesce(avatar.alt, name),
  "institutionLogoUrl": institutionLogo.asset->url,
  "institutionLogoAlt": coalesce(institutionLogo.alt, company)
}`;

export const testimonialVideosQuery = `*[_type == "testimonialVideo"] | order(_createdAt desc){
  _id,
  playerStyle,
  name,
  role,
  subtitle,
  "videoUrl": coalesce(video.asset->url, videoUrl),
  "avatarUrl": avatar.asset->url,
  "avatarAlt": coalesce(avatar.alt, name)
}`;

export const caseStudySettingsQuery = `*[_type == "caseStudySettings"][0]{ heroSubtitle }`;

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(_createdAt desc){
  _id,
  title,
  "slug": slug.current,
  clientName,
  "clientLogoUrl": clientLogo.asset->url,
  year,
  institutionType,
  category,
  modules,
  summary,
  "heroImageUrl": heroImage.asset->url,
  metrics
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  clientName,
  "clientLogoUrl": clientLogo.asset->url,
  year,
  institutionType,
  category,
  modules,
  summary,
  overview,
  overviewDivider,
  conclusion,
  "heroImageUrl": heroImage.asset->url + "?w=1200&h=630&fit=crop&fm=jpg",
  metrics,
  championName,
  championRole,
  "championHeadshotUrl": championHeadshot.asset->url,
  championQuote,
  championSocialLink,
  champions[]{
    name,
    role,
    "headshotUrl": headshot.asset->url,
    socialLink
  },
  body[]{ 
    ...,
    _type == "video" => {
      ...,
      "videoUrl": coalesce(videoFile.asset->url, url)
    }
  },
  "galleryImageUrls": galleryImages[].asset->url,
  "nextCaseStudy": *[_type == "caseStudy" && _id != ^._id] | order(_createdAt desc)[0]{
    title,
    "slug": slug.current,
    clientName,
    category,
    "thumbnailUrl": heroImage.asset->url
  }
}`;

export const faqItemsQuery = `*[_type == "faqItem"] | order(coalesce(order, 99) asc, _createdAt asc){
  _id,
  question,
  answer,
  category,
  displayPages,
  homeColumn,
  order
}`;

export const faqItemsByPageQuery = `*[_type == "faqItem" && $page in displayPages] | order(_createdAt asc){
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

export const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  ...,
  "seoTitle": seoTitle,
  "metaDescription": metaDescription,
  "showGlobe": showGlobe,
  "heroHeadline": heroHeadline,
  "heroSubheadline": heroSubheadline,
  "whatIsClassgrid": whatIsClassgrid,
  "whatWeDo": whatWeDo,
  "whyChooseClassgrid": whyChooseClassgrid,
  "storyTitle": storyTitle,
  "originQuote": originQuote,
  originStory,
  missionTitle,
  missionBody,
  visionTitle,
  visionBody,
  values[]{
    title,
    description,
    icon
  },
  timeline[]{
    year,
    title,
    description,
    link
  },
  futureTimelineItem{
    year,
    title,
    description,
    link
  },
  teamHeadline,
  teamMembers[]{
    name,
    role,
    photo
  },
  backedByLabel,
  backedByLogos[]{
    name,
    href,
    logo
  },
  closingHeadline
}`;

export const homeChromeQuery = `*[_type == "homePage"][0]{
  _id,
  brandName,
  brandTagline,
  siteUrl,
  contactEmail,
  "logoUrl": brandLogo.asset->url,
  "logoAlt": coalesce(brandLogo.alt, brandName),
  navbarMenuItems[]{
    label,
    href,
    sections[]{
      heading,
      links[]{
        label,
        href,
        description
      }
    }
  },
  navbarSecondaryLinkLabel,
  navbarSecondaryLinkHref,
  navbarPrimaryCtaLabel,
  navbarPrimaryCtaHref,
  mobileMenuTitle,
  footerColumns[]{
    heading,
    links[]{
      label,
      href,
      description
    }
  },
  footerContactHeading,
  footerAddressLines,
  footerMapHref,
  footerPhoneNumbers,
  footerEmailAddresses,
  footerLegalLinks[]{
    label,
    href,
    description
  },
  footerSocialLinks[]{
    platform,
    href
  },
  footerCopyrightText,
  footerStatusLabel,
  footerStatusState,
  footerStatusHref,
  seo{
    metaTitle,
    metaDescription,
    slug
  }
}`;

export const homePageQuery = `*[_type == "homePage"][0]{
  _id,
  brandName,
  brandTagline,
  siteUrl,
  contactEmail,
  "logoUrl": brandLogo.asset->url,
  "logoAlt": coalesce(brandLogo.alt, brandName),
  navbarMenuItems[]{
    label,
    href,
    sections[]{
      heading,
      links[]{
        label,
        href,
        description
      }
    }
  },
  navbarSecondaryLinkLabel,
  navbarSecondaryLinkHref,
  navbarPrimaryCtaLabel,
  navbarPrimaryCtaHref,
  mobileMenuTitle,
  footerColumns[]{
    heading,
    links[]{
      label,
      href,
      description
    }
  },
  footerContactHeading,
  footerAddressLines,
  footerMapHref,
  footerPhoneNumbers,
  footerEmailAddresses,
  footerLegalLinks[]{
    label,
    href,
    description
  },
  footerSocialLinks[]{
    platform,
    href
  },
  footerCopyrightText,
  footerStatusLabel,
  footerStatusState,
  footerStatusHref,
  headline,
  subheadline,
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref,
  showcaseTitle,
  showcaseKicker,
  showcaseSubtitle,
  showcaseCtaLabelTemplate,
  showcaseSlides[]{
    label,
    headline,
    body,
    subtitle,
    highlights,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, label)
  },
  moduleGridSlides[]{
    label,
    headline,
    body,
    subtitle,
    highlights,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, label)
  },
  platformKicker,
  platformTitle,
  platformBody,
  platformConnectionHint,
  platformSystemLabel,
  platformInputLabels,
  platformAudienceCards[]{
    badge,
    title,
    subtitle
  },
  productVideo{
    title,
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    "posterUrl": posterImage.asset->url,
    "posterAlt": coalesce(posterImage.alt, title)
  },
  trustedBy,
  trustSectionDescription,
  machineShowcase,
pillars,
  stats,
  trustedLogos[]{
    name,
    subtitle,
    href,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, name),
    "wordmarkUrl": wordmark.asset->url,
    "wordmarkAlt": coalesce(wordmark.alt, name)
  },
  organizationSectionTitle,
  organizationCardCtaLabel,
  organizationCards[]{
    title,
    description,
    href,
    icon,
    color,
    iconColor
  },
  modulesSectionHeading,
  modulesSectionSubtext,
  modulesTitle,
  modulesSubtitle,
  modulesAllTabLabel,
  modulesAudienceTabs[]{
    id,
    label
  },
  modulesCardCtaLabel,
  modulesShowMoreLabel,
  modulesViewAllLabel,
  modules[]{
    title,
    description,
    href,
    color,
    iconColor,
    orgs
  },
  modulesCalloutTitle,
  modulesCalloutBody,
  modulesCalloutCtaLabel,
  modulesCalloutCtaHref,
  stakeholderSectionHeading,
  stakeholderSectionSubtext,
  timelineTitle,
  timelineSubtitle,
  timelineTabs[]{
    id,
    label,
    heading,
    description,
    features,
    rings[]{
      nodes
    }
  },
  testimonialsLabel,
  testimonialsHeading,
  testimonialsSubtext,
  testimonialsTitle,
  videoSectionHeading,
  videoSectionSubtext,
  videoSectionTitle,
  videoSectionDescription,
  testimonialsSectionDescription,
  integrationsKicker,
  integrationsHeadline,
  integrationsSubtext,
  integrationsTitle,
  integrationsSubtitle,
  integrationLogos[]{
    name,
    logoUrl,
    accentColor,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, name)
  },
  faqTitle,
  faqHeading,
  faqSubtext,
  faqSectionTitle,
  faqSectionDescription,
  faqButtonText,
  faqButtonLabel,
  faqButtonHref,
  ctaTitle,
  ctaBody,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  demoSectionLabel,
  demoSectionHeading,
  demoSectionSubtext,
  demoSectionCtaLine,
  ctaFormTitle,
  ctaFormSubtitle,
  ctaFormSubmitLabel,
  ctaFormDetailsHeading,
  ctaFormInstituteHeading,
  ctaFormMessageHeading,
  ctaFormSuccessTitle,
  ctaFormSuccessBody,
  ctaFormCopy{
    fullNameLabel,
    fullNamePlaceholder,
    emailLabel,
    emailPlaceholder,
    phoneLabel,
    phonePlaceholder,
    instituteNameLabel,
    instituteNamePlaceholder,
    stateLabel,
    statePlaceholder,
    cityLabel,
    cityPlaceholder,
    solutionLabel,
    messageLabel,
    messagePlaceholder,
    captchaPlaceholder,
    captchaMismatchMessage,
    securityCheckRequiredMessage,
    submitLoadingLabel,
    genericErrorMessage,
    validationInstitutionNameRequired,
    validationOrgTypeRequired,
    validationFullNameRequired,
    validationEmailInvalid,
    validationPhoneInvalid,
    validationStateRequired,
    validationCityRequired,
    solutionOptions[]{
      value,
      label
    }
  },
  moduleHighlights,
  footerCta,
  whatsNew,
  seo{
    metaTitle,
    metaDescription,
    slug
  },
  empowerSection{
    heading,
    description,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, heading)
  }
}`;



export const circularTimelineQuery = `*[_type == "circularTimeline" && _id == "circularTimeline"][0]{
  _id,
  title,
  subtitle,
  tabs[]{
    id,
    label,
    heading,
    description,
    features,
    rings[]{
      nodes
    }
  },
  roles[]{
    roleKey,
    title,
    badge,
    desc,
    tooltip,
    features,
    stats,
    metric,
    theme
  }
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

export const integrationsPageQuery = `*[_type == "integrationsPage"] | order(coalesce(seo.slug, slug) == "integrations" desc, _updatedAt desc)[0]{
  _id,
  headline,
  subheadline,
  integrations[]{
    name,
    description,
    benefits,
    logoUrl,
    accentColor,
    "imageUrl": coalesce(image.asset->url, imageUrl, logo.asset->url, logoUrl),
    "logoImageUrl": coalesce(logo.asset->url, logoUrl),
    "imageAlt": coalesce(logo.alt, name)
  },
  apiDocumentation,
  customIntegrationCta
}`;

export const classgridIntegrationsQuery = `*[_type == "classgridIntegration"] | order(order asc, name asc){
  _id,
  name,
  "imageUrl": coalesce(image.asset->url, imageUrl, logo.asset->url, logoUrl),
  "logoUrl": coalesce(logo.asset->url, logoUrl),
  "imageAlt": coalesce(logo.alt, name),
  description,
  benefits,
  order
}`;

export const classgridTalkQuery = `*[_type == "classgrid_talk"] | order(order asc, _createdAt desc){
  _id,
  name,
  role,
  college,
  quote,
  "avatarUrl": avatar.asset->url,
  "avatarAlt": coalesce(avatar.alt, name),
  "institutionLogoUrl": institutionLogo.asset->url,
  "institutionLogoAlt": coalesce(institutionLogo.alt, college),
  rating,
  order
}`;

export const tourPageQuery = `*[_type == "productTourPage"][0]{
  _id,
  seoTitle,
  metaDescription,
  ogImage,
  heroHeadline,
  heroSplineUrl,
  heroFallbackImage,
  tourSections[]{
    moduleName,
    description,
    media,
    videos[]{
      title,
      videoUrl,
      thumbnail
    },
    keyFeatures,
    moduleTestimonial{
      quote,
      author,
      role
    },
    sectionCta{
      ctaText,
      ctaUrl
    }
  }
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
  "subtitle": coalesce(subtitle, subheadline),
  subheadline,
  benefits,
  heroImage,
  body[]{
    ...,
    _type == "image" => {
      ...,
      "imageUrl": asset->url
    }
  },
  capabilities[]{
    feature,
    description,
    icon
  },
  roleExperiences[]{
    roleName,
    description
  },
  marketing{
    headline,
    body,
    highlights
  },
  faqs[]{
    question,
    answer
  },
  seo,
  testimonial,
  cta
}`;

export const institutionPagesQuery = `*[_type == "institutionPage"]{
  _id,
  institutionType,
  label,
  headline,
  "subtitle": coalesce(subtitle, subline),
  subline,
  capabilities,
  roleExperiences,
  marketing,
  faqs,
  seo,
  counters
}`;

export const institutionPageByTypeQuery = `*[_type == "institutionPage" && institutionType == $institutionType][0]{
  _id,
  institutionType,
  label,
  headline,
  "subtitle": coalesce(subtitle, subline),
  subline,
  heroImage,
  capabilities,
  body[]{
    ...,
    _type == "image" => {
      ...,
      "imageUrl": asset->url
    }
  },
  roleExperiences[]{
    roleName,
    description
  },
  marketing{
    headline,
    body,
    highlights
  },
  faqs[]{
    question,
    answer
  },
  seo,
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

export const legalPageBySlugQuery = `*[_type == "legalPage" && slug.current == $slug][0]{
  _id,
  "title": coalesce(title.en, title.hi, title.mr, title),
  "slug": slug.current,
  lastUpdated,
  effectiveDate,
  intro{
    introductionHeading,
    introductionBody,
    scopeHeading,
    scopeBody
  },
  sections[]{
    id,
    title,
    content
  }
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

export const compareHubPageQuery = `*[_type == "compareHubPage"][0]{
  _id,
  seoTitle,
  metaDescription,
  ogImage,
  heroHeadline,
  heroSubheadline
}`;

export const comparisonPagesQuery = `*[_type == "comparisonPage"] | order(competitorName asc){
  _id,
  competitorName,
  "slug": slug.current,
  seoTitle,
  metaDescription,
  competitorLogo,
  websiteLink,
  readTime
}`;

export const comparisonPageBySlugQuery = `*[_type == "comparisonPage" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  competitorName,
  "slug": slug.current,
  headline,
  readTime,
  lastUpdatedDate,
  competitorLogo,
  websiteLink,
  seoTitle,
  metaDescription,
  ogImage,
  body,
  ratingBadges,
  usps,
  featureMatrix,
  migrationTestimonial,
  faqs
}`;

export const clientLogosQuery = `*[_type == "clientLogo"] | order(order asc){
  _id,
  name,
  subtitle,
  href,
  "imageUrl": logo.asset->url,
  "imageUrlDark": logoDark.asset->url,
  "imageAlt": coalesce(logo.alt, name),
  "wordmarkUrl": wordmark.asset->url,
  "wordmarkUrlDark": wordmarkDark.asset->url,
  "wordmarkAlt": coalesce(wordmark.alt, name),
  nameColor,
  hideName,
  hideInDarkMode,
  order,
  statValue,
  statLabel,
  statSuffix
}`;

export const allModulesQuery = `*[_type == "module"] | order(title asc){
  _id,
  title,
  headline,
  subtitle,
  category,
  institutionTypes,
  "slug": slug.current,
  "description": coalesce(description.en, description.hi, description.mr, description),
  icon,
  color,
  iconColor,
  orgs
}`;

export const moduleBySlugQuery = `*[_type == "module" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  lastUpdatedAt,
  title,
  headline,
  subtitle,
  category,
  label,
  "slug": slug.current,
  "description": coalesce(description.en, description.hi, description.mr, description),
  iconSvg,
  heroImage,
  body,
  structuredSections[]{
    heading,
    content
  },
  capabilities,
  roleExperiences,
  marketing,
  faqs
}`;

export const solutionPageBySlugQuery = `*[_type == "solutionPage" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  lastUpdatedAt,
  "slug": slug.current,
  category,
  label,
  headline,
  subtitle,
  markdownBody,
  markdownSections[]{
    heading,
    content
  },
  structuredSections[]{
    _key,
    heading,
    content[]{
      ...,
      _type == "richTable" => {
        _type,
        _key,
        headers,
        rows[]{
          _key,
          cells
        }
      }
    }
  },
  "heroImageUrl": heroImage.asset->url,
  heroImage{ asset->{ url }, alt },
  body,
  capabilities[]{
    feature,
    description,
    icon
  },
  roleExperiences[]{
    roleName,
    description
  },
  faqs[]{
    question,
    answer
  },
  seo{
    metaTitle,
    metaDescription
  }
}`;

export const allSolutionModulesQuery = `*[_type == "solutionModule"] | order(title asc){
  _id,
  "title": coalesce(title.en, title.hi, title.mr, title),
  "slug": slug.current,
  "description": coalesce(description.en, description.hi, description.mr, description),
  icon,
  color
}`;

export const solutionModuleBySlugQuery = `*[_type == "solutionModule" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  lastUpdatedAt,
  title,
  headline,
  subtitle,
  category,
  label,
  "slug": slug.current,
  "description": subtitle,
  "heroImageUrl": heroImage.asset->url,
  heroImage{ asset->{ url }, alt },
  body,
  structuredSections[]{
    _key,
    heading,
    content[]{
      ...,
      _type == "richTable" => {
        _type,
        _key,
        headers,
        rows[]{
          _key,
          cells
        }
      }
    },
    "sectionImageUrl": sectionImage.asset->url,
    "sectionImageAlt": sectionImage.alt,
    imageCaption,
    suggestedImageNote
  },
  capabilities[]{
    feature,
    description,
    icon
  },
  roleExperiences[]{
    roleName,
    description
  },
  faqs[]{
    question,
    answer
  },
  seo{
    metaTitle,
    metaDescription
  },
  relatedHelpArticles[]{
    articleTitle,
    articleSlug,
    articleSummary
  },
  relatedChangelogs[]{
    changeTitle,
    changeDate,
    changeSummary,
    changeType
  }
}`;


export const acknowledgementsQuery = `*[_type == "acknowledgement"] | order(order asc, name asc){
  _id,
  name,
  role,
  category,
  message
}`;

export const teamMembersQuery = `*[_type == "teamMember"] | order(order asc, name asc){
  _id,
  name,
  role,
  department,
  "imageUrl": image.asset->url,
  "imageAlt": coalesce(image.alt, name),
  bio,
  socialLinks[]{
    platform,
    url
  }
}`;

export const homeStatsQuery = `*[_type == "homeStats"][0]{
  _id,
  showInstitutions,
  institutions,
  showStudents,
  students,
  showModules,
  modules,
  showUptime,
  uptime
}`;

export const sectionSettingsQuery = `*[_type == "sectionSettings"][0]{
  showTrustedInstitutions,
  showClientTestimonials,
  showTestimonialVideos,
  showWhyClassgrid,
  whyClassgridTitle,
  whyClassgridDescription,
  whyClassgridCards,
  showTeamVision,
  teamVisionTitle,
  teamVisionQuotes[]{ name, role, quote, "avatarUrl": avatar.asset->url },
  showModuleGrid,
  showTurboComparison,
  showIsometricStack
}`;

export const turboClassgridQuery = `*[_type == "turboClassgrid"][0]{
  _id,
  headline,
  subheadline,
  leftBox1Line0, leftBox1Line1, leftBox1Line2, leftBox1Line3,
  leftBox2Line0, leftBox2Line1, leftBox2Line2, leftBox2Line3,
  leftLabel, leftTime,
  rightTermCmd, rightTermLine1, rightTermLine2, rightTermLine3,
  rightLabel, rightTime
}`;
export const isometricStackQuery = `*[_type == "isometricStack"][0]{
  _id,
  kicker,
  headline,
  subheadline,
  phases[]{
    title,
    body,
    bullets
  }
}`;

export const appEcosystemQuery = `
*[_type == "appEcosystem"][0]{
  faculty[]{
    label,
    icon,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, label)
  },
  student[]{
    label,
    icon,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, label)
  },
  parent[]{
    label,
    icon,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, label)
  }
}
`;

export const classgridVideoQuery = `*[_type == "classgridVideo"][0]{
  isVisible, label, title, description,
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  videoPlaylist[]{
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    label
  },
  highlights[]{text}, ctaLabel, ctaHref
}`;

export const classgridTeamVisionQuery = `*[_type == "classgridTeamVision"][0]{
  isVisible, label, title, description,
  quotes[]{name, role, "text": coalesce(text, quote), "avatarUrl": avatar.asset->url}
}`;

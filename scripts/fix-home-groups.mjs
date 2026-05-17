import fs from 'fs';

const file = 'sanity/schemaTypes/homePageType.ts';
let code = fs.readFileSync(file, 'utf-8');

// Step 1: Remove ALL incorrectly inserted standalone "group:" lines
// These are lines that are ONLY "      group: 'xxx'," with nothing else
code = code.replace(/^      group: '[a-z]+',\n/gm, '');

// Step 2: Now find the homePageType fields section and add groups properly
// We need to find defineField blocks ONLY inside homePageType

const homePageStart = code.indexOf("export const homePageType = defineType({");
if (homePageStart === -1) {
  console.error("Could not find homePageType!");
  process.exit(1);
}

const groupMap = {
  showcaseSlides: 'heroSlider',
  brandName: 'branding', brandTagline: 'branding', siteUrl: 'branding',
  contactEmail: 'branding', brandLogo: 'branding',
  navbarMenuItems: 'branding', navbarSecondaryLinkLabel: 'branding',
  navbarSecondaryLinkHref: 'branding', navbarPrimaryCtaLabel: 'branding',
  navbarPrimaryCtaHref: 'branding', mobileMenuTitle: 'branding',
  headline: 'hero', subheadline: 'hero',
  heroPrimaryCtaLabel: 'hero', heroPrimaryCtaHref: 'hero',
  heroSecondaryCtaLabel: 'hero', heroSecondaryCtaHref: 'hero',
  showcaseTitle: 'sections', showcaseKicker: 'sections',
  showcaseSubtitle: 'sections', showcaseCtaLabelTemplate: 'sections',
  platformKicker: 'sections', platformTitle: 'sections',
  platformBody: 'sections', platformConnectionHint: 'sections',
  platformSystemLabel: 'sections', platformInputLabels: 'sections',
  platformAudienceCards: 'sections', productVideo: 'sections',
  trustedBy: 'sections', trustSectionDescription: 'sections',
  machineShowcase: 'sections', pillars: 'sections', stats: 'sections',
  trustedLogos: 'sections', organizationSectionTitle: 'sections',
  organizationCardCtaLabel: 'sections', organizationCards: 'sections',
  stakeholderSectionHeading: 'sections', stakeholderSectionSubtext: 'sections',
  timelineTitle: 'sections', timelineSubtitle: 'sections',
  timelineTabs: 'sections', empowerSection: 'sections',
  moduleGridSlides: 'modules', modulesSectionHeading: 'modules',
  modulesSectionSubtext: 'modules', modulesTitle: 'modules',
  modulesSubtitle: 'modules', modulesAudienceTabs: 'modules',
  modulesAllTabLabel: 'modules', modulesCardCtaLabel: 'modules',
  modulesShowMoreLabel: 'modules', modulesViewAllLabel: 'modules',
  modules: 'modules', modulesCalloutTitle: 'modules',
  modulesCalloutBody: 'modules', modulesCalloutCtaLabel: 'modules',
  modulesCalloutCtaHref: 'modules', moduleHighlights: 'modules',
  testimonialsLabel: 'social', testimonialsHeading: 'social',
  testimonialsSubtext: 'social', testimonialsTitle: 'social',
  videoSectionHeading: 'social', videoSectionSubtext: 'social',
  videoSectionTitle: 'social', videoSectionDescription: 'social',
  testimonialsSectionDescription: 'social',
  integrationsKicker: 'integrations', integrationsHeadline: 'integrations',
  integrationsSubtext: 'integrations', integrationsTitle: 'integrations',
  integrationsSubtitle: 'integrations', integrationLogos: 'integrations',
  faqHeading: 'integrations', faqSubtext: 'integrations',
  faqButtonText: 'integrations', faqTitle: 'integrations',
  faqSectionTitle: 'integrations', faqSectionDescription: 'integrations',
  faqButtonLabel: 'integrations', faqButtonHref: 'integrations',
  ctaTitle: 'cta', ctaBody: 'cta', ctaPrimaryLabel: 'cta',
  ctaPrimaryHref: 'cta', ctaSecondaryLabel: 'cta', ctaSecondaryHref: 'cta',
  demoSectionLabel: 'cta', demoSectionHeading: 'cta',
  demoSectionSubtext: 'cta', demoSectionCtaLine: 'cta',
  ctaFormTitle: 'cta', ctaFormSubtitle: 'cta', ctaFormSubmitLabel: 'cta',
  ctaFormDetailsHeading: 'cta', ctaFormInstituteHeading: 'cta',
  ctaFormMessageHeading: 'cta', ctaFormSuccessTitle: 'cta',
  ctaFormSuccessBody: 'cta', ctaFormCopy: 'cta',
  footerColumns: 'footer', footerContactHeading: 'footer',
  footerAddressLines: 'footer', footerMapHref: 'footer',
  footerPhoneNumbers: 'footer', footerEmailAddresses: 'footer',
  footerLegalLinks: 'footer', footerSocialLinks: 'footer',
  footerCopyrightText: 'footer', footerCta: 'footer',
  footerStatusLabel: 'status', footerStatusState: 'status',
  footerStatusHref: 'status',
  seo: 'seo', whatsNew: 'seo',
};

// Only work on the homePageType portion
const before = code.substring(0, homePageStart);
let homeSection = code.substring(homePageStart);

for (const [fieldName, group] of Object.entries(groupMap)) {
  // Find the field ONLY in homePageType section
  // Match defineField({ or defineField({\n  with name: 'fieldName'
  // For multi-line defineField blocks:
  const multiLinePattern = new RegExp(
    `(defineField\\(\\{\\s*\\n\\s*name: '${fieldName}',)`,
  );
  // For single-line defineField blocks:
  const singleLinePattern = new RegExp(
    `(defineField\\(\\{\\s*name: '${fieldName}',\\s*title: '[^']*',\\s*type: '[^']*'(?:,\\s*rows: \\d+)?\\s*\\}\\))`,
  );

  const multiMatch = homeSection.match(multiLinePattern);
  if (multiMatch) {
    const idx = homeSection.indexOf(multiMatch[0]);
    // Find the closing }), for this defineField
    let depth = 0;
    let i = idx;
    let closingIdx = -1;
    for (; i < homeSection.length; i++) {
      if (homeSection[i] === '{') depth++;
      if (homeSection[i] === '}') {
        depth--;
        if (depth === 0) {
          closingIdx = i;
          break;
        }
      }
    }
    if (closingIdx !== -1) {
      const block = homeSection.substring(idx, closingIdx + 1);
      if (!block.includes("group:")) {
        // Insert group before the closing }
        const insertAt = closingIdx;
        homeSection = homeSection.substring(0, insertAt) +
          `\n      group: '${group}',\n    ` +
          homeSection.substring(insertAt);
        console.log(`✅ Added group '${group}' to '${fieldName}'`);
      } else {
        console.log(`✓ '${fieldName}' already has group`);
      }
    }
    continue;
  }

  const singleMatch = homeSection.match(singleLinePattern);
  if (singleMatch) {
    // Convert single-line to multi-line with group
    const original = singleMatch[0];
    // Extract parts
    const nameMatch = original.match(/name: '([^']+)'/);
    const titleMatch = original.match(/title: '([^']+)'/);
    const typeMatch = original.match(/type: '([^']+)'/);
    const rowsMatch = original.match(/rows: (\d+)/);
    
    let replacement = `defineField({\n      name: '${nameMatch[1]}',\n      title: '${titleMatch[1]}',\n      type: '${typeMatch[1]}',`;
    if (rowsMatch) replacement += `\n      rows: ${rowsMatch[1]},`;
    replacement += `\n      group: '${group}',\n    })`;
    
    homeSection = homeSection.replace(original, replacement);
    console.log(`✅ Added group '${group}' to '${fieldName}' (single-line)`);
    continue;
  }

  console.log(`⚠️ Could not find '${fieldName}' in homePageType`);
}

code = before + homeSection;
fs.writeFileSync(file, code, 'utf-8');
console.log('\n🎉 Done!');

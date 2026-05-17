import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID environment variable');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    enabled: true,
    studioUrl: 'http://localhost:3333',
  },
});

/**
 * Generate optimized image URLs from Sanity image objects
 * Usage: imageUrl(image).width(300).height(200).url()
 */
export const imageUrl = (source) => {
  return imageUrlBuilder(sanityClient).image(source);
};

/**
 * GROQ queries for marketing content
 */
export const queries = {
  // Home Page
  homePage: `*[_type == "homePage"][0]`,
  
  // About Page
  aboutPage: `*[_type == "aboutPage"][0]`,
  
  // Features Page
  featuresPage: `*[_type == "featuresPage"][0]`,
  
  // Pricing Page
  pricingPage: `*[_type == "pricingPage"][0] { 
    ..., 
    plans[] { ..., features[] { ... } }
  }`,
  
  // Tour Page
  tourPage: `*[_type == "tourPage"][0] {
    ...,
    tourSteps[] { ... }
  }`,
  
  // Demo Page
  demoPage: `*[_type == "demoPage"][0]`,
  
  // Integrations Page
  integrationsPage: `*[_type == "integrationsPage"][0] {
    ...,
    integrations[] { ... }
  }`,
  
  // Use Cases Page
  useCasesPage: `*[_type == "useCasesPage"][0] {
    ...,
    useCases[] { ... }
  }`,
  
  // Support Page
  supportPage: `*[_type == "supportPage"][0] {
    ...,
    categories[] { 
      ...,
      articles[] { ... }
    }
  }`,
  
  // Contact Page
  contactPage: `*[_type == "contactPage"][0]`,
  
  // Blog Posts
  allBlogPosts: `*[_type == "post"] | order(publishedAt desc) {
    ...,
    author->,
    "slug": slug.current
  }`,
  
  blogPostBySlug: (slug) => `*[_type == "post" && slug.current == "${slug}"][0] {
    ...,
    author->,
    "slug": slug.current
  }`,
  
  // Case Studies
  allCaseStudies: `*[_type == "caseStudy"] | order(publishedAt desc) {
    ...,
    "slug": slug.current
  }`,
  
  caseStudyBySlug: (slug) => `*[_type == "caseStudy" && slug.current == "${slug}"][0] {
    ...,
    "slug": slug.current
  }`,
  
  // Testimonials
  allTestimonials: `*[_type == "testimonial"] | order(_createdAt desc)`,
  
  // FAQ Items
  allFAQItems: `*[_type == "faqItem"] | order(order asc) {
    ...,
    category->
  }`,
  
  faqByCategory: (category) => `*[_type == "faqItem" && category._ref == "${category}"] | order(order asc)`,
};

/**
 * Fetch helper for Sanity queries
 * Usage: await fetchSanity(queries.homePage)
 */
export const fetchSanity = async (query, params = {}) => {
  try {
    const result = await sanityClient.fetch(query, params);
    return result;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw new Error(`Failed to fetch content: ${error.message}`);
  }
};

export default sanityClient;

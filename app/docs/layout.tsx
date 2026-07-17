import { DocsLayoutShell } from '@/components/docs/docs-layout-shell';
import { client } from '@/sanity/lib/client';
import './docs.css';

export const revalidate = 0; // disabled caching for development

async function getSidebarSections() {
  const query = `*[_type == "apiDoc"] | order(title asc) {
    title,
    "slug": slug.current,
    category
  }`;
  
  const docs = await client.fetch(query);
  
  // Define the desired order of categories and their display names
  const categoryOrder = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'platform-guides', label: 'Platform Guides' },
    { id: 'admin-setup', label: 'Admin Setup' },
    { id: 'api-reference', label: 'API Reference' },
  ];
  
  const sectionsMap = new Map();
  
  // Initialize sections
  categoryOrder.forEach(cat => {
    sectionsMap.set(cat.id, { title: cat.label, items: [] });
  });

  // Group docs by category
  docs.forEach((doc: any) => {
    const cat = doc.category || 'getting-started';
    if (!sectionsMap.has(cat)) {
      sectionsMap.set(cat, {
        title: cat.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        items: []
      });
    }
    
    sectionsMap.get(cat).items.push({
      href: `/docs/${doc.slug}`,
      label: doc.title,
    });
  });

  // Convert map back to array, filtering out empty sections
  const sidebarSections = Array.from(sectionsMap.values()).filter(section => section.items.length > 0);
  
  return sidebarSections;
}

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const sidebarSections = await getSidebarSections();
  return <DocsLayoutShell sidebarSections={sidebarSections}>{children}</DocsLayoutShell>;
}

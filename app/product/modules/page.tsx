import { redirect } from 'next/navigation';

/**
 * The /product/modules listing page has been removed.
 * All traffic is redirected to the Solutions overview page.
 * Individual module pages remain at /product/modules/[slug]
 */
export default function ProductModulesPage() {
  redirect('/product/modules/smart-attendance');
}

import { DocsLayoutShell } from '@/components/docs/docs-layout-shell';
import './docs.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayoutShell>{children}</DocsLayoutShell>;
}

import { RecentlyUpdatedList } from '@/components/recently-updated-list';

const items = [
  { href: '/docs/getting-started', title: 'Getting started', trail: 'Guides', meta: 'Last updated 12 Oct 2026 by Ada' },
  { href: '/docs/configuration', title: 'Configuration', trail: 'Guides › Setup', meta: 'Last updated 9 Oct 2026 by Grace' },
  { href: '/docs/api/pages', title: 'Pages API', trail: 'Reference › API', meta: 'Last updated 3 Oct 2026 by Ada' },
  { href: '/docs/changelog', title: 'Changelog', meta: 'Last updated 28 Sep 2026 by Linus' },
];

export function RecentlyUpdatedDemo() {
  return <RecentlyUpdatedList title="Recently updated" items={items} />;
}

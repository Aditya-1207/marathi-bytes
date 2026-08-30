export interface Category {
  id: string;
  name: string;
  label: string;
  defaultThumbnail: string;
  // Whether this category gets a nav link, a route, and shows up as a
  // real section of the site. `instagram` is content.ts-only scaffolding
  // today — see spec/spec.md Phase 3 for the pending decision on its fate.
  inNav: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: 'poetry',
    name: 'Poetry',
    label: 'काव्य-संग्रह',
    defaultThumbnail: '/blog-images/poetry_calligraphy_thumbnail.png',
    inNav: true,
  },
  {
    id: 'articles',
    name: 'Articles',
    label: 'आठवणींचा ठेवा',
    defaultThumbnail: '/blog-images/articles_nature_thumbnail.png',
    inNav: true,
  },
  {
    id: 'ukhane',
    name: 'Ukhane',
    label: 'उखाणे',
    defaultThumbnail: '/blog-images/ukhane_wedding_thumbnail.png',
    inNav: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    label: 'Instagram',
    defaultThumbnail: '/blog-images/cultural_celebration_thumbnail.png',
    inNav: false,
  },
];

export const NAV_CATEGORIES = CATEGORIES.filter((c) => c.inNav);

const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string): Category | undefined {
  return categoryById.get(id);
}

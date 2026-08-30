export interface Category {
  id: string;
  name: string;
  label: string;
  defaultThumbnail: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'poetry',
    name: 'Poetry',
    label: 'काव्य-संग्रह',
    defaultThumbnail: '/blog-images/poetry_calligraphy_thumbnail.png',
  },
  {
    id: 'articles',
    name: 'Articles',
    label: 'आठवणींचा ठेवा',
    defaultThumbnail: '/blog-images/articles_nature_thumbnail.png',
  },
  {
    id: 'ukhane',
    name: 'Ukhane',
    label: 'उखाणे',
    defaultThumbnail: '/blog-images/ukhane_wedding_thumbnail.png',
  },
];

const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string): Category | undefined {
  return categoryById.get(id);
}

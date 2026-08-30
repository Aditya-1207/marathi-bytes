import { Link } from 'wouter';
import { getAllTags } from '@/lib/search';

// design_guidelines.md's "Tag Cloud" grid spec (flex flex-wrap gap-3) was
// specified but never actually built as a browsable surface — tags existed
// only as pills on individual post cards, or a uniform fallback list on an
// empty /search. This is a real weighted cloud: font size scales with how
// often each tag is used, distinct from the flat pill lists elsewhere on
// the site (which serve a different purpose — an exhaustive list, not an
// at-a-glance overview of what the author writes about most).
const SIZE_CLASSES = [
  'text-sm text-muted-foreground',
  'text-base text-foreground/80',
  'text-lg text-foreground font-medium',
  'text-xl text-foreground font-semibold',
] as const;

export default function TagCloud() {
  const tags = getAllTags();
  if (tags.length === 0) return null;

  const maxCount = Math.max(...tags.map((t) => t.count));
  const minCount = Math.min(...tags.map((t) => t.count));
  const spread = maxCount - minCount || 1;

  return (
    <div className="flex flex-wrap gap-3 justify-center" data-testid="tag-cloud">
      {tags.map(({ tag, count }) => {
        const bucket = Math.round(((count - minCount) / spread) * (SIZE_CLASSES.length - 1));
        return (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className={`hover-elevate rounded-full px-3 py-1 leading-none transition-colors ${SIZE_CLASSES[bucket]}`}
            data-testid={`tag-cloud-${tag}`}
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
}

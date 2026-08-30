import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';

interface TagPillProps {
  tag: string;
}

/**
 * A tag always navigates to its listing. Making this a real link — rather than
 * a click handler each page had to remember to pass down — is what keeps every
 * tag on the site consistent, and lets readers middle-click or copy the URL.
 */
export default function TagPill({ tag }: TagPillProps) {
  return (
    <Link href={`/tag/${encodeURIComponent(tag)}`} data-testid={`tag-${tag}`}>
      <Badge
        variant="outline"
        className="rounded-full px-4 py-1.5 cursor-pointer hover-elevate active-elevate-2"
      >
        {tag}
      </Badge>
    </Link>
  );
}

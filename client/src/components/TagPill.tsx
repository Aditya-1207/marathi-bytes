import { Badge } from '@/components/ui/badge';

interface TagPillProps {
  tag: string;
  onClick?: (tag: string) => void;
}

export default function TagPill({ tag, onClick }: TagPillProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(tag);
      console.log('Tag clicked:', tag);
    }
  };

  return (
    <Badge
      variant="outline"
      className="rounded-full px-4 py-1.5 cursor-pointer hover-elevate active-elevate-2"
      onClick={handleClick}
      data-testid={`tag-${tag}`}
    >
      {tag}
    </Badge>
  );
}

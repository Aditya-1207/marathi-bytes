import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: string;
  categoryLabel: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export default function CategoryBadge({ category, categoryLabel, variant = 'secondary' }: CategoryBadgeProps) {
  return (
    <Badge 
      variant={variant} 
      className="uppercase text-xs tracking-wide font-medium"
      data-testid={`badge-category-${category}`}
    >
      {categoryLabel}
    </Badge>
  );
}

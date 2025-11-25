import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import TagPill from './TagPill';

interface ContentCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  date: string;
  thumbnail: string;
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function ContentCard({
  id,
  title,
  excerpt,
  category,
  categoryLabel,
  date,
  thumbnail,
  tags,
  onTagClick,
}: ContentCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all h-full flex flex-col" data-testid={`card-${id}`}>
      <Link href={`/post/${id}`}>
        <div className="aspect-[16/9] overflow-hidden cursor-pointer">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      
      <CardHeader className="flex-none">
        <CategoryBadge category={category} categoryLabel={categoryLabel} />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <Link href={`/post/${id}`}>
          <h3 className="text-xl md:text-2xl font-semibold leading-tight hover:text-primary transition-colors cursor-pointer line-clamp-2" data-testid={`card-title-${id}`}>
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground leading-relaxed line-clamp-3" data-testid={`card-excerpt-${id}`}>
          {excerpt}
        </p>
      </CardContent>

      <CardFooter className="flex-col items-start gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid={`card-date-${id}`}>
          <Calendar className="w-4 h-4" />
          {new Date(date).toLocaleDateString('mr-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid={`card-tags-${id}`}>
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} onClick={onTagClick} />
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

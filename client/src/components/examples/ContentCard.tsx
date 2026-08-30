import ContentCard from '../ContentCard';
import poetryThumbnail from '@assets/generated_images/poetry_calligraphy_thumbnail.png';

export default function ContentCardExample() {
  return (
    <div className="max-w-md">
      <ContentCard
        id="poem1"
        title="प्रेमाची भावना"
        excerpt="प्रेमाची भावना अनोखी असते. ती मनाला स्पर्श करते आणि जीवनाला अर्थ देते. या कवितेत प्रेमाच्या विविध रंगांचे वर्णन केले आहे..."
        category="poetry"
        categoryLabel="काव्य-संग्रह"
        date="2025-11-20"
        thumbnail={poetryThumbnail}
        tags={['प्रेम', 'भावना', 'जीवन']}
      />
    </div>
  );
}

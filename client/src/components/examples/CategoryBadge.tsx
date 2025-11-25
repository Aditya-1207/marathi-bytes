import CategoryBadge from '../CategoryBadge';

export default function CategoryBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <CategoryBadge category="poetry" categoryLabel="काव्य-संग्रह" variant="secondary" />
      <CategoryBadge category="articles" categoryLabel="आठवणींचा ठेवा" variant="secondary" />
      <CategoryBadge category="ukhane" categoryLabel="उखाणे" variant="secondary" />
    </div>
  );
}

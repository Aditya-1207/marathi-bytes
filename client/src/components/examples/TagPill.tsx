import TagPill from '../TagPill';

export default function TagPillExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <TagPill tag="प्रेम" onClick={(tag) => console.log('Tag clicked:', tag)} />
      <TagPill tag="निसर्ग" onClick={(tag) => console.log('Tag clicked:', tag)} />
      <TagPill tag="जीवन" onClick={(tag) => console.log('Tag clicked:', tag)} />
      <TagPill tag="नृत्य" onClick={(tag) => console.log('Tag clicked:', tag)} />
      <TagPill tag="आठवणी" onClick={(tag) => console.log('Tag clicked:', tag)} />
    </div>
  );
}

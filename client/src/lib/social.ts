import { Instagram, Youtube, Facebook, type LucideIcon } from 'lucide-react';

export interface SocialLink {
  id: string;
  name: string;
  icon: LucideIcon;
  /** Full profile URL. Must point at the actual account, not the platform homepage. */
  url: string;
  /** Shown under the platform name on the "Follow Me" cards. */
  description: string;
}

// The single source of truth for the site's social links — consumed by both
// `Header.tsx` (icon row) and `SocialMediaSection.tsx` (follow cards).
//
// TODO: the URLs below are still platform homepages, not real profiles — a
// reader who clicks them lands on Instagram's logged-out page. Replace each
// `url` with the author's actual profile, and delete any entry for a platform
// she doesn't use. Both places that render social links read this array, so
// that is a one-line edit per platform.
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    description: 'फोटो आणि व्हिडिओ (Photos & Videos)',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com',
    description: 'व्हिडिओ सामग्री (Video Content)',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com',
    description: 'समुदाय (Community)',
  },
];

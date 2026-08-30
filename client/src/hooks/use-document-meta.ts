import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl, truncate } from '@/lib/seo';

export interface DocumentMeta {
  /** Page title, without the site name suffix — that's added automatically. */
  title: string;
  description: string;
  /** Root-relative (already base-rebased) or absolute; defaults to the site's default OG image. */
  image?: string;
  type?: 'website' | 'article';
  /** ISO 8601 date; only meaningful with type="article". */
  publishedTime?: string;
  /**
   * Absolute canonical URL. Defaults to the current route under `SITE_URL`.
   * Post pages pass `postUrl(post.id)` explicitly so the live client-side
   * value matches the trailing-slash convention `scripts/prerender-posts.ts`
   * bakes into the static file a crawler actually fetches — otherwise the
   * two would disagree on the "real" URL for the same post.
   */
  url?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

/**
 * Keeps `document.title` and the OG/Twitter/canonical tags in sync with the
 * current route. This is what makes the browser tab title (and bookmarks,
 * and any client-side share sniffing) reflect the page a reader is actually
 * on — before this, every route inherited `index.html`'s single static
 * title regardless of navigation, since wouter routes client-side and never
 * reloads the document.
 *
 * It does NOT make link previews in WhatsApp/Facebook work — those
 * scrapers don't execute JavaScript, so they never see DOM changes made
 * here. That's `scripts/prerender-posts.ts`'s job, which bakes the same
 * values into static HTML at build time. This hook and that script must
 * agree on what a post's meta should be; both derive it from the same
 * `Post` object so there's one definition of "what a post's share preview
 * looks like," not two that can drift.
 */
export function useDocumentMeta(meta: DocumentMeta) {
  const [location] = useLocation();

  useEffect(() => {
    const fullTitle = `${meta.title} — ${SITE_NAME}`;
    const description = truncate(meta.description);
    const image = absoluteUrl(meta.image || DEFAULT_OG_IMAGE);
    const url = meta.url ?? SITE_URL + location.replace(/^\//, '');

    document.title = fullTitle;

    upsertMeta('name', 'description', description);

    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', meta.type ?? 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    upsertLink('canonical', url);

    if (meta.publishedTime) {
      upsertMeta('property', 'article:published_time', meta.publishedTime);
    } else {
      removeMeta('property', 'article:published_time');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, meta.title, meta.description, meta.image, meta.type, meta.publishedTime, meta.url]);
}

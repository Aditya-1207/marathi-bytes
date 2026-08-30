/**
 * A lossy, casual Devanagari → Latin transliteration used only to widen
 * search matching — never for display. Real posts (everything published
 * through Decap) are entirely in Devanagari: title, slug, tags, and body.
 * `search.ts` needs *some* Latin text to compare a query like "bhet" against;
 * this generates it once per post rather than asking the author to type a
 * romanized version by hand.
 *
 * This is intentionally casual/phonetic (e.g. both ट and त map to "t") rather
 * than strict IAST — a reader typing a search query doesn't know diacritics,
 * and collisions here only produce extra matches, never missed ones, since
 * the caller does a substring check.
 *
 * Not a general-purpose transliterator: nukta forms, Vedic marks, and other
 * rare marks are approximated or dropped rather than modelled precisely.
 */

const INDEPENDENT_VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ri', 'ॠ': 'ri', 'ऌ': 'lu', 'ॡ': 'lu',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'ॲ': 'a', 'ऑ': 'o', // Marathi candra vowels for English loanwords (बॅंक, ऑफिस)
};

const NUKTA_CONSONANTS: Record<string, string> = {
  'क़': 'q', 'ख़': 'kh', 'ग़': 'g', 'ज़': 'z',
  'ड़': 'r', 'ढ़': 'rh', 'फ़': 'f', 'य़': 'y',
};

const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'ळ': 'l', // Marathi retroflex L
};

const MATRAS: Record<string, string> = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
  'ृ': 'ri', 'ॄ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ॅ': 'a', 'ॉ': 'o', // candra matras (बॅट, डॉक्टर)
};

const VIRAMA = '्';
const NUKTA = '़';
const ANUSVARA = 'ं';
const VISARGA = 'ः';
const CHANDRABINDU = 'ँ';
const AVAGRAHA = 'ऽ';

const DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

export function devanagariToLatin(text: string): string {
  const chars = Array.from(text);
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (DIGITS[ch]) { out += DIGITS[ch]; continue; }
    if (INDEPENDENT_VOWELS[ch]) { out += INDEPENDENT_VOWELS[ch]; continue; }
    if (ch === ANUSVARA || ch === CHANDRABINDU) { out += 'n'; continue; }
    if (ch === VISARGA) { out += 'h'; continue; }
    if (ch === AVAGRAHA || ch === VIRAMA || ch === NUKTA) { continue; }

    let consonant = NUKTA_CONSONANTS[ch] ?? CONSONANTS[ch];
    if (consonant === undefined) {
      out += ch; // not Devanagari — pass through unchanged (Latin, punctuation, spaces)
      continue;
    }

    // Precomposed nukta consonant already resolved above; a base consonant
    // immediately followed by a combining nukta mark is close enough without
    // a dedicated table — just consume the mark.
    let next = i + 1 < chars.length ? chars[i + 1] : undefined;
    if (next === NUKTA) {
      i += 1;
      next = i + 1 < chars.length ? chars[i + 1] : undefined;
    }

    if (next === VIRAMA) {
      out += consonant; // conjunct: suppress inherent vowel
      i += 1;
    } else if (next !== undefined && MATRAS[next]) {
      out += consonant + MATRAS[next];
      i += 1;
    } else {
      out += consonant + 'a'; // inherent vowel
    }
  }

  return out;
}

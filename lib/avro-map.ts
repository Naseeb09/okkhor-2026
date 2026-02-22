/**
 * Simplified Avro/Phonetic Bangla keyboard mapping.
 * Maps roman keys to Bangla characters for the virtual keyboard.
 * Based on Avro phonetic romanization.
 */

export interface KeyDef {
  /** Roman phonetic label shown on key */
  label: string;
  /** Bangla character(s) to insert - can be main + withVowel for dependent sign */
  char: string;
  /** Optional: vowel sign to attach to previous consonant (e.g. া for aa) */
  vowelSign?: string;
}

// Independent vowels: অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ
// Vowel signs (dependent): া ি ী ু ূ ৃ ে ৈ ো ৌ
export const BANGLA_VOWELS: KeyDef[] = [
  { label: "a", char: "অ" },
  { label: "aa", char: "আ", vowelSign: "া" },
  { label: "i", char: "ই", vowelSign: "ি" },
  { label: "ee", char: "ঈ", vowelSign: "ী" },
  { label: "u", char: "উ", vowelSign: "ু" },
  { label: "oo", char: "ঊ", vowelSign: "ূ" },
  { label: "ri", char: "ঋ", vowelSign: "ৃ" },
  { label: "e", char: "এ", vowelSign: "ে" },
  { label: "oi", char: "ঐ", vowelSign: "ৈ" },
  { label: "o", char: "ও", vowelSign: "ো" },
  { label: "ou", char: "ঔ", vowelSign: "ৌ" },
];

// Consonants with halant for conjuncts
export const BANGLA_CONSONANTS: KeyDef[] = [
  { label: "k", char: "ক" },
  { label: "kh", char: "খ" },
  { label: "g", char: "গ" },
  { label: "gh", char: "ঘ" },
  { label: "ng", char: "ঙ" },
  { label: "c", char: "চ" },
  { label: "ch", char: "ছ" },
  { label: "j", char: "জ" },
  { label: "jh", char: "ঝ" },
  { label: "Ng", char: "ঞ" },
  { label: "T", char: "ট" },
  { label: "Th", char: "ঠ" },
  { label: "D", char: "ড" },
  { label: "Dh", char: "ঢ" },
  { label: "N", char: "ণ" },
  { label: "t", char: "ত" },
  { label: "th", char: "থ" },
  { label: "d", char: "দ" },
  { label: "dh", char: "ধ" },
  { label: "n", char: "ন" },
  { label: "p", char: "প" },
  { label: "ph", char: "ফ" },
  { label: "b", char: "ব" },
  { label: "bh", char: "ভ" },
  { label: "m", char: "ম" },
  { label: "z", char: "য" },
  { label: "r", char: "র" },
  { label: "l", char: "ল" },
  { label: "sh", char: "শ" },
  { label: "Sh", char: "ষ" },
  { label: "s", char: "স" },
  { label: "h", char: "হ" },
  { label: "khio", char: "ক্ষ" },
  { label: "ong", char: "ং" },
  { label: ": ", char: "ঃ" },
  { label: ". ", char: "ঁ" },
];

// Virama (halant) for consonant conjuncts
export const HALANT = "্";

// Keyboard rows for layout
export const KEYBOARD_ROWS: { keys: KeyDef[]; className?: string }[] = [
  {
    keys: BANGLA_VOWELS.slice(0, 6),
    className: "justify-center",
  },
  {
    keys: BANGLA_VOWELS.slice(6, 11),
    className: "justify-center",
  },
  {
    keys: BANGLA_CONSONANTS.slice(0, 11),
  },
  {
    keys: BANGLA_CONSONANTS.slice(11, 22),
  },
  {
    keys: BANGLA_CONSONANTS.slice(22),
    className: "justify-center",
  },
];

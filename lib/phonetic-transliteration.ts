// Avro-like phonetic transliteration mapping
const PHONETIC_MAP: Record<string, string> = {
  // Vowels
  a: 'আ',
  aa: 'আ',
  i: 'ই',
  ii: 'ঈ',
  u: 'উ',
  uu: 'ঊ',
  e: 'এ',
  ee: 'ঈ',
  o: 'ও',
  oo: 'ঊ',

  // Consonants
  k: 'ক',
  kh: 'খ',
  g: 'গ',
  gh: 'ঘ',
  ng: 'ঙ',
  ch: 'চ',
  chh: 'ছ',
  j: 'জ',
  jh: 'ঝ',
  ny: 'ঞ',
  t: 'ট',
  th: 'ঠ',
  d: 'ড',
  dh: 'ঢ',
  n: 'ন',
  p: 'প',
  ph: 'ফ',
  b: 'ব',
  bh: 'ভ',
  m: 'ম',
  y: 'য',
  r: 'র',
  l: 'ল',
  s: 'স',
  sh: 'শ',
  ss: 'ষ',
  h: 'হ',

  // Common phrases
  ami: 'আমি',
  khabo: 'খাবো',
  nam: 'নাম',
  nam_ki: 'নাম কি',
  shuvo: 'শুভো',
};

export function phoneticTransliterate(text: string): string {
  let result = '';
  const words = text.split(' ');

  for (const word of words) {
    let transliterated = '';
    let i = 0;

    while (i < word.length) {
      let matched = false;

      // Try to match longest sequences first (3+ chars)
      for (let len = Math.min(4, word.length - i); len >= 1; len--) {
        const substr = word.substring(i, i + len).toLowerCase();
        if (PHONETIC_MAP[substr]) {
          transliterated += PHONETIC_MAP[substr];
          i += len;
          matched = true;
          break;
        }
      }

      if (!matched) {
        transliterated += word[i];
        i++;
      }
    }

    result += transliterated + ' ';
  }

  return result.trim();
}

export function getTransliterationPreview(text: string): string {
  // Get preview for current incomplete word
  const words = text.split(' ');
  const lastWord = words[words.length - 1];
  
  if (!lastWord) return '';

  let preview = '';
  let i = 0;

  while (i < lastWord.length) {
    let matched = false;

    for (let len = Math.min(4, lastWord.length - i); len >= 1; len--) {
      const substr = lastWord.substring(i, i + len).toLowerCase();
      if (PHONETIC_MAP[substr]) {
        preview += PHONETIC_MAP[substr];
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      preview += lastWord[i];
      i++;
    }
  }

  return preview;
}

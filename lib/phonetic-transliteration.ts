// Define the building blocks
const CONSONANTS: Record<string, string> = {
  'k': 'ক', 'kh': 'খ', 'g': 'গ', 'gh': 'ঘ', 'ng': 'ঙ',
  'ch': 'চ', 'chh': 'ছ', 'j': 'জ', 'jh': 'ঝ', 'ny': 'ঞ',
  't': 'ট', 'th': 'ঠ', 'd': 'ড', 'dh': 'ঢ', 'n': 'ন',
  'p': 'প', 'ph': 'ফ', 'f': 'ফ', 'b': 'ব', 'bh': 'ভ', 'v': 'ভ',
  'm': 'ম', 'z': 'য', 'y': 'য়', 'r': 'র', 'l': 'ল',
  'sh': 'শ', 'ss': 'ষ', 's': 'স', 'h': 'হ', 'rr': 'ড়'
};

const VOWEL_SIGNS: Record<string, string> = {
  'a': 'া', 'i': 'ি', 'ii': 'ী', 'ee': 'ী', 'u': 'ু', 
  'uu': 'ূ', 'oo': 'ূ', 'e': 'ে', 'o': 'ো', 'oi': 'ৈ', 'ou': 'ৌ'
};

const FULL_VOWELS: Record<string, string> = {
  'a': 'আ', 'i': 'ই', 'ii': 'ঈ', 'ee': 'ঈ', 'u': 'উ', 
  'uu': 'ঊ', 'oo': 'ঊ', 'e': 'এ', 'o': 'ও', 'oi': 'ঐ', 'ou': 'ঔ'
};

// Map for specific English characters that should stay English (like numbers)
const SPECIAL: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export function phoneticTransliterate(text: string): string {
  if (!text) return "";
  let result = "";
  const input = text.toLowerCase();
  let i = 0;

  while (i < input.length) {
    let matched = false;

    // 1. Handle Spaces and Special Chars immediately
    if (input[i] === " " || SPECIAL[input[i]]) {
      result += SPECIAL[input[i]] || input[i];
      i++;
      continue;
    }

    // 2. Try matching 2-character sequences first (kh, sh, oi, etc.)
    const twoChars = input.substring(i, i + 2);
    
    // Check for 2-char Consonants
    if (CONSONANTS[twoChars]) {
      result += CONSONANTS[twoChars];
      i += 2;
      continue;
    }
    
    // Check for 2-char Vowels (needs context check)
    if (FULL_VOWELS[twoChars]) {
      const prevChar = result.slice(-1);
      // If previous was a consonant, use Vowel Sign (Kar)
      if (Object.values(CONSONANTS).includes(prevChar)) {
        result += VOWEL_SIGNS[twoChars] || FULL_VOWELS[twoChars];
      } else {
        result += FULL_VOWELS[twoChars];
      }
      i += 2;
      continue;
    }

    // 3. Try matching 1-character sequences
    const oneChar = input[i];

    if (CONSONANTS[oneChar]) {
      result += CONSONANTS[oneChar];
      matched = true;
    } else if (FULL_VOWELS[oneChar]) {
      const prevChar = result.slice(-1);
      // Check if the previous character in the RESULT string is a Bangla Consonant
      const isPrevConsonant = Object.values(CONSONANTS).includes(prevChar);

      if (isPrevConsonant) {
        // Special case for 'a' as inherent vowel (ignore if it's just 'a' like 'ka' -> 'ক')
        // In many phonetic tools, 'a' after a consonant is silent or makes it 'ka'
        // For "hoga", 'o' and 'a' need to be Kars.
        result += VOWEL_SIGNS[oneChar] || "";
      } else {
        result += FULL_VOWELS[oneChar];
      }
      matched = true;
    }

    if (matched) {
      i++;
    } else {
      // Fallback for untranslatable characters
      result += input[i];
      i++;
    }
  }

  return result;
}
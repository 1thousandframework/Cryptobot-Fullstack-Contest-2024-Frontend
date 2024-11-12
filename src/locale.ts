import {ref} from "vue";

export const locales = new Map<string, Map<string, string>>();
export const curLang = ref('');

// Language inheritance for CIS region.
const langRuInheritance = new Set([
  'uk', 'be',
  'ka', 'hy', 'az',
  'kk', 'ky', 'uz', 'tg', 'tk'
])

// Normalizes language code to read proper Map from locales variable.
function normalizeLang(lang: string): string {
  lang = lang.toLowerCase()
  if (lang === 'ru' || langRuInheritance.has(lang)) {
    return 'ru'
  } else {
    return 'en'
  }
}

// lc gets translation for specified language and specified key.
export function lc(key: string): string {
  return locales.get(curLang.value)?.get(key) || key
}

export function lcP(key: string, quantity: number, addQuantity: boolean = false): string {
  const variants = lc(key).split(' ')
  return (addQuantity ? quantity + ' ' : '') + variants[plurals[curLang.value](quantity)] || ''
}

const plurals: Record<string, (n: number) => number> = {
  'en': (n: number) => {
    return n === 1 ? 0 : 1
  },
  'ru': (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) {
      return 0
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
      return 1
    } else {
      return 2
    }
  }
}

export async function loadLang(lang?: string): Promise<Error | null> {
  lang = normalizeLang(lang || '')
  if (!locales.has(lang)) {
    try {
      const result = await fetch('/locales/' + lang + '.json?' + import.meta.env.BUILD_TS)
      const locale = await result.json()
      locales.set(lang, new Map(Object.entries(locale)))
    } catch (e) {
      return <Error>e
    }
  }
  curLang.value = lang
  return null
}


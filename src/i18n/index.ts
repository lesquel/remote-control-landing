export const LOCALES = ['en', 'es'] as const;
export type Lang = typeof LOCALES[number];

export const DEFAULT_LOCALE: Lang = 'en';

export const LOCALE_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
};

export const LOCALE_FULL_LABELS: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
};

/** Returns the URL pathname for a given lang. EN at `/`, ES at `/es/`. */
export function localePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  if (lang === 'en') return `/${clean}`.replace(/\/$/, '') || '/';
  return `/${lang}/${clean}`.replace(/\/$/, '') || `/${lang}`;
}

/** The "other" lang to switch to. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

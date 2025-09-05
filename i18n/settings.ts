export const fallbackLng = 'en';
export const languages = ['en', 'zh'];

export function getOptions(lng = fallbackLng, ns = ['common']) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    ns,
    defaultNS: 'common',
    fallbackNS: 'common',
  };
}

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';

export default async function initTranslations(lng: string, ns: string[] = ['common']) {
  const i18nInstance = createInstance();
  i18nInstance.use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`../public/locales/${language}/${namespace}.json`)
    )
  );
  await i18nInstance.init(getOptions(lng, ns));
  return i18nInstance.services.resourceStore.data;
}

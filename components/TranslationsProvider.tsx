"use client";

import { I18nextProvider } from 'react-i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { createInstance, i18n as I18nType, Resource } from 'i18next';
import { useState } from 'react';
import { getOptions } from '@/i18n/settings';

interface Props {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}

export default function TranslationsProvider({ children, locale, resources }: Props) {
  const [i18n] = useState(() => {
    const instance: I18nType = createInstance();
    instance.use(initReactI18next).init({
      ...getOptions(locale),
      resources,
    });
    return instance;
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

import "../globals.css";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/i18n";
import { languages } from "@/i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ locale: lng }));
}

const ultralightitalic = localFont({
  src: "../fonts/ultralightitalic.woff",
  variable: "--font-ultralight-italic",
  weight: "300", // 或者其他适合的权重
});

export const metadata: Metadata = {
  title: "Kohaku",
  description: "Kohaku Personal Website",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const resources = await initTranslations(locale, ["common"]);
  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={`${ultralightitalic.variable} antialiased`}>
        <ThemeProvider attribute="class">
          <TranslationsProvider locale={locale} resources={resources}>
            <Layout>{children}</Layout>
            <Toaster />
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

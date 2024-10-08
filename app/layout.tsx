import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { Layout } from "@/components/Layout";

const ultralightitalic = localFont({
  src: "./fonts/ultralightitalic.woff",
  variable: "--font-ultralight-italic",
  weight: "300",  // 或者其他适合的权重
});

const FOTMatisseProUB = localFont({
  src: "./fonts/FOTMatisseProUB.woff",
  variable: "--font-fot-matisse-pro-ub",
  weight: "700",  // 或者其他适合的权重
});

export const metadata: Metadata = {
  title: "Kohaku",
  description: "Kohaku Personal Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${ultralightitalic.variable} ${FOTMatisseProUB.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}

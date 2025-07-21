import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const ultralightitalic = localFont({
  src: "./fonts/ultralightitalic.woff",
  variable: "--font-ultralight-italic",
  weight: "300", // 或者其他适合的权重
});

const FOTMatisseProUB = localFont({
  src: "./fonts/FOTMatisseProUB.woff",
  variable: "--font-fot-matisse-pro-ub",
  weight: "700", // 或者其他适合的权重
});

export const metadata: Metadata = {
  title: "Kohaku",
  description: "Kohaku Personal Website",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${ultralightitalic.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <AuthProvider>
            <Layout>{children}</Layout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

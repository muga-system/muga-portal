import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { LayoutFrameDecor } from "@/components/layout-frame-decor";
import { SiteBreadcrumb } from "@/components/site-breadcrumb";
import { AnalyticsTracker } from "@/components/analytics-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MUGA - Arquitectura web para conversión",
  description:
    "Conversión, jerarquía, flujo y secuencia aplicados a la estructura de tu web.",
  metadataBase: new URL("https://muga.dev"),
  icons: {
    icon: "/logo/logo.png",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#191717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-clip">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--color-obscure)] focus:px-3 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          Saltar al contenido
        </a>
        <SiteNavigation />
        <SiteBreadcrumb />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <main id="main-content" className="relative flex-1 overflow-x-clip pt-[var(--layout-header-offset)]">
          <LayoutFrameDecor
            sideInsetClassName="-top-[var(--layout-header-offset)] bottom-0"
            centerInsetClassName="-top-[var(--layout-header-offset)] bottom-0"
          />

          <div className="relative z-10">{children}</div>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

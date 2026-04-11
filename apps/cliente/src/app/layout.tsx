import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muga Portal",
  description: "Portal interno para gestionar proyectos, revisiones y entregables de Muga.",
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
      <body className="muga-client-bg min-h-full flex flex-col overflow-x-clip">
        {children}
      </body>
    </html>
  );
}

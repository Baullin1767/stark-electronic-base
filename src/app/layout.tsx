import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/manrope";
import "./globals.css";
import "@/generated/site-content.css";
import { getSiteUrl } from "@/lib/site-url";
import { text } from "@/lib/content";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: text("meta.default_title"),
    template: text("meta.title_template"),
  },
  description: text("meta.description"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Stark Electronic Base",
    title: text("meta.og_title"),
    description: text("meta.og_description"),
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: text("meta.og_alt"),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stark Electronic Base",
    description: text("meta.twitter_description"),
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/manrope";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stark Electronic Base — голосовая клиентская база",
    template: "%s | Stark Electronic Base",
  },
  description:
    "Сервис для ведения клиентов, посещений, рекомендаций и фотографий через обычный диалог с ИИ.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Stark Electronic Base",
    title: "Клиентская база, которую можно вести обычным голосом",
    description:
      "Расскажите о клиенте — система подготовит структурированную запись для проверки.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Stark Electronic Base — голосовая клиентская база",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stark Electronic Base",
    description: "Клиентская база, которую можно вести обычным голосом.",
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

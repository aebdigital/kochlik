import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { createSiteJsonLd, siteConfig } from "@/lib/seo";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.defaultTitle} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.siteUrl }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "home and garden",
  keywords: [
    "dizajnové kvetináče Bratislava",
    "kvetináče Bratislava",
    "exteriérové kvetináče",
    "interiérové kvetináče",
    "talianske kvetináče",
    "svietiace kvetináče",
    "záhradný nábytok Bratislava",
  ],
  alternates: {
    canonical: "/",
    languages: {
      sk: "/",
    },
  },
  openGraph: {
    title: `${siteConfig.defaultTitle} | ${siteConfig.name}`,
    description: siteConfig.defaultDescription,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: "Predajňa KOCHLIK v Bratislave",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.defaultTitle} | ${siteConfig.name}`,
    description: siteConfig.defaultDescription,
    images: [siteConfig.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteJsonLd = createSiteJsonLd();

  return (
    <html
      lang="sk"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className={`${montserrat.className} min-h-full flex flex-col font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

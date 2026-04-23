import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://jianbi.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "剪筆 JianBi — 一鍵把長內容剪成繁中貼文",
  description:
    "把 YouTube、Podcast 逐字稿、長文一鍵變成 Threads / X / LINE / IG 的繁體中文貼文草稿。台灣語感、口吻自然、專為繁中創作者設計。",
  keywords: [
    "內容再製",
    "繁體中文",
    "Threads 文案",
    "LINE 官方帳號",
    "Podcast 逐字稿",
    "AI 寫作",
    "剪筆",
    "JianBi",
  ],
  openGraph: {
    title: "剪筆 JianBi",
    description: "一鍵把長內容剪成繁中貼文",
    type: "website",
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
    title: "剪筆 JianBi",
    description: "一鍵把長內容剪成繁中貼文",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" className={`${notoSansTC.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}

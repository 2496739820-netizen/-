import type { Metadata } from "next";
import "./globals.css";

const title = "庄澍凯｜内容运营、视频剪辑与转化增长作品集";
const description =
  "庄澍凯的个人作品集，展示小红书全链路运营、内容策划、拍摄剪辑、投流复盘与转化增长经验，以及从注意力到行动的内容方法。";
const siteUrl = "https://zhuang-shukai-portfolio.zsk1a.chatgpt.site";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "庄澍凯",
      "内容运营",
      "新媒体运营",
      "小红书运营",
      "视频剪辑",
      "内容策划",
      "影像制作",
      "投流复盘",
      "转化增长",
      "AI创作",
      "深圳",
    ],
    authors: [{ name: "庄澍凯" }],
    creator: "庄澍凯",
    publisher: "庄澍凯",
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: "庄澍凯 Portfolio",
      title,
      description,
      url: siteUrl,
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "庄澍凯｜内容运营 × 视频剪辑 × 转化增长" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: `${siteUrl}/og.png`, alt: "庄澍凯｜内容运营 × 视频剪辑 × 转化增长" }],
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

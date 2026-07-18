import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "庄澍凯｜高端眼镜门店新媒体运营作品集";
const description =
  "庄澍凯的高端眼镜门店新媒体运营作品集，以能力雷达与真实业务结果呈现虎派眼镜的小红书运营、账号矩阵、平台投流和到店转化经验。";
const fallbackSiteUrl = "https://zhuang-shukai-eyewear-portfolio.zsk1a.chatgpt.site";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProto ?? (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
  const siteUrl = host ? `${protocol}://${host}` : fallbackSiteUrl;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "庄澍凯",
      "高端眼镜",
      "眼镜店新媒体运营",
      "小红书运营",
      "门店新媒体",
      "内容种草",
      "账号矩阵",
      "平台投流",
      "到店转化",
      "粤港澳大湾区",
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
      images: [
        {
          url: `${siteUrl}/og-radar.png`,
          width: 1200,
          height: 630,
          alt: "庄澍凯｜高端眼镜门店新媒体运营",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${siteUrl}/og-radar.png`,
          alt: "庄澍凯｜高端眼镜门店新媒体运营",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

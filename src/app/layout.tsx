import type { Metadata } from "next";
import { Manrope, Noto_Sans_KR } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://busanwaterman.co.kr'),
  title: {
    default: '부산생수배달 - 해운대, 서면 사무실 생수 배달 전문',
    template: '%s | 부산생수배달',
  },
  description: '부산 전 지역 사무실 생수 배달 전문업체 부산생수입니다. 맑고 깨끗한 생수를 가장 빠르고 안전하게 배송해 드립니다. 해운대, 센텀, 서면 정기구독 환영.',
  keywords: [
    '부산생수배달', '부산생수', '부산사무실생수배달', '사무실생수배달', 
    '부산공장생수배달', '공장생수배달', '사상공단생수배달', 
    '녹산산단생수배달', '신평장림산단생수배달', '강서산단생수배달'
  ],
  authors: [{ name: '부산생수배달' }],
  creator: '부산생수배달',
  publisher: '부산생수배달',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '부산생수배달 - 맑고 깨끗한 프리미엄 생수 배달',
    description: '부산 전 지역 사무실 생수 배달 전문. 당신의 업무 효율을 높이는 맑은 물, 지금 바로 구독하세요.',
    url: 'https://busanwaterman.co.kr',
    siteName: '부산생수배달',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '부산생수배달',
    description: '부산 전 지역 사무실 생수 배달 전문업체',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '구글서치콘솔_인증코드_여기에_입력', // 의뢰인이 나중에 추가 가능
    other: {
      'naver-site-verification': '네이버서치어드바이저_인증코드_여기에_입력', // 의뢰인이 나중에 추가 가능
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${manrope.variable} ${notoSansKr.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-background font-body-md text-body-md antialiased pt-[80px]">
        <NavBar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

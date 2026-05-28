import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "杉ヶ平キャンプ場 | 富山市八尾町・白木峰の森のキャンプ場",
  description:
    "標高636m、白木峰の山麓にある広葉樹の森に囲まれた静かなキャンプ場。テントサイト60区画、コテージ、バンガロー。ペットフレンドリー。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

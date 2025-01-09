import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "simbl",
  description: "a dumb little microblog",
  keywords: ["microblog", "twitter clone"],
  manifest: "/pwa/manifest.json",
  icons: {
    icon: "/img/png/logo.png",
    shortcut: "/img/png/logo.png",
    apple: "/img/png/logo_nomask.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/img/png/logo_nomask.png",
    },
  },
  openGraph: {
    siteName: "simbl",
    images: "/img/png/logo.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

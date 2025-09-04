import Header from "./components/Header";
import Footer from "./components/Footer";
import { Metadata, Viewport } from "next";
import { Afacad_Flux, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const font_AfacadFlux = Afacad_Flux({
  subsets: ["latin"],
  variable: "--font-afacad-flux",
  display: "swap",
});
const font_SourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  fallback: ["Courier New", "Courier", "monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simbl.userbyte.xyz"),
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
    <html
      lang="en"
      className={`${font_AfacadFlux.variable} ${font_SourceCodePro.variable}`}
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import Metadata from "./components/Metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Metadata />
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";
import Footer from "../components/Footer";
import { nfc } from "../lib/text";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  display: "swap",
});

export const metadata = {
  title: {
    default: nfc("Market"),
    template: nfc("%s | Market"),
  },
  description: nfc("Discover products, collections, and today's deals."),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

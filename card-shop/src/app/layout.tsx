import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import { CartProvider } from "@/components/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "The Card Vault — Pokémon Singles & Slabs",
    template: "%s | The Card Vault",
  },
  description:
    "Hand-picked Pokémon singles and graded slabs. Every card photographed, accurately described, and shipped fast.",
  openGraph: {
    siteName: "The Card Vault",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

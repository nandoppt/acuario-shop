import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VidaBajoAgua",
    template: "%s | VidaBajoAgua",
  },
  description:
    "Plantas, equipamiento y accesorios para crear y disfrutar tu mundo acuático.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
  className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}
>
  <CartProvider>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </CartProvider>
</body>
    </html>
  );
}
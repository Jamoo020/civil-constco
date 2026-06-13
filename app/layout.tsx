import "./globals.css";
import React from "react";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

export const metadata = {
  title: "Coast Infrastructure – Civil & Construction | Coast HQ, Nationwide Delivery",
  description:
    "Premium civil engineering and construction services from our Coast headquarters to major national projects across Kenya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

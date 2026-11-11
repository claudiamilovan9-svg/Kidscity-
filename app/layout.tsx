import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidsCity – Descoperă activități pentru copilul tău",
  description: "Grădinițe, sport, artă, cursuri și experiențe pentru copii în Timișoara și împrejurimi."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
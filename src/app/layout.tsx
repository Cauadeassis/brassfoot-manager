import type { Metadata } from "next";
import { Oswald, IBM_Plex_Mono, Barlow } from "next/font/google";
import "./global.css";
import "./animations.css";

const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});
const barlow = Barlow({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Football Manager",
  description: "Gerencie seu clube rumo à glória",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${oswald.variable} ${ibmPlexMono.variable} ${barlow.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

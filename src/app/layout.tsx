import { Metadata } from "next";
import { Oswald, IBM_Plex_Mono, Barlow } from "next/font/google";
import "./global.css";
import CardModal from "../components/modals/card";
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
  title: "Futebol de bolso",
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
      <body>
        {children}
        <CardModal />
      </body>
    </html>
  );
}

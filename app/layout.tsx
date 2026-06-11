import { Providers } from "@/components/Providers";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MatchRadar — On te dit quels matchs regarder",
  description:
    "104 matchs. On te dit lesquels regarder. Score de hype, horaires, enjeux, brief quotidien et calendrier personnalisé pour ne rater aucun gros moment sportif.",
  applicationName: "MatchRadar",
  keywords: ["football", "coupe du monde", "matchs", "sport", "radar", "calendrier sportif"],
  openGraph: {
    title: "MatchRadar — Le radar des événements sportifs à ne pas rater",
    description: "Score de hype, brief quotidien et calendrier perso. On te sort les immanquables du jour.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05080E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable} dark`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

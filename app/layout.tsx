import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StyleLab Studio — Drop-Shoulder Boxy Silhouette Tee",
  description: "Design your own custom heavyweight tee. Karachi delivery, 50% advance + COD.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className="bg-canvas font-sans antialiased">{children}</body>
    </html>
  );
}

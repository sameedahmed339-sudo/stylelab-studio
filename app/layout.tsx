import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleLab Studio — Drop-Shoulder Boxy Silhouette Tee",
  description: "Design your own custom heavyweight tee. Karachi delivery, 50% advance + COD.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#090A0F] antialiased">{children}</body>
    </html>
  );
}

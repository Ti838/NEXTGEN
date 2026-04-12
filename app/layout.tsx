import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nextgen Youth Club Uttara – BD-0103",
  description:
    "Nextgen Youth Club Uttara BD-0103 — Empowering youth through leadership, social work, volunteering, and community service in Uttara, Dhaka, Bangladesh.",
  icons: {
    icon: [
      { url: "/generated-logo.png", type: "image/png" },
      { url: "/generated-logo.png", rel: "shortcut icon" },
    ],
    apple: [{ url: "/generated-logo.png" }],
  },
  openGraph: {
    title: "Nextgen Youth Club Uttara – BD-0103",
    description: "Empowering youth through leadership, social work & community service.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

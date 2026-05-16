import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Family Trip 2026 — Trip Planner",
  description:
    "Plan and track your family trip to Japan. Itinerary, flights, budget, and checklist — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

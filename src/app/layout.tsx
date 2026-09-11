import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SENTINEL // Multi-Modal Vehicle Re-ID & Trajectory Tracking",
  description: "AI-Powered Cross-Camera Vehicle Re-Identification & Spatiotemporal Anomaly Detection for Smart City Law Enforcement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 overflow-x-hidden transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}

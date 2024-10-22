// layout.tsx
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NoteTakingProvider from "@/components/NoteTakingProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Note Taking App",
  description: "A simple note-taking app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gray-100 font-sans antialiased",
          fontSans.variable
        )}
      >
        <NoteTakingProvider>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-3xl font-bold text-gray-900">Note Taking App</h1>
            </div>
          </header>
          <main className="flex min-h-screen flex-col px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto">
            {children}
          </main>
        </NoteTakingProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Developer Snippet Vault & AI Publisher",
    template: "%s | Developer Snippet Vault & AI Publisher",
  },
  description:
    "A secure developer snippet vault with automated Google Gemini AI tag generation and plain-English code summaries.",
  keywords: [
    "developer snippets",
    "code vault",
    "AI code summaries",
    "snippet manager",
    "code search",
    "developer productivity",
    "gemini ai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

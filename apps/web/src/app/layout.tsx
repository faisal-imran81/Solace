import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/components/app/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solace: Mental Wellness Companion",
  description: "Talk things through with an AI companion, keep a private journal and track your mood. Free to use.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#131916" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#3f5a45",
          borderRadius: "0.9rem",
          fontFamily: "var(--font-figtree), system-ui, sans-serif",
        },
      }}
    >
      <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

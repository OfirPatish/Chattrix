import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chattrix - Real-time Chat Application",
  description:
    "A modern real-time chat application built with Next.js and Socket.io",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico", sizes: "any" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chattrix",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1a1a2e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dracula" data-scroll-behavior="smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="Chattrix" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="theme-color"
          content="#1a1a2e"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <div
              className="bg-base-100"
              style={{
                minHeight: "100vh",
                paddingTop: `env(safe-area-inset-top, 0px)`,
                paddingBottom: `env(safe-area-inset-bottom, 0px)`,
                paddingLeft: `env(safe-area-inset-left, 0px)`,
                paddingRight: `env(safe-area-inset-right, 0px)`,
              }}
            >
              {children}
            </div>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

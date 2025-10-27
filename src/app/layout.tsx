import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WelthAi",
  description: "One stop Finance Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            defaultTheme="light"
          >
        <main className="min-h-screen bg-background text-foreground">{children}</main>
        <Toaster richColors />
        <footer className="bg-blue-50 dark:bg-gray-900 py-6 border-t dark:border-gray-700">
              <div className="container mx-auto px-3 text-center text-gray-600 dark:text-gray-300">
                <p>© 2025 wealthAi All rights reserved. </p>
              </div>
            </footer>
            </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

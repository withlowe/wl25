import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "./charter.css"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Notes | My Blog",
  description: "A collection of notes and postcards",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="max-w-2xl mx-auto px-4 py-12">
            <header className="mb-12">
              <nav className="flex space-x-6 text-sm font-mono">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  now
                </Link>
                <Link href="/notes" className="text-muted-foreground hover:text-foreground transition-colors">
                  notes
                </Link>
                <Link href="/postcards" className="text-muted-foreground hover:text-foreground transition-colors">
                  postcards
                </Link>
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

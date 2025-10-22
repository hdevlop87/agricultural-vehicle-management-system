import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import AsyncDialog from "@/components/NDialog";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={` antialiased  h-screen w-screen overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <AsyncDialog />
          </QueryProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}

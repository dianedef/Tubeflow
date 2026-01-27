import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/i18n";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TubeFlow - Video Note-Taking",
  description: "Watch videos, take timestamped notes, and organize your content with TubeFlow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          montserrat.className,
          lato.className,
          "pb-16 sm:pb-0 sm:pt-[72px]",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <TranslationProvider>{children}</TranslationProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

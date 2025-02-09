import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";
import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";
import { myStore } from "@/lib/atoms";
import { Provider } from "jotai";
import CommandMenu from "@/components/CommandMenu";
import { fetchTemos } from "@/lib/temo";

export const metadata: Metadata = {
  title: "Temo",
  description: "Temo",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { publishedTemos, collections } = await fetchTemos();

  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={cn(
            "bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider store={myStore}>
            <CommandMenu
              publishedTemos={publishedTemos}
              collections={collections}
            />
            <TopBar />
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-64px)]">
              <div className="hidden md:block col-span-2 h-full">
                <SideBar
                  publishedTemos={publishedTemos}
                  collections={collections}
                />
              </div>
              <div className="col-span-12 md:col-span-10 w-full h-full overflow-auto">
                {children}
              </div>
            </div>
          </Provider>
        </body>
      </ThemeProvider>
    </html>
  );
}

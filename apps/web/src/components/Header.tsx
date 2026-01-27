"use client";

import { useState, useEffect } from "react";
import Logo from "./common/Logo";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserNav } from "./common/UserNav";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import {
  Home,
  Video,
  List,
  FileText,
  Settings,
} from "lucide-react";

const navLinkClass =
  "text-muted-foreground text-sm font-medium leading-6 font-montserrat hover:text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors";

const navLinkActiveClass =
  "text-foreground text-sm font-medium leading-6 font-montserrat px-3 py-1.5 rounded-md bg-accent";

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isHomePage = pathname === "/";

  return (
    <>
      {/* Desktop Header - hidden on mobile */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 hidden sm:block ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center bg-background/80 backdrop-blur-xl h-[72px] border-b border-border/50 shadow-sm">
          <div className="container px-6">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex shrink-0 items-center">
                <Logo />
              </div>

              <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center space-x-1">
                  {isHomePage ? (
                    <>
                      <Link href="/videos" className={navLinkClass}>
                        {t.common.videos}
                      </Link>
                      <Link href="/playlists" className={navLinkClass}>
                        {t.common.playlists}
                      </Link>
                      <Link href="/notes" className={navLinkClass}>
                        {t.common.notes}
                      </Link>
                      <Link href="#Benefits" className={navLinkClass}>
                        {t.common.benefits}
                      </Link>
                      <Link href="#reviews" className={navLinkClass}>
                        {t.common.reviews}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/videos"
                        className={
                          pathname.startsWith("/videos")
                            ? navLinkActiveClass
                            : navLinkClass
                        }
                      >
                        {t.common.videos}
                      </Link>
                      <Link
                        href="/playlists"
                        className={
                          pathname.startsWith("/playlists")
                            ? navLinkActiveClass
                            : navLinkClass
                        }
                      >
                        {t.common.playlists}
                      </Link>
                      <Link
                        href="/notes"
                        className={
                          pathname.startsWith("/notes")
                            ? navLinkActiveClass
                            : navLinkClass
                        }
                      >
                        {t.common.notes}
                      </Link>
                      <Link
                        href="/preferences"
                        className={
                          pathname.startsWith("/preferences")
                            ? navLinkActiveClass
                            : navLinkClass
                        }
                      >
                        {t.common.preferences}
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <ThemeToggle />
                    <UserNav
                      image={user?.imageUrl}
                      name={user?.fullName!}
                      email={user?.primaryEmailAddress?.emailAddress!}
                    />
                  </>
                ) : (
                  <>
                    <Link href="/notes">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-montserrat font-medium"
                      >
                        {t.common.signIn}
                      </Button>
                    </Link>
                    <Link href="/notes">
                      <Button
                        variant="primary"
                        size="sm"
                        className="font-montserrat font-medium"
                      >
                        {t.common.getStarted}
                      </Button>
                    </Link>
                    <ThemeToggle />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              pathname === "/"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.footer.home}</span>
          </Link>
          <Link
            href="/videos"
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              pathname.startsWith("/videos")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.common.videos}</span>
          </Link>
          <Link
            href="/playlists"
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              pathname.startsWith("/playlists")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-5 h-5" />
            <span className="text-[10px] font-medium">
              {t.common.playlists}
            </span>
          </Link>
          <Link
            href="/notes"
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              pathname.startsWith("/notes")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.common.notes}</span>
          </Link>
          <Link
            href="/preferences"
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              pathname.startsWith("/preferences")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium">
              {t.common.preferences}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}

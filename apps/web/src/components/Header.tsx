"use client";

import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./common/Logo";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserNav } from "./common/UserNav";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import * as NavigationMenu from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
};

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();
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

  return (
    <Disclosure
      as="nav"
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}
    >
      {({ open }) => (
        <>
          <div className="flex items-center bg-background h-16 sm:h-20 border-t border-gray-200">
            <div className="container px-2 sm:px-0">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex sm:hidden shrink-0 items-center">
                  <Logo isMobile={true} />
                </div>
                <div className="sm:flex hidden shrink-0 items-center">
                  <Logo />
                </div>
                {pathname === "/" && (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="hidden sm:ml-6 sm:block">
                      <Menubar>
                        <MenubarMenu>
                          <MenubarTrigger>Navigation</MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem>
                              <Link href="#Benefits">Benefits</Link>
                            </MenubarItem>
                            <MenubarItem>
                              <Link href="#reviews">Reviews</Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                              <Link href="/videos">Videos</Link>
                            </MenubarItem>
                            <MenubarItem>
                              <Link href="/notes">Notes</Link>
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger>Settings</MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem>Preferences</MenubarItem>
                            <MenubarItem>Account Settings</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Help & Support</MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  </div>
                )}
                <div className="hidden sm:flex absolute inset-y-0 right-0 gap-6 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {user ? (
                    <>
                      <Link href="/videos">
                        <Button
                          variant="ghost"
                          className="text-xl font-montserrat px-[22px] py-[11px]"
                        >
                          Videos
                        </Button>
                      </Link>
                      <Link href="/notes">
                        <Button
                          variant="primary"
                          className="text-xl font-montserrat px-[22px] py-[11px]"
                        >
                          See your Notes
                        </Button>
                      </Link>
                      <ThemeToggle />
                      <UserNav
                        image={user?.imageUrl}
                        name={user?.fullName!}
                        email={user?.primaryEmailAddress?.emailAddress!}
                      />
                    </>
                  ) : (
                    <>
                      <Menubar>
                        <MenubarMenu>
                          <MenubarTrigger>Account</MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem>
                              <Link href="/notes">Sign in</Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                              <Link href="/notes">Get Started</Link>
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger>Navigation</MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem>
                              <Link href="#Benefits">Benefits</Link>
                            </MenubarItem>
                            <MenubarItem>
                              <Link href="#reviews">Reviews</Link>
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                          <MenubarTrigger>Settings</MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem>Preferences</MenubarItem>
                            <MenubarItem>Account Settings</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Help & Support</MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                      <ThemeToggle />
                    </>
                  )}
                </div>
                <div className="block sm:hidden">
                  <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden bg-background border-t border-gray-200">
            <div className="space-y-1 px-2 pb-3 pt-2 flex flex-col gap-3 items-start">
              <DisclosureButton
                as={Link}
                href="#Benefits"
                className="text-center text-xl not-italic font-normal leading-[normal]"
              >
                Benefits
              </DisclosureButton>
              <DisclosureButton
                as={Link}
                href="#reviews"
                className="text-center text-xl not-italic font-normal leading-[normal]"
              >
                Reviews
              </DisclosureButton>
              <div className="flex gap-6 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ThemeToggle />
                <ButtonGroup>
                  <Link href="/notes">
                    <Button
                      variant="outlineAccent"
                      className="text-xl font-montserrat px-5 py-[5px]"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/notes">
                    <Button
                      variant="primary"
                      className="text-xl font-montserrat px-5 py-1.5"
                    >
                      Get Started
                    </Button>
                  </Link>
                </ButtonGroup>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

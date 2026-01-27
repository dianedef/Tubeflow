"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/icon-button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <IconButton variant="ghost" size="default" className="h-9 w-9">
        <span className="h-[1.2rem] w-[1.2rem]" />
      </IconButton>
    );
  }

  return (
    <IconButton
      variant="ghost"
      size="default"
      className="h-9 w-9 relative overflow-hidden"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </IconButton>
  );
}

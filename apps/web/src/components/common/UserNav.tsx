"use client";

import { useClerk } from "@clerk/clerk-react";
import { LogOut, Paintbrush2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTranslation } from "@/i18n";

export function UserNav({
  image,
  name,
  email,
}: {
  image: string;
  name: string;
  email: string;
}) {
  const { signOut } = useClerk();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          variant="ghost"
          size="default"
          className="h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>
              <img src={"/images/profile.png"} alt={name} />
            </AvatarFallback>
          </Avatar>
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-background"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/notes">
          <DropdownMenuItem className="hover:cursor-pointer hover:bg-accent">
            <Paintbrush2 className="mr-2 h-4 w-4 text-foreground" />
            <span className="text-foreground">{t.common.dashboard}</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="hover:cursor-pointer hover:bg-accent"
        >
          <LogOut className="mr-2 h-4 w-4 text-foreground" />
          <span className="text-foreground">{t.common.logOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

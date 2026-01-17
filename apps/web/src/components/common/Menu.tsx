import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface Props {
  menuItems: {
    title: string;
    url: string;
  }[];
}

const Menu = ({ menuItems }: Props) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col sm:flex-row items-end sm:items-center gap-[22px] md:gap-28">
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink asChild>
              <Link
                href={item.url}
                className={navigationMenuTriggerStyle({
                  className:
                    "text-foreground text-base font-semibold leading-6 underline font-montserrat hover:text-primary bg-transparent px-4",
                })}
              >
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Menu;

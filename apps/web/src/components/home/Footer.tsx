"use client";

import React from "react";
import Logo from "../common/Logo";
import Menu from "../common/Menu";
import { useTranslation } from "@/i18n";

const Footer = () => {
  const { t } = useTranslation();

  const menuItems = [
    { title: t.footer.home, url: "/" },
    { title: t.common.benefits, url: "#Benefits" },
    { title: t.common.getStarted, url: "/notes" },
    { title: t.common.reviews, url: "#reviews" },
  ];

  return (
    <>
      <div className="container hidden sm:block py-12">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center pb-6">
          <Logo />
          <Menu menuItems={menuItems} />
        </div>
        <div className="pt-8 border-t border-solid border-border">
          <h3 className="text-foreground text-xl not-italic font-semibold leading-[30px] font-montserrat pb-2">
            {t.footer.tagline}
          </h3>
          <div className="flex justify-between">
            <p className="text-muted-foreground font-montserrat text-base not-italic font-normal leading-6">
              {t.footer.description}
            </p>
            <p className="text-muted-foreground font-inter text-base not-italic font-normal leading-6">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>

      <div className="container sm:hidden pt-7 pl-6 pr-5 pb-20">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-6">
            <Logo />
            <h3 className="text-foreground text-base not-italic font-semibold leading-[18px] font-montserrat">
              {t.footer.tagline}
            </h3>
            <p className="text-foreground font-montserrat text-base not-italic font-light leading-[18px]">
              {t.footer.description}
            </p>
          </div>
          <div className="min-w-[100px]">
            <Menu menuItems={menuItems} />
          </div>
        </div>
        <p className="text-muted-foreground font-inter text-center text-base not-italic font-light leading-[18px] py-11">
          {t.footer.copyright} <br />
          <span className="mt-1"> {t.footer.iconsBy}</span>
        </p>
      </div>
    </>
  );
};

export default Footer;

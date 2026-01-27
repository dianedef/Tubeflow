"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

const FooterHero = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-primary">
      <div className="flex flex-wrap md:flex-nowrap justify-between container py-20 px-6 sm:px-0">
        <div className="max-w-[802px]">
          <h2 className="font-montserrat text-wrap text-primary-foreground not-italic text-3xl md:text-[57px] font-semibold sm:leading-[109.3%] sm:tracking-[-1.425px] leading-[97.3%] tracking-[-0.75px] pb-[31px] sm:pb-[38px]">
            {t.footerHero.title}
          </h2>
          <p className="text-primary-foreground/90 max-w-[681px] text-xl sm:text-3xl not-italic font-normal leading-[103.3%] tracking-[-0.75px] font-montserrat pb-[66px] sm:pb-[53px]">
            {t.footerHero.subtitle}
          </p>
          <Link href={"/notes"}>
            <Button
              variant="gradient"
              className="flex max-w-[438px] w-full justify-center items-center gap-2.5 text-xl sm:text-3xl px-8 py-4"
            >
              {t.footerHero.cta}
            </Button>
          </Link>
        </div>
        <div className="mt-20 md:mt-0">
          <Image
            src="/images/monitor.png"
            alt="hero"
            width={560}
            height={456}
          />
        </div>
      </div>
    </div>
  );
};

export default FooterHero;

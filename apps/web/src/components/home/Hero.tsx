"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-section dark:from-background dark:via-background dark:to-section">
      <div className="absolute inset-0 bg-[url('/images/background.png')] bg-[length:261px_261px] opacity-5 dark:opacity-[0.03]" />
      <div className="container relative py-16 sm:py-36 px-6 sm:px-0">
        <div className="flex sm:flex-wrap flex-nowrap justify-between items-center max-h-[690px] h-full">
          <div>
            <h2 className="font-montserrat pb-5 sm:pb-[26px] text-[28px] sm:text-[56px] not-italic font-medium leading-[111.3%] tracking-[-0.7px] sm:tracking-[-1.4px] text-foreground whitespace-pre-line">
              {t.hero.title}
            </h2>
            <p className="font-montserrat sm:pb-16 max-w-[680px] text-base sm:text-2xl not-italic font-normal leading-[130%] tracking-[-0.3px] sm:tracking-[-0.6px] pb-8 text-muted-foreground">
              {t.hero.subtitle}
            </p>
            <Link href={"/notes"}>
              <Button
                variant="primary"
                className="gap-2.5 text-base sm:text-xl px-6 py-3 sm:px-8 sm:py-4"
              >
                {t.hero.cta}
              </Button>
            </Link>
          </div>
          <div className="max-w-[570px] w-full h-full">
            <div className="relative max-w-[570px] w-full h-[380px] sm:h-[680px]">
              <div className="absolute z-10 inset-0 flex justify-center items-center bg-primary/60 opacity-40 blur-[102px] rounded-[673px]">
                <Image
                  src={"/images/hero_image_bg.svg"}
                  width={541}
                  height={673}
                  alt="hero"
                  className="w-[344px] sm:w-[541px]"
                />
              </div>
              <div className="absolute z-50 inset-0 flex justify-center items-center">
                <Image
                  src={"/images/hero.png"}
                  width={561}
                  height={456}
                  alt="hero"
                  className="w-[357px] sm:w-[561px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

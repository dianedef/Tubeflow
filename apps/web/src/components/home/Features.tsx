"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t.features.smartOrgTitle,
      description: t.features.smartOrgDesc,
      benefitTag: t.features.smartOrgTag,
      image: "/images/goodNews.png",
    },
    {
      title: t.features.subDashTitle,
      description: t.features.subDashDesc,
      benefitTag: t.features.subDashTag,
      image: "/images/cloudSync.png",
    },
    {
      title: t.features.distractionTitle,
      description: t.features.distractionDesc,
      benefitTag: t.features.distractionTag,
      image: "/images/googleCalander.png",
    },
    {
      title: t.features.searchTitle,
      description: t.features.searchDesc,
      benefitTag: t.features.searchTag,
      image: "/images/bot.png",
    },
    {
      title: t.features.crossDeviceTitle,
      description: t.features.crossDeviceDesc,
      benefitTag: t.features.crossDeviceTag,
      image: "/images/cloudSync.png",
    },
    {
      title: t.features.privacyTitle,
      description: t.features.privacyDesc,
      benefitTag: t.features.privacyTag,
      image: "/images/goodNews.png",
    },
  ];

  return (
    <section
      id="Features"
      className="relative pointer-events-none bg-background overflow-hidden"
    >
      <Image
        src={"/images/blue-circle.svg"}
        width={503}
        height={531}
        alt=""
        className="absolute hidden sm:block -left-40 -top-48 h-[531px] opacity-30 dark:opacity-100"
      />
      <div className="container py-16 sm:py-24 px-2 md:px-0">
        <p className="text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] text-center font-montserrat pb-2 sm:pb-[18px] text-muted-foreground">
          {t.features.label}
        </p>
        <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-center pb-[46px] sm:pb-[87px] text-foreground">
          {t.features.title}
        </h3>

        <div className="relative">
          <div className="hidden sm:flex justify-between items-center absolute inset-0 -z-10 opacity-20 dark:opacity-100">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Image
                  src="/images/cricle.svg"
                  width={183}
                  height={193}
                  alt="line"
                  key={index}
                />
              ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 z-10 pointer-events-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 bg-section-card border rounded-[17px] py-6 px-4 sm:py-8 sm:px-6 border-solid border-section-card-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="min-w-16 sm:min-w-20">
                    <Image
                      src={feature.image}
                      width={80}
                      height={80}
                      alt="feature"
                      className="sm:w-[80px] w-[58px]"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[24px] sm:text-[36px] not-italic font-medium leading-[90.3%] tracking-[-0.9px] pb-3 sm:pb-4 font-montserrat text-section-foreground">
                      {feature.title}
                    </h4>
                    <p className="font-montserrat text-[15px] sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.4px] text-section-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="ml-0 sm:ml-[104px]">
                  <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm sm:text-base font-medium">
                    {feature.benefitTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

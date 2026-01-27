"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n";

const Benefits = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t.benefitsSection.effortlessTitle,
      description: t.benefitsSection.effortlessDesc,
      image: "/images/goodNews.png",
    },
    {
      title: t.benefitsSection.syncTitle,
      description: t.benefitsSection.syncDesc,
      image: "/images/cloudSync.png",
    },
    {
      title: t.benefitsSection.productivityTitle,
      description: t.benefitsSection.productivityDesc,
      image: "/images/googleCalander.png",
    },
    {
      title: t.benefitsSection.aiTitle,
      description: t.benefitsSection.aiDesc,
      image: "/images/bot.png",
    },
  ];

  return (
    <section
      id="Benefits"
      className="relative pointer-events-none bg-section overflow-hidden"
    >
      <Image
        src={"/images/blue-circle.svg"}
        width={503}
        height={531}
        alt=""
        className="absolute hidden sm:block -left-40 -top-48 h-[531px] opacity-30 dark:opacity-100"
      />
      <div className="container py-16 px-2 md:px-0">
        <p className="text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] text-center font-montserrat pb-2 sm:pb-[18px] text-section-muted">
          {t.benefitsSection.label}
        </p>
        <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-center pb-[46px] sm:pb-[87px] text-section-foreground">
          {t.benefitsSection.title}
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
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-2 sm:gap-7 bg-section-card items-center border rounded-[17px] py-4 px-2 sm:py-12 sm:px-6 border-solid border-section-card-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div className="min-w-16 sm:min-w-28">
                  <Image
                    src={benefit.image}
                    width={100}
                    height={100}
                    alt="benefit"
                    className="sm:w-[100px] w-[58px]"
                  />
                </div>
                <div>
                  <h4 className="text-[24px] sm:text-[42px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] pb-2 sm:pb-6 font-montserrat text-section-foreground">
                    {benefit.title}
                  </h4>
                  <p className="font-montserrat pb-2 text-[17px] sm:text-3xl not-italic font-normal leading-[90.3%] tracking-[-0.75px] text-section-muted">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;

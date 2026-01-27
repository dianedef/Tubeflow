"use client";

import React from "react";
import { useTranslation } from "@/i18n";

interface ProblemCardProps {
  icon: string;
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 bg-section-card border rounded-[17px] p-6 sm:p-8 border-solid border-section-card-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <span className="text-4xl sm:text-5xl">{icon}</span>
        <h4 className="text-2xl sm:text-[32px] not-italic font-medium leading-[90.3%] tracking-[-0.8px] font-montserrat text-section-foreground">
          {title}
        </h4>
      </div>
      <p className="font-montserrat text-base sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.4px] text-section-muted">
        {description}
      </p>
    </div>
  );
};

const ProblemSection = () => {
  const { t } = useTranslation();

  const problems = [
    {
      icon: "\ud83c\udfaf",
      title: t.problem.algorithmicTyranny,
      description: t.problem.algorithmicTyrannyDesc,
    },
    {
      icon: "\ud83d\udccb",
      title: t.problem.playlistChaos,
      description: t.problem.playlistChaosDesc,
    },
    {
      icon: "\ud83d\udcfa",
      title: t.problem.subscriptionOverload,
      description: t.problem.subscriptionOverloadDesc,
    },
    {
      icon: "\ud83c\udf0a",
      title: t.problem.lostInFeed,
      description: t.problem.lostInFeedDesc,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-section">
      <div className="container px-6 sm:px-0">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-section-foreground">
            {t.problem.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {problems.map((problem, index) => (
            <ProblemCard
              key={index}
              icon={problem.icon}
              title={problem.title}
              description={problem.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

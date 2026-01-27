"use client";

import React from "react";
import { useTranslation } from "@/i18n";

interface SolutionPillarProps {
  icon: string;
  title: string;
  description: string;
}

const SolutionPillar: React.FC<SolutionPillarProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-4 sm:gap-6 p-6 sm:p-8 bg-section-card border border-section-card-border rounded-[17px] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-5xl sm:text-6xl">{icon}</span>
        <h4 className="text-2xl sm:text-[36px] not-italic font-medium leading-[90.3%] tracking-[-0.9px] font-montserrat text-section-foreground">
          {title}
        </h4>
      </div>
      <p className="font-montserrat text-base sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.4px] text-section-muted max-w-[400px]">
        {description}
      </p>
    </div>
  );
};

const SolutionSection = () => {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: "\u2728",
      title: t.solution.thematicPlaylists,
      description: t.solution.thematicPlaylistsDesc,
    },
    {
      icon: "\ud83c\udf9b\ufe0f",
      title: t.solution.subscriptionControl,
      description: t.solution.subscriptionControlDesc,
    },
    {
      icon: "\ud83d\udeab",
      title: t.solution.zeroAlgorithm,
      description: t.solution.zeroAlgorithmDesc,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container px-6 sm:px-0">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat mb-4 sm:mb-6 text-foreground">
            {t.solution.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {solutions.map((solution, index) => (
            <SolutionPillar
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

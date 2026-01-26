import React from "react";

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
    <div className="flex flex-col items-center text-center gap-4 sm:gap-6 p-6 sm:p-8 bg-gray-900 border border-gray-800 rounded-[17px] shadow-xl hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-5xl sm:text-6xl">{icon}</span>
        <h4 className="text-2xl sm:text-[36px] not-italic font-medium leading-[90.3%] tracking-[-0.9px] font-montserrat text-white">
          {title}
        </h4>
      </div>
      <p className="font-montserrat text-base sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.4px] text-gray-300 max-w-[400px]">
        {description}
      </p>
    </div>
  );
};

const solutions = [
  {
    icon: "✨",
    title: "Thematic Playlists",
    description:
      "Create playlists by topic, mood, or project. Make them your primary way to navigate YouTube.",
  },
  {
    icon: "🎛️",
    title: "Subscription Control",
    description:
      "Group channels into categories. See what's new from your favorites without the noise.",
  },
  {
    icon: "🚫",
    title: "Zero Algorithmic Interference",
    description:
      "No suggestions. No rabbit holes. Just the content you chose to watch.",
  },
];

const SolutionSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container px-6 sm:px-0">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat mb-4 sm:mb-6 text-white">
            Your Content, Your Rules
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

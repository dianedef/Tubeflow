import React from "react";

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
    <div className="flex flex-col gap-4 sm:gap-6 bg-gray-900 border rounded-[17px] p-6 sm:p-8 border-solid border-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-3">
        <span className="text-4xl sm:text-5xl">{icon}</span>
        <h4 className="text-2xl sm:text-[32px] not-italic font-medium leading-[90.3%] tracking-[-0.8px] font-montserrat text-white">
          {title}
        </h4>
      </div>
      <p className="font-montserrat text-base sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.4px] text-gray-300">
        {description}
      </p>
    </div>
  );
};

const problems = [
  {
    icon: "🎯",
    title: "Algorithmic Tyranny",
    description:
      "You subscribe to creators you love, but YouTube decides what you see. Your homepage is full of clickbait and rabbit holes instead of your actual subscriptions.",
  },
  {
    icon: "📋",
    title: "Playlist Chaos",
    description:
      "YouTube's playlists are buried, hard to organize, and impossible to use as your primary navigation. They feel like an afterthought.",
  },
  {
    icon: "📺",
    title: "Subscription Overload",
    description:
      "You're subscribed to 100+ channels, but have no way to group them, prioritize them, or see what matters most to you.",
  },
  {
    icon: "🌊",
    title: "Lost in the Feed",
    description:
      "Every video leads to 10 more suggestions. You came to watch one thing and left 2 hours later wondering what happened.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container px-6 sm:px-0">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-white">
            YouTube Wasn't Built for You
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

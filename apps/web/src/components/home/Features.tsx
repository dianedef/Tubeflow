import Image from "next/image";

const features = [
  {
    title: "Smart Organization",
    description:
      "Organize videos by theme, topic, or mood. Build your own learning paths, entertainment queues, or inspiration libraries.",
    benefitTag: "Find what you need in seconds",
    image: "/images/goodNews.png",
  },
  {
    title: "Subscription Dashboard",
    description:
      "A clean, organized view of all your subscriptions. Sort by upload frequency, last watched, or custom categories.",
    benefitTag: "Stay connected to what matters",
    image: "/images/cloudSync.png",
  },
  {
    title: "Distraction-Free Viewing",
    description:
      "No suggested videos pulling you away. No autoplay to random content. Just your curated playlists and intentional viewing.",
    benefitTag: "Reclaim your time and focus",
    image: "/images/googleCalander.png",
  },
  {
    title: "Intelligent Search",
    description:
      "Search across all your saved content, playlists, and subscriptions. Filter by duration, date, channel, or custom tags.",
    benefitTag: "Your content library, searchable",
    image: "/images/bot.png",
  },
  {
    title: "Cross-Device Sync",
    description:
      "Your playlists, watch history, and preferences sync seamlessly across all your devices. Pick up exactly where you left off.",
    benefitTag: "Watch anywhere, anytime",
    image: "/images/cloudSync.png",
  },
  {
    title: "Privacy-First",
    description:
      "We don't track your viewing habits for advertising. No data selling. No creepy recommendations. Just a tool that works for you.",
    benefitTag: "Watch with peace of mind",
    image: "/images/goodNews.png",
  },
];

const Features = () => {
  return (
    <section id="Features" className="relative pointer-events-none bg-black">
      <Image
        src={"/images/blue-circle.svg"}
        width={503}
        height={531}
        alt=""
        className="absolute hidden sm:block -left-40 -top-48 h-[531px]"
      />
      <div className="container py-16 sm:py-24 px-2 md:px-0">
        <p className="text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] text-center font-montserrat pb-2 sm:pb-[18px] text-gray-400">
          Features
        </p>
        <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-center pb-[46px] sm:pb-[87px] text-white">
          Everything You Need, Nothing You Don't
        </h3>

        <div className="relative">
          <div className="hidden sm:flex justify-between items-center absolute inset-0 -z-10">
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
                className="flex flex-col gap-4 bg-gray-900 border rounded-[17px] py-6 px-4 sm:py-8 sm:px-6 border-solid border-gray-800 shadow-xl hover:shadow-2xl transition-shadow"
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
                    <h4 className="text-[24px] sm:text-[36px] not-italic font-medium leading-[90.3%] tracking-[-0.9px] pb-3 sm:pb-4 font-montserrat text-white">
                      {feature.title}
                    </h4>
                    <p className="font-montserrat text-[15px] sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.4px] text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="ml-0 sm:ml-[104px]">
                  <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm sm:text-base font-medium">
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

import Image from "next/image";

const benefits = [
  {
    title: "Effortless Note-Taking",
    description: "Capture thoughts effortlessly with our intuitive interface",
    image: "/images/goodNews.png",
  },
  {
    title: "Seamless Sync",
    description:
      "Access your notes anytime, anywhere, with seamless cloud synchronization.",
    image: "/images/cloudSync.png",
  },
  {
    title: "Enhanced Productivity",
    description:
      "Let AI handle organization, so you can focus on what matters most.",
    image: "/images/googleCalander.png",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Gain valuable insights with smart analytics based on your note patterns.",
    image: "/images/bot.png",
  },
];

const Benefits = () => {
  return (
    <section id="Benefits" className="relative pointer-events-none bg-black">
      <Image
        src={"/images/blue-circle.svg"}
        width={503}
        height={531}
        alt=""
        className="absolute hidden sm:block -left-40 -top-48 h-[531px]"
      />
      <div className="container py-16 px-2 md:px-0">
        <p className="text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] text-center font-montserrat pb-2 sm:pb-[18px] text-gray-400">
          Benefits
        </p>
        <h3 className="text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-center pb-[46px] sm:pb-[87px] text-white">
          Why Choose UseNotes
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
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-2 sm:gap-7 bg-gray-900 items-center border rounded-[17px] py-4 px-2 sm:py-12 sm:px-6 border-solid border-gray-800 shadow-xl hover:shadow-2xl transition-shadow"
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
                  <h4 className="text-[24px] sm:text-[42px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] pb-2 sm:pb-6 font-montserrat text-white">
                    {benefit.title}
                  </h4>
                  <p className="font-montserrat pb-2 text-[17px] sm:text-3xl not-italic font-normal leading-[90.3%] tracking-[-0.75px] text-gray-300">
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

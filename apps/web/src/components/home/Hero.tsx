import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-transparent via-background via-[#d2e4f2] to-transparent bg-[length:261px_261px] bg-[image:linear-gradient(181deg,rgba(255,255,255,0)_57.92%,#fff_97.09%,rgba(255,255,255,0)_127.09%),url('/images/background.png')]">
      <div className="container py-16 sm:py-36 px-6 sm:px-0">
        <div className="flex sm:flex-wrap flex-nowrap justify-between items-center max-h-[690px] h-full">
          <div>
            <h2 className="font-montserrat pb-7 sm:pb-[26px] text-[44px] sm:text-[75px] not-italic font-medium leading-[111.3%] tracking-[-1.1px] sm:tracking-[-1.875px]">
              Stop Fighting YouTube's Algorithm. <br /> Start Enjoying Your Content.
            </h2>
            <p className="font-montserrat sm:pb-16 max-w-[680px] text-xl sm:text-3xl not-italic font-normal leading-[103.3%] tracking-[-0.5px] sm:tracking-[-0.75px] pb-11">
              TubeFlow gives you complete control over your YouTube experience. Organize videos into thematic playlists, manage subscriptions your way, and watch what you want—without algorithmic interference.
            </p>
            <Link href={"/notes"}>
              <Button
                variant="primary"
                className="gap-2.5 text-xl sm:text-3xl px-8 py-4"
              >
                Start Organizing for Free
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

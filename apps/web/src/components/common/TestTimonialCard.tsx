import Image from "next/image";
interface Props {
  data: {
    feature?: boolean;
    review: string;
    profile: string;
    name: string;
    designation: string;
  };
}

const TestTimonialCard = ({ data }: Props) => {
  return (
    <div
      className={`max-w-[370px] w-full space-y-8 h-auto shrink-0 rounded-[20px] border-[1.5px] border-solid px-[35px] pt-14 pb-20 transition-all hover:-translate-y-0.5 ${
        data.feature ? "bg-primary border-primary shadow-xl" : "bg-section-card border-section-card-border shadow-lg hover:shadow-xl"
      }`}
    >
      <div className="flex gap-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Image
              src="/images/star.svg"
              width={29}
              height={29}
              alt="star"
              key={index}
            />
          ))}
      </div>
      <blockquote
        className={`text-lg not-italic font-normal leading-[26px] font-montserrat ${
          data.feature ? "text-primary-foreground" : "text-section-foreground"
        }`}
      >
        <span className="text-lg">&ldquo;</span>
        {data.review}
        <span className="text-lg">&rdquo;</span>
      </blockquote>
      <div className="flex gap-7 items-center">
        <div className="w-[52px] h-[52px] shrink-0 border rounded-full flex items-center justify-center border-section-card-border">
          <Image
            className="rounded-[38px] w-[38px] h-[38px]"
            src={data.profile}
            width={38}
            height={38}
            alt="ryan"
          />
        </div>
        <div>
          <h3
            className={`text-xl not-italic font-medium leading-[normal] font-montserrat ${
              data.feature ? "text-primary-foreground" : "text-section-foreground"
            }`}
          >
            {data.name}
          </h3>
          <p
            className={`text-base not-italic font-medium leading-[normal] font-montserrat ${
              data.feature ? "text-primary-foreground" : "text-section-muted"
            }`}
          >
            {data.designation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestTimonialCard;

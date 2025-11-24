'use client';

import { LogIn, MapPin, Cat, LucideIcon } from "lucide-react";

interface Step {
  step: number;
  title: string;
  icon: LucideIcon;
  desc: string;
}

const STEPS: Step[] = [
  {
    step: 1,
    title: "Sign in with UTA email",
    icon: LogIn,
    desc: "Use your official UTA email to join the community.",
  },
  {
    step: 2,
    title: "Open Maps",
    icon: MapPin,
    desc: "Navigate to the interactive and amazing campus map.",
  },
  {
    step: 3,
    title: "See your favourite cat",
    icon: Cat,
    desc: "Find, follow, and view cat profiles. It is simple as that!",
  },
];

interface StepCardProps {
  step: Step;
}

function StepCard({ step }: StepCardProps) {
  const Icon = step.icon;

  return (
    <div className="w-80 mx-auto">
      <article className="
        relative bg-white backdrop-blur-md
        border-2 border-[#E2C3A7]/40 rounded-2xl
        p-7 shadow-[0_0_20px_rgba(226,195,167,0.25)]
        h-full transition-all duration-300
        hover:scale-105 hover:border-[#E2C3A7]
        hover:shadow-[0_0_30px_rgba(226,195,167,0.4)]
      ">
        {/* Step Number */}
        <div
          className="
            w-14 h-14 bg-[#E2C3A7] text-[#4E2A17]
            rounded-full flex items-center justify-center
            text-xl font-bold font-heading
            shadow-md mb-5
          "
          aria-label={`Step ${step.step}`}
        >
          {step.step}
        </div>

        {/* Title */}
        <h3 className="
          text-lg font-bold font-heading
          text-[#E2C3A7] mb-2 flex items-center gap-2
        ">
          <Icon className="w-5 h-5 text-[#4E2A17] flex-shrink-0" />
          <span>{step.title}</span>
        </h3>

        {/* Description */}
        <p className="
          text-sm font-body text-black
          leading-snug
        ">
          {step.desc}
        </p>
      </article>
    </div>
  );
}

export function HowToUse() {
  return (
    <section
      className="py-16 bg-[#847570] px-4 bg-gradient-to-b from-transparent to-white/5"
      aria-labelledby="how-to-use-heading"
    >
      <div className="max-w-[1100px] mx-auto">
        <header className="text-center mb-14">
          <h2
            id="how-to-use-heading"
            className="text-4xl sm:text-5xl font-bold font-heading !text-[#E2C3A7] mb-5 tracking-tight"
          >
            How to Use Meowvrick
          </h2>
          <div className="w-20 h-1 bg-[#E2C3A7] mx-auto rounded-full shadow-md" />
        </header>

        {/* DESKTOP: Tight Horizontal Flow */}
        <div className="hidden  md:flex items-center justify-center gap-6">
          {STEPS.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <StepCard  step={step} />
              {index < STEPS.length - 1 && (
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#E2C3A7] drop-shadow-sm mx-2"
                >
                  <path
                    d="M15 40H65M65 40L48 23M65 40L48 57"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* MOBILE: Tight Vertical Stack */}
        <div className="flex md:hidden flex-col items-center space-y-8">
          {STEPS.map((step, index) => (
            <div key={step.step} className="w-full max-w-xs">
              <StepCard step={step} />
              {index < STEPS.length - 1 && (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#E2C3A7] drop-shadow mx-auto mt-4"
                >
                  <path
                    d="M40 15V65M40 65L58 48M40 65L22 48"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
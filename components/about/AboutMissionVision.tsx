"use client";

import { motion } from "framer-motion";

type AboutMissionVisionProps = {
  missionTitle?: string;
  missionBody?: string;
  visionTitle?: string;
  visionBody?: string;
};

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const MotionDiv = motion.div as any;
const MotionSection = motion.section as any;

export function AboutMissionVision({
  missionTitle = "Our Mission",
  missionBody = "Make world-class education operations accessible to every institution, not just the largest ones. We design software that removes administrative drag so teams can spend more energy on teaching, outcomes, and growth.",
  visionTitle = "Our Vision",
  visionBody = "Create the most trusted operating layer for education in India and beyond. We want every institution to run with the same clarity, confidence, and continuity as the best-resourced campuses in the world.",
}: AboutMissionVisionProps) {
  return (
    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full overflow-hidden bg-[#022c22] py-20 lg:py-28"
    >
      {/* Background Subtle mesh/gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <MotionDiv variants={fadeIn} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-extrabold tracking-tight text-emerald-400 sm:text-5xl">
              Mission & Vision
            </h2>
          </MotionDiv>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Mission Card */}
          <MotionDiv
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-black/40 p-8 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-black/50 sm:p-10"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-white">{missionTitle}</h3>
            <p className="text-lg leading-relaxed text-emerald-100/80">
              {missionBody}
            </p>
          </MotionDiv>

          {/* Vision Card */}
          <MotionDiv
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-black/40 p-8 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-black/50 sm:p-10"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-white">{visionTitle}</h3>
            <p className="text-lg leading-relaxed text-emerald-100/80">
              {visionBody}
            </p>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
}

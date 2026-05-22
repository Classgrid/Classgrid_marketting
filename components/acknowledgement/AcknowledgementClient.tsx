"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Heart } from "lucide-react"

// Variants — kept lean for performance (no blur, short durations)
const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  })
}

const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
}

const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="text-center text-emerald-500/30 text-xl tracking-[0.5em] my-16 origin-center"
    >
      · · ·
    </motion.div>
  )
}

export default function AcknowledgementClient({ contributors, mentors, family }: any) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-[#0d0e12] text-[#0d0e12] dark:text-[#f5f2ec] relative overflow-hidden transition-colors duration-300">
      
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-60"
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")" }} 
      />

      {/* Radial ambient green glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] pointer-events-none z-0"
           style={{ background: "radial-gradient(ellipse, rgba(16, 185, 129, 0.07) 0%, transparent 70%)" }}
      />

      {/* Hero with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-40 pb-20 px-6 text-center overflow-hidden"
      >
        <motion.p 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="font-mono text-xs tracking-[0.25em] uppercase text-emerald-700 dark:text-emerald-500 mb-8"
        >
          — with gratitude —
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-[clamp(3.5rem,8vw,7rem)] font-light italic leading-[0.9] text-[#0d0e12] dark:text-[#f5f2ec] mb-12"
        >
          Acknowl<em className="not-italic text-emerald-600 dark:text-emerald-500">edg</em>ement
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          style={{ height: 80, transformOrigin: "top" }}
          className="w-[1px] mx-auto bg-gradient-to-b from-emerald-500 to-transparent"
        />
      </motion.section>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-40">
        
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="font-serif text-[clamp(1.2rem,2.5vw,1.6rem)] font-light text-[#8a8278] dark:text-[#b8b0a4] leading-relaxed text-center mb-24"
        >
          Classgrid would not have been possible without the support,
          guidance, and encouragement of many individuals.
        </motion.p>

        {/* Contributors */}
        {contributors?.length > 0 && (
          <div>
            {/* Section Header — slides in from left */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
              className="flex items-center gap-6 mb-10"
            >
              <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-emerald-600 dark:text-emerald-500 whitespace-nowrap">
                Those who stood with us
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="flex-1 h-[1px] bg-emerald-500/10 dark:bg-emerald-500/20 origin-left"
              />
            </motion.div>
            
            {/* Cards — staggered blur-fade-up */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {contributors.map((person: any, index: number) => (
                <motion.div 
                  key={person._id}
                  variants={fadeUpVariant}
                  custom={index}
                  className="group border border-emerald-500/20 dark:border-emerald-500/15 p-6 text-center relative transition-all duration-400 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-emerald-500/5 overflow-hidden"
                >
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
                  <div className="font-mono text-[0.6rem] text-[#8a8278] mb-4 tracking-[0.1em]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="font-serif text-xl font-normal text-[#0d0e12] dark:text-[#f5f2ec] leading-snug">
                    {person.name}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {contributors[0]?.message && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 font-sans text-sm text-zinc-700 dark:text-[#8a8278] leading-relaxed text-center"
              >
                {contributors[0]?.message}
              </motion.p>
            )}
          </div>
        )}

        {mentors?.length > 0 && <SectionDivider />}

        {/* Mentors */}
        {mentors?.length > 0 && (
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInRight}
              className="flex items-center gap-6 mb-10"
            >
              <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-emerald-600 dark:text-emerald-500 whitespace-nowrap">
                Academic guidance
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="flex-1 h-[1px] bg-emerald-500/10 dark:bg-emerald-500/20 origin-left"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleIn}
              className="border border-emerald-500/30 p-10 md:p-14 relative overflow-hidden transition-all duration-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-300" />
              
              {mentors.map((mentor: any, idx: number) => (
                <motion.div
                  key={mentor._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.3, duration: 0.7 }}
                  className={idx > 0 ? "mt-12 pt-12 border-t border-emerald-500/20" : ""}
                >
                  <p className="font-mono text-[0.65rem] tracking-[0.2em] text-emerald-700 dark:text-emerald-500 uppercase mb-4 font-semibold">
                    {mentor.role || 'mentor'}
                  </p>
                  <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-[#0d0e12] dark:text-[#f5f2ec] mb-2">
                    {mentor.name}
                  </h2>
                  <p className="font-sans text-sm text-[#8a8278] mb-8">
                    {mentor.role}
                  </p>
                  {mentor.message && (
                    <p className="font-serif text-lg md:text-xl italic text-[#6a6258] dark:text-[#c8c0b8] leading-[1.9]">
                      {mentor.message.split(mentor.name).map((part: string, i: number, arr: string[]) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="text-emerald-600 dark:text-emerald-400 not-italic font-medium">
                              {mentor.name}
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {family?.length > 0 && <SectionDivider />}

        {/* Family */}
        {family?.length > 0 && (
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={slideInLeft}
              className="flex items-center gap-6 mb-10"
            >
              <p className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-emerald-600 dark:text-emerald-500 whitespace-nowrap">
                Above all
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="flex-1 h-[1px] bg-emerald-500/10 dark:bg-emerald-500/20 origin-left"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleIn}
              className="text-center p-12 md:p-16 border border-emerald-500/20 dark:border-emerald-500/15 relative overflow-hidden shadow-sm"
            >
              <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-emerald-500/5 pointer-events-none" />
              
              {family.map((f: any, idx: number) => (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={idx > 0 ? "mt-12 pt-12 border-t border-emerald-500/20" : "relative z-10"}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 + 0.4, duration: 0.5, type: "spring" }}
                  >
                    <Heart className="w-6 h-6 mx-auto text-emerald-500 mb-6" />
                  </motion.div>
                  <p className="font-serif text-[clamp(1.3rem,3vw,1.9rem)] font-light italic text-[#0d0e12] dark:text-[#f5f2ec] leading-[1.7] max-w-2xl mx-auto">
                    "{f.message}"
                  </p>
                  <p className="mt-6 font-sans text-sm text-[#8a8278]">
                    — with love and respect —
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

      </main>
    </div>
  )
}

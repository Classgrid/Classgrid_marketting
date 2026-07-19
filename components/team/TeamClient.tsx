"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Github, Linkedin, Twitter, Globe, Users, Code, Headset, Briefcase, Facebook, Instagram } from "lucide-react"
import { SectionAccentBar } from "@/components/ui/section-accent-bar"

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.8, ease: "easeOut" }
  })
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const SocialIcon = ({ platform, url }: { platform: string, url: string }) => {
  const getIconData = () => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return { icon: <Linkedin className="w-5 h-5" />, color: 'text-[#0a66c2]' }
      case 'twitter': return { icon: <Twitter className="w-5 h-5" />, color: 'text-[#1DA1F2]' }
      case 'facebook': return { icon: <Facebook className="w-5 h-5" />, color: 'text-[#1877F2]' }
      case 'instagram': return { icon: <Instagram className="w-5 h-5" />, color: 'text-[#E1306C]' }
      case 'github': return { icon: <Github className="w-5 h-5" />, color: 'text-zinc-800 dark:text-white' }
      default: return { icon: <Globe className="w-5 h-5" />, color: 'text-emerald-500' }
    }
  }

  const data = getIconData()

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:shadow-sm hover:border-emerald-500/30 ${data.color}`}
    >
      {data.icon}
    </a>
  )
}

const TeamSection = ({ title, icon: Icon, members }: { title: string, icon: any, members: any[] }) => {
  if (!members || members.length === 0) return null

  return (
    // NOTE (Future): Changed from mb-32 to mb-16 because the team is small (5 people).
    // When the team grows to 20+ people (many per department), change this back to mb-32 
    // to give more breathing room between large groups.
    <div className="mb-16">
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 mb-6 ring-1 ring-emerald-500/20"
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <SectionAccentBar />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-4xl font-bold text-zinc-900 dark:text-white"
        >
          {title}
        </motion.h2>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-wrap justify-center gap-8 lg:gap-10"
      >
        {members.map((member) => (
          <motion.div
            key={member._id}
            variants={fadeUpVariant}
            className="w-full max-w-[320px] group relative bg-card border border-border rounded-[2.5rem] px-8 pt-12 pb-8 transition-all duration-300 ease-out hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] hover:border-emerald-500/50 hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Expanding Green Line — Pure CSS */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500/10" />
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-emerald-400 to-teal-500 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-20 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />

            {/* Ambient Background Glow — Pure CSS */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 to-transparent group-hover:from-emerald-500/[0.04] transition-all duration-500 pointer-events-none" />

            {/* Photo Section with Decorative Rings — Pure CSS */}
            <div className="relative w-40 h-40 mb-8 mt-2 flex items-center justify-center">
              {/* Ambient Glow behind photo */}
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/15 rounded-full blur-2xl transition-all duration-700 pointer-events-none" />
              
              {/* Spinning Dashed Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/0 group-hover:border-emerald-500/30 transition-all duration-500 pointer-events-none group-hover:animate-spin-slow" />

              {/* Pulsing Outer Ring */}
              <div className="absolute inset-[-4px] rounded-full border border-emerald-500/0 group-hover:border-emerald-500/30 group-hover:animate-pulse transition-all duration-500 pointer-events-none" />

              {/* Image Container */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl z-10 transition-all duration-300 group-hover:border-emerald-500 group-hover:scale-105">
                {member.imageUrl ? (
                  <Image 
                    src={member.imageUrl} 
                    alt={member.imageAlt}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Users className="w-12 h-12 text-zinc-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {member.name}
            </h3>
            
            {/* Expanding Signature Line — Pure CSS */}
            <div className="w-10 group-hover:w-20 h-[3px] bg-emerald-500 rounded-full mb-6 transition-all duration-500" />

            {/* Role — pill badge style */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 mb-6">
              {member.role}
            </span>
              
            {/* Social Links */}
            {member.socialLinks && member.socialLinks.length > 0 && (
              <div className="flex justify-center gap-3 mt-auto w-full">
                {member.socialLinks.map((social: any, i: number) => (
                  <SocialIcon key={i} platform={social.platform} url={social.url} />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function TeamClient({ leadership, engineering, sales, support }: any) {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-500/[0.08] rounded-[100%] blur-[120px] opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 ring-1 ring-emerald-500/20"
          >
            <Users className="w-4 h-4" />
            <span>The People Behind ClassGrid</span>
          </motion.div>
          <SectionAccentBar />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6"
          >
            Meet our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">innovators</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            We are a team of educators, engineers, and designers dedicated to transforming the way educational institutions manage their campus.
          </motion.p>
        </div>

        <TeamSection title="Leadership" icon={Briefcase} members={leadership} />
        <TeamSection title="Engineering & Product" icon={Code} members={engineering} />
        <TeamSection title="Sales & Marketing" icon={Globe} members={sales} />
        <TeamSection title="Support & Module Experts" icon={Headset} members={support} />
      </div>
    </div>
  )
}

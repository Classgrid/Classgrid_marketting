"use client";

import { motion } from "framer-motion";
import { MessagesSquare, Sparkles, BookOpen } from "lucide-react";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

export function CommunityClient() {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex-1">
        <section className="relative isolate overflow-hidden px-6 lg:px-8 py-16 sm:py-24">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
          
          {/* Right Glow */}
          <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 transform-gpu blur-3xl sm:translate-x-1/2" aria-hidden="true">
            <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#10b981] to-[#0ea5e9] opacity-20" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
          </div>

          {/* Left Glow */}
          <div className="absolute top-0 left-0 -z-10 -translate-x-1/3 -translate-y-1/4 transform-gpu blur-3xl sm:-translate-x-1/2" aria-hidden="true">
            <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#10b981] to-[#0ea5e9] opacity-20" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Currently Under Development
              </span>
            </motion.div>

            {/* Heading */}
            <SectionAccentBar />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              The <span className="text-emerald-500">ClassGrid</span> Forum
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              We are building a dedicated community forum where educators and administrators from schools, junior colleges, engineering institutes, and coaching centers can connect, share ideas, exchange best practices, and collaborate directly with the ClassGrid team.
            </motion.p>

            {/* Feature Cards */}
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
              
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50"
              >
                {/* Extremely light emerald hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-500 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <MessagesSquare className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-card-foreground transition-colors duration-300 group-hover:text-emerald-500">Public Discussions</h3>
                  <p className="text-sm text-muted-foreground">Participate in dedicated discussion categories, ask questions, and learn how other institutions manage academics, operations, and communication workflows.</p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-500 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Sparkles className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-card-foreground transition-colors duration-300 group-hover:text-emerald-500">Verified Member Badges</h3>
                  <p className="text-sm text-muted-foreground">Verified students, teachers, and administrators on the ClassGrid platform will receive member badges. Non-platform users will also be able to join, browse discussions, and participate in the wider ClassGrid Community.</p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-500 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <BookOpen className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-card-foreground transition-colors duration-300 group-hover:text-emerald-500">Share Feedback & Suggestions</h3>
                  <p className="text-sm text-muted-foreground">Report issues, request new features, and share suggestions directly with the ClassGrid team as we continue improving the platform.</p>
                </div>
              </motion.div>

            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-16 text-sm text-muted-foreground"
            >
              <strong className="text-foreground font-semibold tracking-wide">Launch Status:</strong> The forum will officially open once ClassGrid reaches 500 active users across 2–3 partner institutions.
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay, addMonths, subMonths } from "date-fns";
import { Clock, Video, Globe, User, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function TestToggle() {
  const [platform, setPlatform] = useState<"google_meet" | "zoom">("google_meet");

  // Calendar State
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [slideDir, setSlideDir] = useState(0);
  const [availableSlots, setAvailableSlots] = useState<string[]>(["11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm"]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Fake loading when date changes
  useEffect(() => {
    setIsLoadingSlots(true);
    setSelectedTime(null);
    const timer = setTimeout(() => {
      setIsLoadingSlots(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [date]);

  return (
    <main className="min-h-screen pt-12 pb-16 flex flex-col items-center justify-start px-4 bg-background">
      
      {/* Calendar Scheduler */}
      <div className="w-full max-w-[1000px] mx-auto mt-10">
        <div className="bg-black rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row text-card-foreground">

          {/* LEFT PANEL */}
          <div className="p-8 md:w-[320px] border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-[#111] flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="Classgrid Logo" width={24} height={24} className="w-6 h-6 object-contain" />
              </div>
              <p className="text-muted-foreground font-medium">Classgrid Platform</p>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-6">30 Min Meeting</h1>

            {/* Platform Toggle */}
            <div className="mb-8 w-full">
              <div className="flex items-center p-1 bg-zinc-900 rounded-xl w-full relative">
                <button
                  onClick={() => setPlatform("google_meet")}
                  className={`relative w-1/2 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors z-10 ${
                    platform === "google_meet" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {platform === "google_meet" && (
                    <motion.div
                      layoutId="ios-active"
                      className="absolute inset-0 bg-[#27272a] rounded-lg shadow-sm border border-white/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-20 flex items-center justify-center">
                    <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/Nikhil/Google_Meet_icon_(2026).svg" alt="Meet" className="w-5 h-5" />
                  </span>
                </button>
                
                <button
                  onClick={() => setPlatform("zoom")}
                  className={`relative w-1/2 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors z-10 ${
                    platform === "zoom" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {platform === "zoom" && (
                    <motion.div
                      layoutId="ios-active"
                      className="absolute inset-0 bg-[#27272a] rounded-lg shadow-sm border border-white/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-20 flex items-center justify-center">
                    <img 
                      src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/Nikhil/zoomus-icon.svg" 
                      alt="Zoom" 
                      className="w-5 h-5" 
                    />
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span>1-on-1 Session</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span>30m</span>
              </div>
              <div className="flex items-center gap-3 h-6">
                {platform === "google_meet" ? (
                  <>
                    <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/Nikhil/Google_Meet_icon_(2026).svg" alt="Google Meet" className="w-5 h-5" />
                    <span>Google Meet</span>
                  </>
                ) : (
                  <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/Nikhil/zoomus-ar21.svg" alt="Zoom" className="h-10 w-auto object-left object-contain -ml-1" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span>Asia/Kolkata</span>
              </div>
            </div>

            <p className="mt-8 text-xs text-muted-foreground leading-relaxed">
              Book a session to get a personalized walkthrough of the Classgrid platform.
            </p>
          </div>

          {/* MIDDLE PANEL */}
          <div className="p-8 md:flex-1 md:min-w-[420px] md:border-r border-zinc-800">
            <h2 className="text-lg font-semibold mb-6 text-center md:text-left text-foreground">
              Select a Date & Time
            </h2>
            <div className="w-full max-w-[420px] mx-auto md:mx-0">
              <div className="w-full select-none">
                <div className="flex items-center justify-between mb-6 px-2">
                  <button
                    onClick={() => {
                      setSlideDir(-1);
                      setCurrentMonth(subMonths(currentMonth, 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <div className="text-sm font-semibold text-foreground">
                    {format(currentMonth, "MMMM yyyy")}
                  </div>
                  <button
                    onClick={() => {
                      setSlideDir(1);
                      setCurrentMonth(addMonths(currentMonth, 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                    <div key={day} className="h-10 flex items-center justify-center text-[0.65rem] font-bold tracking-widest text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="relative overflow-hidden w-full h-[320px]">
                  <AnimatePresence mode="popLayout" initial={false} custom={slideDir}>
                    <motion.div
                      key={currentMonth.toISOString()}
                      custom={slideDir}
                      variants={{
                        enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="w-full absolute inset-0"
                    >
                      <div className="grid grid-cols-7 gap-1.5">
                        {Array(getDay(startOfMonth(currentMonth))).fill(null).map((_, i) => (
                          <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {eachDayOfInterval({
                          start: startOfMonth(currentMonth),
                          end: endOfMonth(currentMonth)
                        }).map((day) => {
                          const isToday = isSameDay(day, new Date());
                          const isPast = isBefore(day, startOfDay(new Date()));
                          const maxDate = startOfDay(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
                          const isTooFar = isBefore(maxDate, day);
                          const isDisabled = isPast || isTooFar;
                          const isSelected = date && isSameDay(day, date);

                          return (
                            <button
                              key={day.toISOString()}
                              onClick={() => !isDisabled && setDate(day)}
                              disabled={isDisabled}
                              className={`
                                  relative aspect-square w-full flex items-center justify-center text-base font-medium rounded-lg transition-all
                                  ${isDisabled ? "text-muted-foreground opacity-30 cursor-not-allowed bg-transparent" : "cursor-pointer text-foreground"}
                                  ${isSelected && !isDisabled ? "!bg-white !text-black shadow-md font-bold" : ""}
                                  ${!isSelected && !isDisabled ? "bg-zinc-800 hover:bg-zinc-700" : ""}
                                  ${isToday && !isSelected ? "border-2 border-white/70" : ""}
                                `}
                            >
                              {format(day, 'd')}
                              {isToday && !isSelected && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white/70" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          {date && (
            <div className="p-6 md:p-8 w-full md:w-[320px] bg-black/40 md:h-[500px] md:overflow-y-auto md:overscroll-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center md:text-left tracking-tight">
                {format(date, date.getFullYear() === new Date().getFullYear() ? "EEE dd" : "EEE dd, yyyy")}
              </h3>
              <div className="flex flex-col gap-2">
                {isLoadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner className="w-6 h-6 text-emerald-500" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 px-4 text-muted-foreground border rounded-lg bg-black/20 border-white/5">
                    <p className="text-sm font-medium">No time slots available today.</p>
                    <p className="text-xs mt-1">Please select tomorrow or a later date.</p>
                  </div>
                ) : (
                  availableSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return isSelected ? (
                      <div key={time} className="flex gap-2 w-full">
                        <div className="w-1/2 px-4 py-3 text-sm font-bold rounded-lg border bg-foreground text-background border-foreground shadow-sm flex items-center justify-center">
                          {time}
                        </div>
                        <Button
                          onClick={() => {
                            setIsConfirming(true);
                            setTimeout(() => setIsConfirming(false), 1000);
                          }}
                          disabled={isConfirming}
                          className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-lg shadow-sm"
                        >
                          {isConfirming ? <Spinner className="w-5 h-5 text-inherit" /> : "Confirm"}
                        </Button>
                      </div>
                    ) : (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className="w-full px-4 py-3 text-sm font-medium rounded-lg border border-border hover:border-foreground/50 bg-transparent text-foreground transition-all"
                      >
                        {time}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

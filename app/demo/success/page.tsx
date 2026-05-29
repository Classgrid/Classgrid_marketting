"use client";

import { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay, addMonths, subMonths } from "date-fns";
import { Clock, Video, Globe, CheckSquare, User, CheckCircle2, Edit2, Loader2, ArrowRight, ChevronLeftIcon, ChevronRightIcon, LayoutGrid, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useSearchParams, notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast, Toaster } from "sonner";



export default function DemoSuccessPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // OTP State
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    institutionName: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    orgType: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Calendar State
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [slideDir, setSlideDir] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showTalkPopup, setShowTalkPopup] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const thankYouRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showThankYou && thankYouRef.current) {
      setTimeout(() => {
        thankYouRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [showThankYou]);

  useEffect(() => {
    if (!requestId) return;
    fetchLead();
  }, [requestId]);

  useEffect(() => {
    if (isVerified) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isVerified]);

  useEffect(() => {
    if (!date) return;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(`/api/calendar/freebusy?date=${date.toISOString()}`);
        const data = await res.json();
        if (data.ok) {
          setAvailableSlots(data.availableSlots);
        } else {
          setAvailableSlots(["11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm"]);
        }
      } catch (err) {
        setAvailableSlots(["11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm"]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
    setSelectedTime(null);
  }, [date]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/request-demo/${requestId}`);
      const data = await res.json();
      
      if (!res.ok) {
        setLead(null);
        return;
      }
      
      if (data.lead) {
        setLead(data.lead);
        setEditForm({
          institutionName: data.lead.institutionName,
          adminName: data.lead.adminName,
          adminEmail: data.lead.adminEmail,
          adminPhone: data.lead.adminPhone,
          orgType: data.lead.orgType,
        });
        if (data.lead.isEmailVerified) {
          setIsVerified(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/request-demo/${requestId}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsVerified(true);
        toast.success("Email verified successfully!");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Failed to verify OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/request-demo/${requestId}/update-and-resend`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Details updated & OTP sent!");
        setLead({ ...lead, ...editForm });
        setIsEditing(false);
        setOtp("");
        setOtpSent(true);
        setCooldown(60);
      } else {
        toast.error(data.message || "Failed to update.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmMeeting = async () => {
    if (!date || !selectedTime) return;
    setIsConfirming(true);
    
    // Parse the selected time (e.g. "2:30pm")
    const timeRegex = /(\d+):(\d+)(am|pm)/i;
    const match = selectedTime.match(timeRegex);
    if (!match) return;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toLowerCase();

    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;

    const dateStr = format(date, "yyyy-MM-dd");
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const isoString = `${dateStr}T${hh}:${mm}:00+05:30`;

    try {
      const res = await fetch(`/api/request-demo/${requestId}/meeting-booked`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: new Date(isoString).toISOString(),
        }),
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success(`Booking Confirmed for ${format(date, "PPP")} at ${selectedTime}!`);
        // We could redirect to a final thank you page, or just clear the screen
        setLead({ ...lead, status: "demo_scheduled", meetingUrl: data.meetingUrl, scheduledAt: new Date(isoString).toISOString() } as any);
        setTimeout(() => {
          setShowTalkPopup(true);
        }, 2000);
      } else {
        toast.error(data.message || "Failed to schedule meeting.");
      }
    } catch (err: any) {
      toast.error("An error occurred while booking: " + err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  // Additional State
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (cooldown > 0) return;
    setIsSendingOtp(true);
    try {
      const res = await fetch(`/api/request-demo/${requestId}/update-and-resend`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead), // Just trigger resend with current lead details
      });
      const data = await res.json();
      if (data.ok) {
        setOtpSent(true);
        setCooldown(60); // Start 60-second cooldown
        toast.success("Verification code sent to your email!");
      } else {
        // Rate-limited: code was already sent — still show the input panel
        setOtpSent(true);
        setCooldown(60);
        toast.error(data.message || "A code was already sent. Please check your email.");
      }
    } catch (err) {
      toast.error("Failed to send code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground flex-col">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-muted-foreground animate-pulse text-sm">Verifying secure session...</p>
      </main>
    );
  }

  if (!lead) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-12 pb-16 flex flex-col items-center justify-start px-4 bg-background">
      
      {!isVerified ? (
        /* OTP COVER PAGE */
        <div className="w-full max-w-lg bg-black rounded-2xl border border-white/10 shadow-xl overflow-hidden p-8 text-card-foreground">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your demo request is confirmed!</h1>
            <p className="text-sm text-muted-foreground">
              Verify your email to access the calendar and schedule your meeting with our team.
            </p>
          </div>

          {/* Details Section */}
          <div className="bg-muted/30 rounded-xl p-6 mb-8 border relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground text-lg">Your Details</h3>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-muted-foreground hover:text-foreground bg-background/50 border shadow-sm transition-all duration-150 hover:scale-105 active:scale-95"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm transition-all duration-150 hover:scale-105 active:scale-95 hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                  >
                    {isSavingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                  </Button>
                </div>
              ) : !otpSent ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground bg-background/50 border shadow-sm transition-all duration-150 hover:scale-105 active:scale-95"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                </Button>
              ) : null}
            </div>
            
            {!isEditing ? (
              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1 font-semibold">Email Address</span>
                  <span className="font-medium text-foreground break-all text-base">{lead.adminEmail}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1 font-semibold">Full Name</span>
                  <span className="font-medium text-foreground text-base">{lead.adminName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1 font-semibold">Institution</span>
                  <span className="font-medium text-foreground text-base">{lead.institutionName}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1 font-semibold">Organization Type</span>
                    <span className="font-medium text-foreground text-base capitalize">
                      {lead.orgType === "engineering" && "Engineering College"}
                      {lead.orgType === "school" && "School"}
                      {lead.orgType === "junior_college" && "Junior College"}
                      {lead.orgType === "coaching" && "Coaching Institute"}
                      {lead.orgType === "diploma" && "Diploma Institute"}
                      {lead.orgType === "tutor" && "Private Tutor"}
                      {lead.orgType === "other" && "Other"}
                      {!["engineering", "school", "junior_college", "coaching", "diploma", "tutor", "other"].includes(lead.orgType) && lead.orgType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  {lead.adminPhone && (
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1 font-semibold">Phone Number</span>
                      <span className="font-medium text-foreground text-base">{lead.adminPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Email Address</Label>
                  <Input 
                    value={editForm.adminEmail} 
                    onChange={e => setEditForm({...editForm, adminEmail: e.target.value})}
                    className="bg-background border-border h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Full Name</Label>
                  <Input 
                    value={editForm.adminName} 
                    onChange={e => setEditForm({...editForm, adminName: e.target.value})}
                    className="bg-background border-border h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Institution</Label>
                  <Input 
                    value={editForm.institutionName} 
                    onChange={e => setEditForm({...editForm, institutionName: e.target.value})}
                    className="bg-background border-border h-10 w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Organization Type</Label>
                    <select
                      value={editForm.orgType}
                      onChange={e => setEditForm({...editForm, orgType: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="engineering">Engineering College</option>
                      <option value="school">School</option>
                      <option value="junior_college">Junior College</option>
                      <option value="coaching">Coaching Institute</option>
                      <option value="diploma">Diploma Institute</option>
                      <option value="tutor">Private Tutor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Phone Number</Label>
                    <Input 
                      value={editForm.adminPhone || ""} 
                      onChange={e => setEditForm({...editForm, adminPhone: e.target.value})}
                      className="bg-background border-border h-10 w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OTP Actions Section */}
          {!isEditing && (
            <div className="flex flex-col items-center">
              {!otpSent ? (
                <Button 
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || cooldown > 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:shadow-none"
                >
                  {isSendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : cooldown > 0 ? `Resend available in ${cooldown}s` : "Send Verification Code"}
                </Button>
              ) : (
                <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Enter the 6-digit code sent to <br/><strong className="text-foreground">{lead.adminEmail}</strong>
                  </p>
                  <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val.replace(/\D/g, ""))} className="gap-1 sm:gap-2" inputMode="numeric" pattern="[0-9]*">
                    <InputOTPGroup className="gap-1 sm:gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot key={index} index={index} className="w-10 h-12 sm:w-12 sm:h-14 bg-background border-border text-foreground text-lg sm:text-xl font-bold rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <Button 
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:shadow-none disabled:hover:shadow-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">Verify Email <ArrowRight className="w-5 h-5" /></span>
                    )}
                  </Button>
                  
                  <button 
                    onClick={handleSendOtp} 
                    disabled={cooldown > 0 || isSendingOtp}
                    className="mt-5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 disabled:hover:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : cooldown > 0 ? (
                      `Didn't receive code? Resend in ${cooldown}s`
                    ) : (
                      "Didn't receive code? Resend"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* CALENDAR SCHEDULER (Unlocked after Verification) */
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="bg-black rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row text-card-foreground animate-in fade-in zoom-in duration-500">
            
            {/* LEFT PANEL */}
            <div className="p-8 md:w-[320px] border-b md:border-b-0 md:border-r border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-[#111] flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="Classgrid Logo" width={24} height={24} className="w-6 h-6 object-contain" />
                </div>
                <p className="text-muted-foreground font-medium">Classgrid Platform</p>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-6">30 Min Meeting</h1>

              <div className="space-y-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <span>1-on-1 Session</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>30m</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://fiherpwzabiftbkwuqsb.supabase.co/storage/v1/object/public/notes-files/69a1616fc010102d9efa52e9/svgviewer-output.svg" alt="Google Meet" className="w-5 h-5" />
                  <span>Google Meet</span>
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
                {/* Custom Cal.com Style Calendar */}
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
                            const isSelected = date && isSameDay(day, date);

                            return (
                              <button
                                key={day.toISOString()}
                                onClick={() => !isPast && setDate(day)}
                                disabled={isPast}
                                className={`
                                  relative aspect-square w-full flex items-center justify-center text-base font-medium rounded-lg transition-all
                                  ${isPast ? "text-muted-foreground opacity-30 cursor-not-allowed bg-transparent" : "cursor-pointer text-foreground"}
                                  ${isSelected && !isPast ? "!bg-white !text-black shadow-md font-bold" : ""}
                                  ${!isSelected && !isPast ? "bg-zinc-800 hover:bg-zinc-700" : ""}
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
              <div className="p-6 md:p-8 w-full md:w-[320px] bg-black/40 md:h-[500px] md:overflow-y-auto md:overscroll-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in slide-in-from-right-8 duration-300 relative">
                {lead.status === "demo_scheduled" ? (
                  <div className="flex flex-col h-full text-left animate-in fade-in zoom-in duration-500">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Meeting Scheduled!</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Your meeting is confirmed. A Classgrid team member will join you on Google Meet at the selected time.
                    </p>
                    
                    <div className="bg-background border rounded-lg p-4 space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Date & Time</p>
                        <p className="text-sm font-medium text-foreground">
                          {lead.scheduledAt ? (() => {
                            const d = new Date(lead.scheduledAt);
                            const isCurrentYear = d.getFullYear() === new Date().getFullYear();
                            return format(d, isCurrentYear ? "EEEE, MMMM d 'at' h:mm a" : "EEEE, MMMM d, yyyy 'at' h:mm a");
                          })() : "Loading..."}
                        </p>
                      </div>
                      
                      {lead.meetingUrl && (
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Google Meet Link</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Input readOnly value={lead.meetingUrl} className="h-9 text-xs bg-muted/50 border-border" />
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-9 px-3 border-border hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                navigator.clipboard.writeText(lead.meetingUrl!);
                                toast.success("Meeting URL copied!");
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <a href="/" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 rotate-180" /> Return Home
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-foreground mb-6 text-center md:text-left tracking-tight">
                      {format(date, date.getFullYear() === new Date().getFullYear() ? "EEE dd" : "EEE dd, yyyy")}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {isLoadingSlots ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
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
                                onClick={handleConfirmMeeting}
                                disabled={isConfirming}
                                className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-lg shadow-sm animate-in slide-in-from-right-4 duration-200"
                              >
                                {isConfirming ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Thank You Section — appears after Classgrid Talk popup is closed */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            ref={thankYouRef}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
            className="w-full max-w-[500px] mx-auto mt-10 mb-6 px-4 sm:px-0"
          >
            <div className="relative text-center py-10 px-8 rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden">
              {/* Subtle top glow line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 }}
                className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-xl font-bold text-white mb-2 tracking-tight"
              >
                Thank You! 😊
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-sm text-zinc-400 font-medium mb-1"
              >
                for Showing Interest.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-sm text-zinc-500"
              >
                Our representative will call you soon.
              </motion.p>

              {/* Subtle ambient glow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-20 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />

      {/* Classgrid Talk Popup Modal */}
      <AnimatePresence>
        {showTalkPopup && (
          <motion.div
            key="talk-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              key="talk-card"
              initial={{ y: 80, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 320, mass: 0.85 }}
              className="relative w-full sm:max-w-md overflow-hidden bg-[#0d0d0d] border border-zinc-800/80 rounded-t-3xl sm:rounded-2xl shadow-[0_-8px_40px_rgba(16,185,129,0.08),0_30px_80px_rgba(0,0,0,0.8)]"
            >
              {/* Thin emerald line at top */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              {/* Ambient glow blob */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

              {/* Close */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                onClick={() => { setShowTalkPopup(false); setShowThankYou(true); }}
                className="absolute top-4 right-4 p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors rounded-full hover:bg-white/5 z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Mobile drag indicator */}
              <div className="sm:hidden flex justify-center pt-3 pb-0">
                <div className="w-9 h-1 rounded-full bg-zinc-700" />
              </div>

              <div className="p-6 sm:p-8">
                {/* Icon row with pulse + badge */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 280 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <div className="relative flex-shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.12, 0.35] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-xl bg-emerald-500/30 blur-lg"
                    />
                    <div className="relative w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 }}
                    className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full"
                  >
                    Inquiry Portal
                  </motion.span>
                </motion.div>

                {/* Heading */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 280 }}
                  className="text-[22px] font-bold text-white mb-2 tracking-tight leading-snug"
                >
                  Classgrid Talk
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, type: "spring", stiffness: 280 }}
                  className="text-sm text-zinc-400 mb-5 leading-relaxed"
                >
                  Have questions before our meeting? Submit an inquiry and chat directly with a product specialist — get answers tailored to your institution&apos;s needs, <span className="text-zinc-200 font-medium">right now</span>.
                </motion.p>

                {/* Feature tags */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {["Direct inquiry", "Expert response", "Within 24h"].map((tag) => (
                    <span key={tag} className="text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 font-medium">
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col gap-2.5"
                >
                  <a
                    href="/support/inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-xl text-center transition-all overflow-hidden group shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.55)]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Submit an Inquiry
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
                  </a>
                  <button
                    onClick={() => { setShowTalkPopup(false); setShowThankYou(true); }}
                    className="w-full py-3 px-4 text-zinc-500 hover:text-zinc-300 text-sm font-medium rounded-xl text-center transition-colors hover:bg-white/5"
                  >
                    Maybe Later
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

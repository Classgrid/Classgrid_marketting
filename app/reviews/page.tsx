"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, CheckCircle2, MessageSquareQuote, 
  Send, Sparkles, ArrowRight, Users 
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Marquee from "react-fast-marquee";
import Masonry from "react-masonry-css";
import { fetchReviewsData } from "./actions";
import { Button } from "@/components/ui/button";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

const MotionDiv = motion.div as any;

// Define the Review Type
type Review = {
  _id: string;
  name: string;
  institution: string;
  photoUrl?: string;
  reviewText: string;
  suggestion?: string;
  rating: number;
  status: string;
  adminReply?: string;
  category?: string;
  moduleName?: string;
  positives?: string[];
  negatives?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  _createdAt: string;
};

const CATEGORIES = ["All", "5★", "4★", "3★ & below"];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    reviewText: "",
    suggestion: "",
    rating: 0,
    moduleName: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchReviews = async () => {
    setRefreshing(true);
    try {
      const data = await fetchReviewsData();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "All") return reviews;
    if (activeFilter === "5★") return reviews.filter(r => r.rating === 5);
    if (activeFilter === "4★") return reviews.filter(r => r.rating === 4);
    if (activeFilter === "3★ & below") return reviews.filter(r => r.rating <= 3);
    return reviews;
  }, [reviews, activeFilter]);

  const featuredReviews = useMemo(() => {
    return reviews.filter(r => r.isFeatured).slice(0, 6);
  }, [reviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
      : "4.9";
    return {
      total: total,
      average: avg,
      verified: reviews.filter(r => r.isVerified).length > 0 ? "100%" : "0%"
    };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.institution || !formData.reviewText || formData.rating === 0 || !formData.moduleName) {
      setFormStatus("error");
      setErrorMessage("Please fill all required fields, select a module, and give a star rating.");
      return;
    }

    setSubmitting(true);
    setFormStatus("idle");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit review.");

      setFormStatus("success");
      setFormData({ name: "", email: "", institution: "", reviewText: "", suggestion: "", rating: 0, moduleName: "" });
      setHoveredStar(0);
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error: any) {
      setFormStatus("error");
      setErrorMessage(error.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const masonryBreakpoints = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-24 pb-24 overflow-hidden selection:bg-emerald-500/30 transition-colors duration-300">
      
      {/* ── LAYER 1: MARQUEE STRIP (TOP) ── */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full border-y border-border bg-card/10 py-4 mb-12"
      >
        <Marquee pauseOnHover speed={45} gradient={false} className="dark:!bg-transparent !bg-transparent">
          {featuredReviews.map((rev) => {
            const palette = ['bg-emerald-500', 'bg-teal-500', 'bg-emerald-600', 'bg-teal-600', 'bg-emerald-400'];
            const colorClass = palette[rev.name.charCodeAt(0) % palette.length];
            return (
            <div key={rev._id} className="flex items-center gap-6 px-12 border-r border-white/[0.05]">
              {rev.photoUrl ? (
                <img src={rev.photoUrl} alt={rev.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-border" />
              ) : (
                <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {rev.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-emerald-400 text-emerald-400" : "text-neutral-800"}`} />
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground italic max-w-xs truncate">
                "{rev.reviewText}"
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-foreground">{rev.name}</span>
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-tighter">{rev.institution}</span>
              </div>
            </div>
            );
          })}
        </Marquee>
      </MotionDiv>

      {/* ── LAYER 2: STATS BAR ── */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 py-10 bg-card/50 dark:bg-white/[0.02] border border-border rounded-3xl backdrop-blur-sm shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 mb-1">
              <MessageSquareQuote className="w-5 h-5" />
              <span className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground">{stats.total}</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Reviews</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-border/50" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 mb-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground">{stats.average}/5</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Average Rating</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-border/50" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground">{stats.verified}</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified Users</span>
          </div>
        </div>
      </section>

      {/* ── LAYER 3: SHARE YOUR STORY (UPSIDE SECTION) ── */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <MotionDiv 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center bg-card dark:bg-[#171717] border border-border dark:border-white/[0.05] rounded-[2.5rem] p-8 md:p-10 lg:p-14 shadow-2xl dark:shadow-black/50 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -z-10 rounded-full" />
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Join the community
            </div>
            <SectionAccentBar align="left" className="mb-0" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
              Share Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500">Classgrid Story</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Your feedback fuels our innovation. Help us shape the future of institutional management by sharing your experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-background/50 dark:bg-black/40 p-8 md:p-10 lg:px-12 rounded-[2rem] border border-border dark:border-white/[0.05] backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text" required placeholder="Full Name"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-14 bg-background border border-border rounded-xl px-5 text-sm focus:border-emerald-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground"
              />
              <input
                type="text" required placeholder="Institution / College"
                value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full h-14 bg-background border border-border rounded-xl px-5 text-sm focus:border-emerald-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <input
              type="email" required placeholder="Email Address"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-14 bg-background border border-border rounded-xl px-5 text-sm focus:border-emerald-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-background rounded-xl px-4 h-14 border border-border flex items-center">
                <div className="flex gap-2 justify-center w-full">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star} type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none group"
                    >
                      <Star className={`w-6 h-6 transition-all ${star <= (hoveredStar || formData.rating) ? "fill-emerald-500 dark:fill-emerald-400 text-emerald-500 dark:text-emerald-400 scale-110" : "text-muted/20 dark:text-neutral-800 scale-100"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <select
                  value={formData.moduleName}
                  onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                  className={`w-full h-14 bg-background border border-border rounded-xl px-5 text-sm focus:border-emerald-500/50 transition-all outline-none appearance-none ${!formData.moduleName ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  <option value="" disabled hidden>Which module did you like most?</option>
                  <optgroup label="Academic">
                    <option value="Attendance">Attendance System</option>
                    <option value="Digital Classroom">Digital Classroom</option>
                    <option value="Timetable">Automated Timetable</option>
                    <option value="Academic Planning">Academic Planning Tools</option>
                    <option value="Homework">Homework & Assignments</option>
                    <option value="Notes Sharing">Student Notes Sharing</option>
                    <option value="Teacher Planner">Teacher Planner</option>
                    <option value="Subject Management">Subject Management</option>
                    <option value="Course Management">Course Management</option>
                  </optgroup>
                  <optgroup label="Assessment">
                    <option value="Online Exams">Online Exam Platform</option>
                    <option value="Exam Management">Examination Management</option>
                    <option value="Quiz Systems">Interactive Quiz Systems</option>
                    <option value="Results & Grades">Grade Entry & Results</option>
                    <option value="Internal Assessment">Internal Assessment Tools</option>
                    <option value="CET/JEE/NEET">CET/JEE/NEET Exam Conduction</option>
                    <option value="Mock Tests">Past Paper & Mock Tests</option>
                    <option value="AI Viva">AI-Powered Viva</option>
                    <option value="Test Series">Test Series Management</option>
                  </optgroup>
                  <optgroup label="Management">
                    <option value="Admissions">Admission Management</option>
                    <option value="Fees">Fee Collection System</option>
                    <option value="Leave & Payroll">Staff Leave & Payroll</option>
                    <option value="Canteen">Canteen Management</option>
                    <option value="Library">Digital Library</option>
                    <option value="Alumni">Alumni Network</option>
                  </optgroup>
                  <optgroup label="Advanced">
                    <option value="AI Assistant">AI Assistant</option>
                    <option value="Analytics">Advanced Analytics</option>
                    <option value="Compliance">Compliance & Audit Trails</option>
                    <option value="Certificates">Digital Certificates</option>
                    <option value="Holidays">Holiday Management</option>
                    <option value="ID Cards">Digital ID Cards</option>
                    <option value="Events">Events Management</option>
                    <option value="Feedback">Feedback System</option>
                    <option value="Website Builder">Institution Website</option>
                  </optgroup>
                </select>
            </div>

            <textarea
              required maxLength={2000} placeholder="How did Classgrid help your daily workflow?"
              value={formData.reviewText} onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm min-h-[140px] resize-none focus:border-emerald-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground"
            />

            <textarea
              maxLength={1000} placeholder="Any suggestions for us? (Optional)"
              value={formData.suggestion} onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm min-h-[100px] resize-none focus:border-emerald-500/50 transition-all outline-none text-foreground placeholder:text-muted-foreground"
            />

            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full h-14 font-bold relative text-base"
            >
              {submitting ? <><Spinner className="w-5 h-5 text-inherit mr-2" /> Submitting...</> : <>Submit Feedback <ArrowRight className="w-5 h-5 ml-2" /></>}
            </Button>

            {formStatus === "success" && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>Submitted to Classgrid team! We will reply to you and publish in the feed.</p>
              </div>
            )}
          </form>
        </MotionDiv>
      </section>

      {/* ── LAYER 4: COMMUNITY FEED (MASONRY GRID) ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-1 text-foreground">What Institutions Say</h3>
            <p className="text-muted-foreground text-sm font-medium">Verified feedback from students, faculty, and admins across India.</p>
          </div>

          {/* Star Filter Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-card border border-border rounded-full overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="relative px-5 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap"
              >
                <span className={`relative z-10 ${activeFilter === cat ? "text-emerald-950 dark:text-black" : "text-muted-foreground"}`}>
                  {cat}
                </span>
                {activeFilter === cat && (
                  <MotionDiv
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-emerald-400 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Spinner className="w-10 h-10 text-emerald-500/50" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-border rounded-[2.5rem] bg-card/20">
            <MessageSquareQuote className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-foreground/80 font-bold text-xl uppercase tracking-tighter">No feedback.</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-medium">
              Be the first one to become part of Classgrid community. Real-time feedback from the Classgrid ecosystem.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <Masonry breakpointCols={masonryBreakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
              {filteredReviews.map((rev, index) => (
                <MotionDiv
                  key={rev._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                >
                <MotionDiv 
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="group p-8 rounded-[2rem] bg-card dark:bg-[#171717] border border-border dark:border-white/[0.05] hover:border-emerald-500/40 transition-all shadow-xl dark:shadow-2xl relative overflow-hidden"
                  >
                    {/* Header: Avatar, Name, Stats */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        {/* System-color Avatar (Emerald/Teal variants only) */}
                        {rev.photoUrl ? (
                          <img src={rev.photoUrl} alt={rev.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-lg rotate-2 group-hover:rotate-0 transition-transform border border-border" />
                        ) : (() => {
                          const palette = ['bg-emerald-500', 'bg-teal-500', 'bg-emerald-600', 'bg-teal-600', 'bg-emerald-400'];
                          const colorClass = palette[rev.name.charCodeAt(0) % palette.length];
                          return (
                            <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg rotate-2 group-hover:rotate-0 transition-transform`}>
                              {rev.name.charAt(0).toUpperCase()}
                            </div>
                          );
                        })()}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-foreground truncate">{rev.name}</h4>
                            {rev.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground font-bold truncate tracking-tight">{rev.institution}</p>
                        </div>
                      </div>
                      <div className="flex bg-muted/30 dark:bg-black/40 px-3 py-1.5 rounded-full border border-border dark:border-white/[0.03] gap-1 shrink-0 shadow-inner">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-emerald-500 dark:fill-emerald-400 text-emerald-500 dark:text-emerald-400" : "text-muted/20 dark:text-neutral-800"}`} />
                        ))}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-6">
                      <p className="text-[15px] text-muted-foreground dark:text-neutral-300 leading-relaxed font-medium">"{rev.reviewText}"</p>
                      
                      {/* Tags (System Colors) */}
                      {(rev.positives?.length || rev.moduleName) && (
                        <div className="flex flex-wrap gap-2 pt-4">
                          {rev.moduleName && rev.moduleName !== 'Overall' && (
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase">{rev.moduleName}</span>
                          )}
                          {rev.positives?.map((p, i) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-muted/30 dark:bg-white/[0.03] border border-border dark:border-white/5 text-muted-foreground dark:text-neutral-400 text-[10px] font-bold tracking-wider uppercase">{p}</span>
                          ))}
                        </div>
                      )}

                      {/* Optional Suggestion Box */}
                      {rev.suggestion && (
                        <div className="bg-muted/10 dark:bg-white/[0.02] border border-border dark:border-white/[0.03] rounded-2xl p-5 shadow-inner">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block mb-3 opacity-60">Improvement Insight</span>
                          <p className="text-xs text-muted-foreground italic leading-relaxed">{rev.suggestion}</p>
                        </div>
                      )}

                      {/* Admin Reply with Logo */}
                      {rev.adminReply && (
                        <div className="pt-6 border-t border-border dark:border-white/[0.05]">
                          <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                              <img src="/logo.png" alt="CG" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">Team Response</span>
                              <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed bg-muted/30 dark:bg-black/40 p-4 rounded-2xl rounded-tl-none border border-border dark:border-white/[0.03] shadow-inner">
                                {rev.adminReply}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </MotionDiv>
                </MotionDiv>
              ))}
            </Masonry>
          </AnimatePresence>
        )}
      </section>

      {/* Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-emerald-500/[0.03] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-600/[0.02] blur-[150px] rounded-full" />
      </div>

    </main>
  );
}

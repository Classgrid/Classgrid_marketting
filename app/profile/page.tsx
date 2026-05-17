"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, LogOut, Building2, CalendarDays, BadgeCheck, User } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#888] animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as any;
  const isPlatformUser = user.isPlatformUser === true;
  const joinedDate = user.forumCreatedAt
    ? new Date(user.forumCreatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0f0f0f] dark:text-white flex flex-col relative">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Classgrid" className="w-6 h-6 object-contain" />
          <span className="font-bold text-lg tracking-wide uppercase">CLASSGRID</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-900 active:scale-[0.98] dark:border-[#2a2a2a] dark:text-[#888888] dark:hover:border-[#444] dark:hover:text-[#f1f1f1]"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">

          {isPlatformUser ? (
            /* ── PLATFORM MEMBER VIEW ── */
            <div className="space-y-6">
              <div className="text-center space-y-1 mb-8">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Platform Member
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-[#f1f1f1]">Your Account</h1>
              </div>

              {/* Profile card */}
              <div className="rounded-xl border border-slate-200 bg-[#fafafa] p-6 space-y-5 dark:border-[#2a2a2a] dark:bg-[#161616]">

                {/* Avatar + name row */}
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={56}
                      height={56}
                      className="rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-emerald-900/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                      {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-[#f1f1f1]">{user.name || "User"}</p>
                    <p className="text-sm text-slate-500 dark:text-[#888888]">{user.email}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-[#2a2a2a]" />

                {/* Details */}
                <div className="space-y-3">
                  {user.orgName && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-slate-400 dark:text-[#666]" />
                      <span className="text-slate-500 dark:text-[#888888]">Organisation</span>
                      <span className="ml-auto font-medium text-slate-900 dark:text-[#f1f1f1]">{user.orgName}</span>
                    </div>
                  )}
                  {user.platformRole && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-slate-400 dark:text-[#666]" />
                      <span className="text-slate-500 dark:text-[#888888]">Role</span>
                      <span className="ml-auto font-medium capitalize text-slate-900 dark:text-[#f1f1f1]">{user.platformRole}</span>
                    </div>
                  )}
                  {joinedDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <CalendarDays className="w-4 h-4 text-slate-400 dark:text-[#666]" />
                      <span className="text-slate-500 dark:text-[#888888]">Joined</span>
                      <span className="ml-auto font-medium text-slate-900 dark:text-[#f1f1f1]">{joinedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── COMMUNITY (NEW) USER VIEW ── */
            <div className="space-y-6">
              <div className="text-center space-y-1 mb-8">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-[#f1f1f1]">Welcome!</h1>
                <p className="text-sm text-slate-500 dark:text-[#888888]">You're signed in to the Classgrid community</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-[#fafafa] p-6 dark:border-[#2a2a2a] dark:bg-[#161616]">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-xl font-bold text-slate-900 dark:border-[#444] dark:bg-[#2a2a2a] dark:text-[#f1f1f1]">
                      {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-[#f1f1f1]">{user.name || "Community Member"}</p>
                    <p className="text-sm text-slate-500 dark:text-[#888888]">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-600 dark:border-[#1a3a1a] dark:bg-[#0a1a0a] dark:text-[#888888]">
                <p>Want full access? <a href="https://classgrid.in" className="text-emerald-400 hover:underline">Join Classgrid as an institution →</a></p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

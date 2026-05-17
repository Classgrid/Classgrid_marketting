"use client";
import React from "react";

export default function BentoGrid() {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-[1.4fr_1fr]">
      <div className="flex min-h-[220px] flex-col justify-center rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="m-0 text-xl font-semibold">Chat</h3>
        <p className="text-muted-foreground">Seamless messaging across staff, students and guardians.</p>
      </div>
      <div className="grid gap-4">
        <div className="min-h-[100px] rounded-xl border border-border bg-card p-4 shadow-sm">
          <h4 className="m-0 text-lg font-semibold">Timetable</h4>
          <p className="text-muted-foreground">Conflict-free scheduling that scales.</p>
        </div>
        <div className="min-h-[100px] rounded-xl border border-border bg-card p-4 shadow-sm">
          <h4 className="m-0 text-lg font-semibold">Exams</h4>
          <p className="text-muted-foreground">Auto-marking, reports and grades at your fingertips.</p>
        </div>
      </div>
    </div>
  );
}

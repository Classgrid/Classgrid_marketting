"use client"
import React from "react"
import FeatureCard from "@/components/FeatureCard"

export default function BentoGrid() {
  const features = [
    { title: "Chat", desc: "Real-time messaging for students and teachers." },
    { title: "Timetable", desc: "Auto-generated timetables with conflict checks." },
    { title: "Exams", desc: "Create papers, mark answers, and publish results." },
  ]

  return (
    <div className="grid auto-rows-[minmax(120px,_auto)] grid-cols-1 gap-3 md:grid-cols-6">
      <FeatureCard className="md:col-span-3 md:row-span-2" title={features[0].title} desc={features[0].desc} />
      <FeatureCard className="md:col-span-2" title={features[1].title} desc={features[1].desc} />
      <FeatureCard className="md:col-span-1" title={features[2].title} desc={features[2].desc} />
    </div>
  )
}

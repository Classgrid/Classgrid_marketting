"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  featureCategoryLabels,
  moduleCatalog,
  type FeatureCategoryKey,
} from "@/content/siteContent";
import { Reveal } from "@/components/sections/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryOrder: FeatureCategoryKey[] = [
  "academics",
  "assessments",
  "communication",
  "finance",
  "admissions",
  "operations",
  "ai",
  "integration",
];

export function FeaturesExperience() {
  const [openModuleId, setOpenModuleId] = useState<number>(1);

  const grouped = useMemo(() => {
    return categoryOrder.reduce<Record<FeatureCategoryKey, typeof moduleCatalog>>(
      (acc, category) => {
        acc[category] = moduleCatalog.filter((module) => module.category === category);
        return acc;
      },
      {
        academics: [],
        assessments: [],
        communication: [],
        finance: [],
        admissions: [],
        operations: [],
        ai: [],
        integration: [],
      }
    );
  }, []);

  return (
    <Tabs defaultValue={categoryOrder[0]} className="gap-6">
      <TabsList className="h-auto w-full flex-wrap gap-2 rounded-xl bg-slate-900/50 p-2">
        {categoryOrder.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="rounded-md px-3 py-2 text-xs text-slate-200 data-active:bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] data-active:text-white sm:text-sm"
          >
            {featureCategoryLabels[category]}
          </TabsTrigger>
        ))}
      </TabsList>

      {categoryOrder.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid gap-4 md:grid-cols-2">
            {grouped[category].map((module, index) => {
              const isOpen = openModuleId === module.id;

              return (
                <Reveal key={module.id} delay={index * 0.03}>
                  <Card className="glass border-white/10 py-0">
                    <CardHeader className="pt-5">
                      <button
                        type="button"
                        onClick={() => setOpenModuleId(isOpen ? -1 : module.id)}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <div>
                          <p className="text-xs tracking-[0.15em] text-blue-200 uppercase">
                            Module {module.id}
                          </p>
                          <CardTitle className="text-heading mt-1 text-base text-white sm:text-lg">
                            {module.title}
                          </CardTitle>
                          <p className="mt-2 text-sm text-slate-300">{module.summary}</p>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="mt-1 size-5 shrink-0 text-blue-200" />
                        ) : (
                          <ChevronDown className="mt-1 size-5 shrink-0 text-blue-200" />
                        )}
                      </button>
                    </CardHeader>

                    <CardContent
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-60"
                      )}
                    >
                      <div className="overflow-hidden pb-5 text-sm leading-relaxed text-slate-300">
                        <p>{module.details}</p>
                        <div className="mt-4 rounded-xl border border-blue-300/20 bg-slate-900/55 p-4">
                          <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">Module Snapshot</p>
                          <p className="mt-1 text-sm text-slate-300">
                            {module.title} in Classgrid is connected to tenant-aware access, role permissions, and
                            analytics surfaces.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

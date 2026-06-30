"use client";

import { useState } from "react";
import { DangerConfirmDialog } from "@/components/ui/danger-confirm-dialog";
import { CopySnippetCard } from "@/components/ui/copy-snippet-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RoughPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#111111] flex items-center justify-center">
      <section className="relative h-[800px] w-full max-w-[600px] overflow-hidden bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl">
        {/* TOP GREEN EFFECT - left to right direction */}
        <div
          className="pointer-events-none absolute -top-[90px] -left-[120px] h-[320px] w-[420px] rounded-full blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.85) 0%, rgba(16,185,129,0.4) 38%, rgba(16,185,129,0) 72%)",
          }}
        />

        {/* TOP GREEN DOT GRID */}
        <div
          className="pointer-events-none absolute top-[20px] left-[20px] h-[230px] w-[330px]"
          style={{
            opacity: 0.5,
            backgroundImage:
              "radial-gradient(rgba(16,185,129,1) 1.5px, transparent 1.5px)",
            backgroundSize: "13px 13px",
            maskImage:
              "linear-gradient(135deg, black 0%, black 50%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(135deg, black 0%, black 50%, transparent 85%)",
          }}
        />

        {/* BOTTOM ORANGE EFFECT - right to left direction */}
        <div
          className="pointer-events-none absolute -bottom-[120px] -right-[110px] h-[340px] w-[460px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.8) 0%, rgba(249,115,22,0.4) 40%, rgba(249,115,22,0) 75%)",
          }}
        />

        {/* BOTTOM ORANGE DOT GRID */}
        <div
          className="pointer-events-none absolute bottom-[20px] right-[24px] h-[250px] w-[350px]"
          style={{
            opacity: 0.45,
            backgroundImage:
              "radial-gradient(rgba(249,115,22,1) 1.5px, transparent 1.5px)",
            backgroundSize: "13px 13px",
            maskImage:
              "linear-gradient(315deg, black 0%, black 50%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(315deg, black 0%, black 50%, transparent 85%)",
          }}
        />

        {/* WHITE SUBTLE TOP GRID */}
        <div
          className="pointer-events-none absolute top-[34px] right-[34px] h-[180px] w-[230px]"
          style={{
            opacity: 0.35,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            maskImage:
              "linear-gradient(225deg, black 0%, black 40%, transparent 80%)",
            WebkitMaskImage:
              "linear-gradient(225deg, black 0%, black 40%, transparent 80%)",
          }}
        />

        {/* WHITE SUBTLE BOTTOM GRID */}
        <div
          className="pointer-events-none absolute bottom-[32px] left-[32px] h-[190px] w-[260px]"
          style={{
            opacity: 0.3,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            maskImage:
              "linear-gradient(45deg, black 0%, black 40%, transparent 82%)",
            WebkitMaskImage:
              "linear-gradient(45deg, black 0%, black 40%, transparent 82%)",
          }}
        />

        {/* YOUR CONTENT */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Vercel-style Components Sandbox</h1>
            <p className="text-sm text-gray-400">Testing the CopySnippetCard and DangerConfirmDialog.</p>
          </div>
          
          <div className="w-full max-w-md mt-4 text-left">
            <CopySnippetCard
              title="Project ID"
              description="Used when interacting with the Vercel API."
              value="prj_gmxRcyWKqUel6PAFb48yKz7KC3ll"
              footerText="Learn more about Project ID"
              footerLink="https://vercel.com/docs"
            />
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 w-full">
            <Button 
              variant="destructive"
              onClick={() => setShowDialog(true)}
            >
              Test Delete Project Dialog
            </Button>
          </div>

          <DangerConfirmDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            title="Delete Organization"
            description={<>This will permanently delete your project and all of its deployments. This action cannot be undone.</>}
            warningMessage="Warning: This action is irreversible."
            actionLabel="Delete Project"
            variant="danger"
            isLoading={isDeleting}
            confirmationSteps={[
              { label: "To confirm, type", value: "Classgrid University" },
              { label: "To confirm, type", value: "bill.classgrid.in" },
              { label: "To confirm, type", value: "delete my organization" }
            ]}
            onConfirm={async () => {
              setIsDeleting(true);
              // Simulate network request
              await new Promise(resolve => setTimeout(resolve, 2000));
              setIsDeleting(false);
              
              toast.success("Organization successfully deleted!");
              setShowDialog(false);
            }}
          />
        </div>
      </section>
    </div>
  );
}

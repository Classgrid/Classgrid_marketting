"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="glass flex h-[360px] w-full items-center justify-center rounded-2xl text-sm text-muted-foreground">
      Loading 3D Scene...
    </div>
  ),
});

export function SplineCube() {
  return (
    <div className="glass relative h-[360px] w-full overflow-hidden rounded-2xl md:h-[440px]">
      <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
    </div>
  );
}

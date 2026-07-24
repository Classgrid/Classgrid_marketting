import React from 'react';
import { ClassgridLogo } from '@/components/ui/ClassgridLogo';
import { SectionAccentBar } from '@/components/ui/section-accent-bar';

export default function BrandGuidelinesPage() {
  const brandColors = [
    { name: 'Dark Background', hex: '#0f0f0f', text: 'text-white' },
    { name: 'Primary Emerald', hex: '#34d399', text: 'text-black' },
    { name: 'Warning Orange', hex: '#f97316', text: 'text-white' },
    { name: 'Card Surface', hex: '#111111', text: 'text-white' },
    { name: 'Muted Accent', hex: '#141414', text: 'text-white' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-12 font-sans selection:bg-[#34d399] selection:text-black flex flex-col items-center">
      <div className="max-w-4xl mx-auto space-y-16 flex flex-col items-center text-center w-full">
        {/* Header */}
        <header className="space-y-6 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <SectionAccentBar align="center" />
            <h1 className="text-5xl font-bold tracking-tight">Visual Identity</h1>
          </div>
          <p className="text-muted-foreground dark:text-zinc-200 text-lg max-w-3xl leading-relaxed mt-2">
            Classgrid is the next-generation operating system for education. Our visual language is engineered for speed, focus, and seamless user experiences. By pairing deep, immersive dark-mode aesthetics with vibrant, energetic accents, our brand identity feels premium, enterprise-ready, and effortlessly intuitive.
          </p>
        </header>

        <hr className="border-border w-full" />

        {/* Logo Section */}
        <section className="space-y-8 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold">Official Logo</h2>
          <div className="bg-card border border-border shadow-sm rounded-2xl w-80 h-80 flex items-center justify-center mx-auto">
            <ClassgridLogo className="w-72 h-72 text-foreground dark:text-white" />
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-8 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left w-full">
            {brandColors.map((color) => (
              <div 
                key={color.hex}
                className="group relative rounded-2xl overflow-hidden border border-border shadow-sm transition-all hover:border-foreground/20"
              >
                <div 
                  className="h-32 w-full transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-4 bg-muted space-y-1">
                  <h3 className="font-medium text-foreground dark:text-gray-200">{color.name}</h3>
                  <div className="flex items-center justify-between">
                    <code className="text-[#34d399] font-mono text-sm">{color.hex}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

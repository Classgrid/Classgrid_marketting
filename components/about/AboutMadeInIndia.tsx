"use client";

import { motion } from "framer-motion";

export function AboutMadeInIndia({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 80 1200 540" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className || "w-full h-auto"}
    >
            {/* Background */}
            <rect width="1200" height="620" fill="transparent"/>

            {/* Title */}
            <text x="90"
                  y="150"
                  fontFamily="Inter, Arial, sans-serif"
                  fontSize="82"
                  fontWeight="800"
                  fill="#2563EB">
              Made in India
            </text>

            {/* Subtitle */}
            <text x="90"
                  y="235"
                  fontFamily="Inter, Arial, sans-serif"
                  fontSize="64"
                  fontWeight="500"
                  fill="var(--foreground)">
              for India &amp; Beyond
            </text>

            {/* Correct Indian Flag */}
            <g transform="translate(90 285)">
              {/* saffron */}
              <rect x="0"
                    y="0"
                    width="260"
                    height="18"
                    rx="9"
                    fill="#FF9933"/>
              {/* white */}
              <rect x="260"
                    y="0"
                    width="260"
                    height="18"
                    rx="9"
                    fill="#FFFFFF"/>
              {/* green */}
              <rect x="520"
                    y="0"
                    width="260"
                    height="18"
                    rx="9"
                    fill="#138808"/>

              {/* Ashoka Chakra */}
              <g transform="translate(390 9)">
                <circle r="18"
                        fill="#FFFFFF"
                        stroke="#000080"
                        strokeWidth="2.5"/>
                <circle r="2.5"
                        fill="#000080"/>
                {/* spokes */}
                <g stroke="#000080" strokeWidth="1">
                  <line x1="0" y1="-14" x2="0" y2="14"/>
                  <line x1="-14" y1="0" x2="14" y2="0"/>
                  <line x1="-10" y1="-10" x2="10" y2="10"/>
                  <line x1="-10" y1="10" x2="10" y2="-10"/>
                  <line x1="-5" y1="-13" x2="5" y2="13"/>
                  <line x1="-5" y1="13" x2="5" y2="-13"/>
                </g>
              </g>
            </g>

            {/* Description */}
            <text x="90"
                  y="390"
                  fontFamily="Inter, Arial, sans-serif"
                  fontSize="34"
                  fontWeight="400"
                  fill="var(--muted-foreground)">
              <tspan x="90" dy="0">
                We are committed to delivering powerful,
              </tspan>
              <tspan x="90" dy="52">
                reliable solutions built with care,
              </tspan>
              <tspan x="90" dy="52">
                designed for India, ready for the world.
              </tspan>
            </text>
          </svg>
  );
}

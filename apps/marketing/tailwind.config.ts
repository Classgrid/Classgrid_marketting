import type { Config } from "tailwindcss";

type TailwindPluginApi = {
  addBase: (base: Record<string, Record<string, string>>) => void;
  theme: (path: string) => unknown;
};

function flattenColors(
  input: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const output: Record<string, string> = {};

  for (const [key, value] of Object.entries(input)) {
    const nextKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "string") {
      output[nextKey] = value;
      continue;
    }

    if (value && typeof value === "object") {
      Object.assign(output, flattenColors(value as Record<string, unknown>, nextKey));
    }
  }

  return output;
}

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: TailwindPluginApi): void {
  const colorObject = theme("colors");
  if (!colorObject || typeof colorObject !== "object") {
    return;
  }

  const allColors = flattenColors(colorObject as Record<string, unknown>);
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
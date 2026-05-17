const fs = require('fs');
let file = fs.readFileSync('app/globals.css', 'utf8');

file = file.replace(
/:root {[\s\S]*?}/,
`:root {
        --radius: 0.75rem;
        --background: #ffffff;
        --foreground: #000000;
        --card: #f8f9fa;
        --card-foreground: #000000;
        --popover: #ffffff;
        --popover-foreground: #000000;
        --primary: #4a90f5;
        --primary-foreground: #ffffff;
        --secondary: #e5e7eb;
        --secondary-foreground: #000000;
        --muted: #f3f4f6;
        --muted-foreground: #6b7280;
        --accent: #f3f4f6;
        --accent-foreground: #000000;
        --destructive: #ef4444;
        --border: #e5e7eb;
        --input: #e5e7eb;
        --ring: #3b82f6;
        --chart-1: oklch(0.68 0.18 255);
        --chart-2: oklch(0.74 0.13 220);
        --chart-3: oklch(0.78 0.14 180);
        --chart-4: oklch(0.72 0.18 300);
        --chart-5: oklch(0.78 0.16 75);
}

.dark {
        --background: #000000;
        --foreground: #ffffff;
        --card: #0a0a0a;
        --card-foreground: #ffffff;
        --popover: #0a0a0a;
        --popover-foreground: #ffffff;
        --primary: #4a90f5;
        --primary-foreground: #ffffff;
        --secondary: #0f0f0f;
        --secondary-foreground: #ffffff;
        --muted: #101010;
        --muted-foreground: #888888;
        --accent: #101010;
        --accent-foreground: #ffffff;
        --destructive: #f43f5e;
        --border: #333333;
        --input: #333333;
        --ring: #8b6fff;
}`
);

fs.writeFileSync('app/globals.css', file);

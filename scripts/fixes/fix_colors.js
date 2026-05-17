const fs = require('fs');

const file1 = 'c:\\Users\\nikhi\\OneDrive\\Documents\\classgrid_marketting\\components\\sections\\TurboComparisonSection.tsx';
let c1 = fs.readFileSync(file1, 'utf-8');

// Replace semantic classes with explicit tailwind colors
c1 = c1.replace(/text-destructive/g, 'text-pink-500');
c1 = c1.replace(/bg-destructive/g, 'bg-pink-500');
c1 = c1.replace(/from-destructive/g, 'from-pink-500');
c1 = c1.replace(/to-destructive/g, 'to-pink-500');
c1 = c1.replace(/border-destructive/g, 'border-pink-500');

c1 = c1.replace(/text-primary/g, 'text-emerald-500');
c1 = c1.replace(/bg-primary/g, 'bg-emerald-500');
c1 = c1.replace(/from-primary/g, 'from-emerald-500');
c1 = c1.replace(/to-primary/g, 'to-emerald-500');
c1 = c1.replace(/border-primary/g, 'border-emerald-500');

c1 = c1.replace(/text-ring/g, 'text-blue-500');
c1 = c1.replace(/bg-ring/g, 'bg-blue-500');
c1 = c1.replace(/from-ring/g, 'from-blue-500');
c1 = c1.replace(/to-ring/g, 'to-blue-500');
c1 = c1.replace(/border-ring/g, 'border-blue-500');

c1 = c1.replace(/var\(--destructive\)/g, '#ec4899'); // pink-500
c1 = c1.replace(/var\(--primary\)/g, '#10b981'); // emerald-500
c1 = c1.replace(/var\(--ring\)/g, '#3b82f6'); // blue-500

c1 = c1.replace(/rgba\(244,63,94/g, 'rgba(236,72,153'); // shadow pink
c1 = c1.replace(/rgba\(52,211,153/g, 'rgba(16,185,129'); // shadow emerald

fs.writeFileSync(file1, c1);
console.log("Fixed Turbo colors");

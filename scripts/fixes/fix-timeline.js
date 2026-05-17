const fs = require('fs');

let file = fs.readFileSync('components/ui/radial-orbital-timeline.tsx', 'utf8');

// 1. Add mounted check
file = file.replace(/const containerRef = useRef<HTMLDivElement>\(null\);/g, 'const [mounted, setMounted] = useState(false);\n  useEffect(() => setMounted(true), []);\n  const containerRef = useRef<HTMLDivElement>(null);');

// 2. Wrap return inside mounted check
file = file.replace(/return \(\n    <div\n      className="w-full h-screen/g, 'if (!mounted) return <div className="w-full h-[600px] flex items-center justify-center"><div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin"></div></div>;\n\n  return (\n    <div\n      className="w-full h-[600px]');

// 3. Fix bg-black and text-white to use theme variables
file = file.replace(/bg-black/g, 'bg-background');
file = file.replace(/text-white/g, 'text-foreground');
file = file.replace(/text-black/g, 'text-background');
file = file.replace(/border-white/g, 'border-foreground');
file = file.replace(/shadow-white/g, 'shadow-foreground');
file = file.replace(/rgba\(255,255,255,0\.2\)/g, 'rgba(150,150,150,0.2)');
file = file.replace(/rgba\(255,255,255,0\)/g, 'rgba(150,150,150,0)');

fs.writeFileSync('components/ui/radial-orbital-timeline.tsx', file);
console.log('Fixed RadialOrbitalTimeline');

const fs = require('fs');
let file = fs.readFileSync('components/ui/globe.tsx', 'utf8');

file = file.replace(
/const globe = createGlobe\(canvasRef\.current!, \{[\s\S]*?globe\.destroy\(\)\s*window\.removeEventListener\(\"resize\", onResize\)\s*\}/,
`let globe = null;

    setTimeout(() => {
      if (!canvasRef.current) return;
      
      globe = createGlobe(canvasRef.current, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (!pointerInteracting.current) phiRef.current += 0.005
          state.phi = phiRef.current + rs.get()
          state.width = widthRef.current * 2
          state.height = widthRef.current * 2
        },
      });
      setTimeout(() => (canvasRef.current.style.opacity = "1"), 0);
    }, 100);

    return () => {
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener("resize", onResize);
    }`
);

fs.writeFileSync('components/ui/globe.tsx', file);

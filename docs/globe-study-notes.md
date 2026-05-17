# Cobe Globe — Deep Study Notes

## Source: `node_modules/cobe/dist/index.esm.js`

---

## How cobe renders internally (WebGL shader analysis)

### 1. Canvas sizing — CRITICAL
```js
e.width = t.width * n   // n = devicePixelRatio
e.height = t.height * n
```
**cobe sets canvas.width/height itself.** You must NEVER pre-set canvas.width before calling createGlobe.
Pass `width: cssPixelSize` (e.g., 700) and `devicePixelRatio: 2`.
cobe will make `canvas.width = 1400`. CSS `width: 100%` scales it back to 700px on screen.

### 2. Fragment shader uniform mapping
```
a.uniform4f(I.n, v, b, x, y)
```
| Config param | Shader uniform | Shader symbol |
|---|---|---|
| `mapBrightness` | n.x (vec4) | `v` |
| `diffuse` | n.y (vec4) | `b` |
| `dark` | n.z (vec4) | `x` |
| `opacity` | n.w (vec4) | `y` |

### 3. How dots are lit (fragment shader math)
```glsl
// p = world map texture sample (0 = ocean, 1 = land)
// g = distance to nearest fibonacci point (smoothstep for dot edge)
// i = cos(view angle) = 1 at center, 0 at edge
float q = p * smoothstep(8e-3, 0., g) * pow(i, n.y) * n.x;
//           └── dot shape ──────────   └─ edge fade ─┘  └─ mapBrightness ─┘

m += vec4(F * (mix((1.-q)*pow(i,.4), q, n.z) + .1) + pow(1.-i,4.)*w, 1);
//        └─ baseColor ─┘              └─ dark mode ─┘       └─ glowColor atmosphere
l += m * (1.+n.w) * 0.5;   // n.w = opacity
```

### 4. What dark=1 does
- When `dark=0`: globe is fully lit, shaded by angle to camera
- When `dark=1`: `mix(...)` picks `q` (the land dot value), ignoring the shading
- Result: ocean = near-black, land = bright white dots regardless of angle

### 5. Why baseColor=[0,0,0] kills dots
With dark=1 and q = mapBrightness * texture:
```
m = baseColor * (q + 0.1) + atmosphere
m = [0,0,0] * (q + 0.1) + [r,g,b]*glow
m = [0,0,0] + atmosphere_only
```
**The dots literally become invisible** because baseColor multiplies q. You get only the glow ring!

### 6. Why baseColor=[1,1,1] also fails  
```
m = [1,1,1] * (q + 0.1) + atmosphere
ocean_pixel: m = [1,1,1] * (0 + 0.1) = [0.1, 0.1, 0.1]  ← ocean is light grey
land_pixel:  m = [1,1,1] * (12 + 0.1) ≈ [1,1,1]          ← white dots
```
Ocean is NOT dark = no contrast = dots not visible against grey ocean.

### 7. Why baseColor=[0.3, 0.3, 0.3] is the sweet spot
```
ocean_pixel: m = [0.3,0.3,0.3] * 0.1 = [0.03, 0.03, 0.03]  ← very dark ocean ✓
land_pixel:  m = [0.3,0.3,0.3] * 12.1 ≈ [3.6...] → clamped to [1,1,1]  ← white ✓
```
High contrast: near-black ocean, pure white dots.

---

## Correct Working Configuration

```ts
createGlobe(canvas, {
  devicePixelRatio: dpr,          // cap at 2
  width: cssSize,                 // CSS pixel size of container (NOT multiplied by dpr)
  height: cssSize,
  phi: 1.4,                       // ~80° east — India facing front
  theta: 0.2,                     // slight tilt
  dark: 1,                        // dark mode
  diffuse: 1.8,                   // higher = dots stay bright toward edges
  mapBrightness: 12,              // 2× aceternity default (6) — max bright white dots
  mapBaseBrightness: 0,           // ocean stays perfectly dark
  baseColor: [0.3, 0.3, 0.3],    // THE ONLY VALUE THAT WORKS — dark grey ocean
  glowColor: [1, 1, 1],          // white atmosphere ring (like Supabase)
  markerColor: [0.06, 0.72, 0.5], // emerald green for India
  mapSamples: 20000,             // denser dots than default 16000
  opacity: 1,
  markers: [...],                 // multiple India markers for country coverage
  onRender: (state) => {
    phi += 0.003;
    state.phi = phi;
  }
});
```

## Why previous attempts failed

| Attempt | baseColor | Result | Root cause |
|---|---|---|---|
| 1 | [0, 0, 0] | Black disc, no dots | baseColor=0 kills dot color formula |
| 2 | [1, 1, 1] | Grey disc, faint dots | Ocean = grey, no contrast |
| 3 | [0.15, 0.15, 0.15] | Dim dots | mapBrightness too low (6) |
| 4 | ResizeObserver + manual canvas.width | Marker only, no globe | Double-setting canvas.width before cobe does it |
| Current | [0.3, 0.3, 0.3], mapBrightness=12 | Should work ✓ | Correct formula |

## Canvas sizing rules
- Container: `max-w-[760px] aspect-square w-full` 
- On 1280px screen: cssSize ≈ 640px
- cobe sets: `canvas.width = 640 * 2 = 1280px` (retina)
- CSS: `width: 100%` → displays at 640px on screen

## India multi-marker strategy
Single marker at lat/lng center = just one dot. 10 overlapping markers across subcontinent = India-shaped emerald highlight:
- Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Ahmedabad, Jaipur, Central India, Geographic center
- Each size 0.08–0.13 — overlapping creates country-scale coverage

## Supabase globe observations (visual study)
- Globe takes up ~60% of viewport width (bleeds past container left edge)
- White atmosphere ring — NOT colored
- Dots are bright white, clearly visible, medium density
- Small green pin markers for office locations (not country highlighting)
- No user drag interaction (auto-rotate only)
- Globe starts showing Americas, rotates slowly eastward
- Black ocean, white dots — very high contrast

## Key differences: Classgrid vs Supabase
| Feature | Supabase | Classgrid |
|---|---|---|
| Atmosphere | White | White (same) |
| Dots | Bright white | Bright white (same) |
| Markers | Office pins (small) | India country highlight (large, 10 overlapping) |
| Marker color | Supabase green | Classgrid emerald #10b981 |
| Starting position | Americas | India (phi=1.4) |
| Globe size | ~60vw (bleeds edge) | max 760px, centered in left column |

import React from 'react';

export function LayersSvg({ activeIndex, visualIndex, setActiveIndex, setHoveredIndex }: {
  activeIndex: number,
  visualIndex: number,
  setActiveIndex: (idx: number) => void,
  setHoveredIndex: (idx: number | null) => void,
}) {
  return (
    <svg style={{ width: '100%', height: 'auto', overflow: 'visible' }} viewBox="0 0 503 541" fill="none" xmlns="http://www.w3.org/2000/svg" data-active={visualIndex} className="cg-iso-svg" onMouseLeave={() => setHoveredIndex(null)}>
      <g className={`cg-iso-layer-container ${visualIndex === 5 ? 'active' : ''}`} data-layer="5" onClick={() => setActiveIndex(5)} onMouseEnter={() => setHoveredIndex(5)}>
        <g fill="transparent" stroke="transparent">
          <path d="M121.5 475.26V480.9L251.48 532.4V526.76L121.5 475.26Z" />
          <path d="M251.48 532.4V526.76L381.45 475.26V480.9L251.48 532.4Z" />
          <path d="M381.45 475.26L251.48 526.76L121.5 475.26L251.48 423.75L381.45 475.26Z" />
        </g>
        <g className="cg-iso-layer">
          <path d="M121.5 475.26V480.9L251.48 532.4V526.76L121.5 475.26Z" fill="url(#paint0_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M251.48 532.4V526.76L381.45 475.26V480.9L251.48 532.4Z" fill="url(#paint1_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M381.45 475.26L251.48 526.76L121.5 475.26L251.48 423.75L381.45 475.26Z" fill="url(#paint2_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </g>
      <g className={`cg-iso-layer-container ${visualIndex === 4 ? 'active' : ''}`} data-layer="4" onClick={() => setActiveIndex(4)} onMouseEnter={() => setHoveredIndex(4)}>
        <g fill="transparent" stroke="transparent">
          <path d="M121.5 390.61V396.25L251.48 447.75V442.12L121.5 390.61Z" />
          <path d="M251.48 447.75V442.12L381.45 390.61V396.25L251.48 447.75Z" />
          <path d="M381.45 390.61L251.48 442.12L121.5 390.61L251.48 339.1L381.45 390.61Z" />
        </g>
        <g className="cg-iso-layer">
          <path d="M121.5 390.61V396.25L251.48 447.75V442.12L121.5 390.61Z" fill="url(#paint3_linear_6432_641)" stroke="#0A649B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M251.48 447.75V442.12L381.45 390.61V396.25L251.48 447.75Z" fill="url(#paint4_linear_6432_641)" stroke="#0A649B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M381.45 390.61L251.48 442.12L121.5 390.61L251.48 339.1L381.45 390.61Z" fill="url(#paint5_linear_6432_641)" stroke="#0A649B" strokeWidth="1.42739" strokeLinecap="round" strokeLinejoin="round"/>
        <g opacity="0.4">
          <g opacity="0.3">
            <path d="M280.63 390.61H381.45" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M222.78 390.61H121.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M251.48 403.22V442.12" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M251.48 378V339.1" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M186.49 416.36L316.47 364.86" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M186.49 364.86L316.47 416.36" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M346.84 393.4L252.58 430.75C251.87 431.03 251.08 431.03 250.37 430.75L156.11 393.4C153.58 392.4 153.58 388.82 156.11 387.82L250.37 350.47C251.08 350.19 251.87 350.19 252.58 350.47L346.84 387.82C349.37 388.82 349.37 392.4 346.84 393.4Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M311.09 393.4L252.58 416.58C251.87 416.86 251.08 416.86 250.37 416.58L191.86 393.4C189.33 392.4 189.33 388.82 191.86 387.82L250.37 364.64C251.08 364.36 251.87 364.36 252.58 364.64L311.09 387.82C313.62 388.82 313.62 392.4 311.09 393.4Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M279.65 392.05L252.05 402.99C251.68 403.14 251.27 403.14 250.91 402.99L223.31 392.05C222 391.53 222 389.68 223.31 389.16L250.91 378.22C251.28 378.07 251.69 378.07 252.05 378.22L279.65 389.16C280.96 389.68 280.96 391.53 279.65 392.05Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </g>
        <path d="M260.509 392.882L254.644 393.795C253.185 394.023 251.588 394.063 250.03 393.904C248.481 393.755 247.082 393.418 245.981 392.951L238.042 389.547L252.521 384L260.797 387.166C261.938 387.602 262.742 388.158 263.109 388.763C263.477 389.379 263.377 390.004 262.802 390.57L260.499 392.892L260.509 392.882ZM240.79 389.567L247.42 392.376C248.233 392.723 249.265 392.961 250.407 393.07C251.548 393.18 252.729 393.15 253.801 392.981L258.862 392.197L260.867 390.202C261.283 389.786 261.373 389.319 261.105 388.873C260.847 388.426 260.261 388.019 259.418 387.692L252.57 385.042L240.8 389.567H240.79Z" fill="#1F7BC0"/>
        <path d="M253.781 390.699L249.653 390.729L249.533 389.915L251.727 389.905L251.677 387.94L253.672 387.96L253.781 390.699Z" fill="#1F7BC0"/>
        </g>
      </g>
      <g className={`cg-iso-layer-container ${visualIndex === 3 ? 'active' : ''}`} data-layer="3" onClick={() => setActiveIndex(3)} onMouseEnter={() => setHoveredIndex(3)}>
        <g fill="transparent" stroke="transparent">
          <path d="M121.5 305.95V311.59L251.48 363.1V357.46L121.5 305.95Z" />
          <path d="M251.48 363.1V357.46L381.45 305.95V311.59L251.48 363.1Z" />
          <path d="M381.45 305.95L251.48 357.46L121.5 305.95L251.48 254.45L381.45 305.95Z" />
        </g>
        <g className="cg-iso-layer">
          <path d="M121.5 305.95V311.59L251.48 363.1V357.46L121.5 305.95Z" fill="url(#paint6_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M251.48 363.1V357.46L381.45 305.95V311.59L251.48 363.1Z" fill="url(#paint7_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M381.45 305.95L251.48 357.46L121.5 305.95L251.48 254.45L381.45 305.95Z" fill="url(#paint8_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
        <g opacity="0.3">
          <path d="M271.18 315.96L262.01 319.19C261.42 319.4 260.61 319.5 259.66 319.49C258.77 319.48 257.78 319.37 256.79 319.17C255.8 318.97 254.85 318.69 254.03 318.35C253.16 317.99 252.47 317.58 252.03 317.16L241.77 307.32C241.34 306.91 240.49 306.54 239.49 306.33C239.02 306.23 237.86 306.03 237.12 306.32L231.34 308.57C230.85 308.76 229.8 308.65 228.98 308.32C228.16 307.99 227.89 307.57 228.38 307.38L234.16 305.1C235.35 304.63 237.42 304.64 239.69 305.13C241.95 305.61 243.94 306.48 244.88 307.4L254.99 317.24C255.36 317.6 256.14 317.93 257.07 318.12C257.99 318.31 258.85 318.31 259.36 318.13L268.54 314.86C268.95 314.71 269.03 314.45 268.75 314.16L266.24 311.54L263.26 311.8C261.83 311.98 259.98 311.82 258.15 311.34C256.29 310.85 254.78 310.13 254.01 309.35L248.86 304.2C248.47 303.81 248.86 303.5 249.72 303.52C250.59 303.54 251.61 303.88 252 304.27L257.07 309.42C257.4 309.76 258.06 310.08 258.87 310.29C259.68 310.5 260.51 310.58 261.14 310.49C261.17 310.49 261.21 310.49 261.25 310.48L264.91 310.16L257.01 301.91C256.1 300.96 256.45 300.13 257.95 299.77C259.45 299.4 261.74 299.58 263.92 300.23L282.41 305.79C283.46 306.11 284.38 306.5 285.06 306.94C285.7 307.35 286.13 307.78 286.31 308.2C286.48 308.61 286.39 308.99 286.06 309.29C285.7 309.61 285.06 309.84 284.22 309.96C284.18 309.96 284.15 309.96 284.11 309.97L268.98 311.3L271.74 314.22C272.43 314.95 272.22 315.61 271.19 315.97L271.18 315.96ZM282.22 308.63C282.92 308.52 283.25 308.24 283.08 307.86C282.91 307.47 282.27 307.08 281.37 306.81L262.94 301.3C262.06 301.04 261.18 300.97 260.57 301.12C259.96 301.27 259.82 301.59 260.18 301.97L267.67 309.9L282.21 308.62L282.22 308.63Z" fill="white"/>
          <path d="M234.37 300.13C236.5 298.27 235.85 297.16 231.01 294.46C230.76 294.32 230.71 294.17 230.88 294.09C231.06 294.02 231.42 294.04 231.75 294.15C238.09 296.25 240.75 296.55 245.39 295.69C245.63 295.65 246 295.71 246.29 295.83C246.58 295.96 246.7 296.11 246.58 296.21C244.35 298.1 244.95 299.2 249.54 301.79C249.77 301.92 249.81 302.06 249.63 302.13C249.45 302.2 249.11 302.18 248.8 302.08C242.72 300.09 240.11 299.8 235.57 300.63C235.34 300.67 234.97 300.62 234.68 300.5C234.39 300.38 234.26 300.23 234.37 300.13Z" fill="white"/>
          <path d="M234.54 293.89C235.66 292.88 235.32 292.28 232.78 290.84C232.65 290.77 232.62 290.68 232.72 290.64C232.81 290.6 233 290.61 233.17 290.67C236.5 291.79 237.9 291.95 240.34 291.49C240.47 291.47 240.66 291.49 240.82 291.57C240.97 291.64 241.04 291.72 240.98 291.78C239.83 292.8 240.16 293.4 242.63 294.81C242.76 294.88 242.78 294.96 242.68 295C242.59 295.04 242.4 295.03 242.24 294.97C238.98 293.88 237.59 293.72 235.19 294.17C235.07 294.19 234.87 294.17 234.72 294.1C234.57 294.03 234.5 293.95 234.56 293.9L234.54 293.89Z" fill="white"/>
        </g>
        </g>
      </g>
      <g opacity="0.4" filter="url(#filter0_f_6432_641)" style={{ pointerEvents: 'none' }}>
        <path d="M344 308.504L251.504 345L159 308.504L251.504 272L344 308.504Z" fill="#01162A"/>
      </g>
      <g className={`cg-iso-layer-container ${visualIndex === 2 ? 'active' : ''}`} data-layer="2" onClick={() => setActiveIndex(2)} onMouseEnter={() => setHoveredIndex(2)}>
        <g fill="transparent" stroke="transparent">
          <path d="M121.5 221.31V226.95L251.48 278.45V272.81L121.5 221.31Z" />
          <path d="M251.48 278.45V272.81L381.45 221.31V226.95L251.48 278.45Z" />
          <path d="M381.45 221.31L251.48 272.81L121.5 221.31L251.48 169.8L381.45 221.31Z" />
        </g>
        <g className="cg-iso-layer">
          <path d="M121.5 221.31V226.95L251.48 278.45V272.81L121.5 221.31Z" fill="url(#paint9_linear_6432_641)" stroke="#0A649B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M251.48 278.45V272.81L381.45 221.31V226.95L251.48 278.45Z" fill="url(#paint10_linear_6432_641)" stroke="#0A649B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M381.45 221.31L251.48 272.81L121.5 221.31L251.48 169.8L381.45 221.31Z" fill="url(#paint11_linear_6432_641)" stroke="#0A649B" strokeWidth="1.42739" strokeLinecap="round" strokeLinejoin="round"/>
        <g opacity="0.3">
          <path d="M173.8 221.31L158.88 227.22L143.95 221.31L158.88 215.39L173.8 221.31Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M166.17 217.72L268.84 177.03" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M165.88 224.86L268.84 265.65" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M253.46 190.76L200.23 211.85L179.96 204.09L233.18 183L253.46 190.76Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M211.5 238.8L200.1 243.31L188.69 238.8L200.1 234.28L211.5 238.8Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M205.3 236.03L311.53 193.94" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.67 208.25L241.45 229.34L221.17 221.58L274.4 200.49L294.67 208.25Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M262.46 256.13L244.19 263.37L225.92 256.13L244.19 248.89L262.46 256.13Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M252.93 251.96L355.59 211.28" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M338.76 225.58L285.54 246.67L265.26 238.91L318.49 217.82L338.76 225.58Z" fill="#005D96" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <path d="M381.45 221.31L251.48 272.81L121.5 221.31L251.48 169.8L381.45 221.31Z" stroke="#0A649B" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </g>
      <g className={`cg-iso-layer-container ${visualIndex === 1 ? 'active' : ''}`} data-layer="1" onClick={() => setActiveIndex(1)} onMouseEnter={() => setHoveredIndex(1)}>
        <g fill="transparent" stroke="transparent">
          <path d="M121.5 136.65V142.29L251.48 193.8V188.16L121.5 136.65Z" />
          <path d="M251.48 193.8V188.16L381.45 136.65V142.29L251.48 193.8Z" />
          <path d="M381.45 136.65L251.48 188.16L121.5 136.65L251.48 85.1499L381.45 136.65Z" />
        </g>
        <g className="cg-iso-layer">
          <path d="M121.5 136.65V142.29L251.48 193.8V188.16L121.5 136.65Z" fill="url(#paint12_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M251.48 193.8V188.16L381.45 136.65V142.29L251.48 193.8Z" fill="url(#paint13_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M381.45 136.65L251.48 188.16L121.5 136.65L251.48 85.1499L381.45 136.65Z" fill="url(#paint14_linear_6432_641)" stroke="#0A649B" strokeWidth="1.42739" strokeLinecap="round" strokeLinejoin="round"/>
        <g opacity="0.3">
          <path d="M186.49 110.9L221.46 124.76" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M194.54 107.81L229.51 121.67" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M202.36 104.73L237.34 118.59" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M210.75 101.42L245.72 115.28" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M218.24 98.45L253.21 112.3" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M226.59 95.1401L261.56 109" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M234.16 92.0801L269.13 105.93" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.81 88.54L277.78 102.4" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M162.35 148.17L197.33 162.03" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M170.4 145.08L205.04 158.81" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M178.68 141.77L213.33 155.51" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M186.28 138.8L220.91 152.53" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M194.74 135.49L229.36 149.21" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M202.67 132.43L237.18 146.11" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M291.7 124.76L321.72 136.65" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M298.86 121.97L328.32 133.64" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M306.49 119.03L335.95 130.7" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M314.25 116.13L343.71 127.81" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M249.98 165.22L279.38 176.87" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M243.35 167.93L272.74 179.58" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M237.14 170.44L266.53 182.09" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M228.65 173.75L258.05 185.4" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M156.77 150.51L286.75 99" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M192.19 164.15L321.22 113.02" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M221.76 176.26L351.73 124.76" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M152.32 134.26L153.52 134.8L150.32 136.05L153.3 137.41L155.88 136.39L157.11 136.95L154.53 137.98L158.77 139.92L157.81 140.31L148.17 135.88L152.32 134.26Z" fill="white"/>
          <path d="M163.96 137.82L162.69 137.25L164.15 136.66L156.96 133.46L155.61 133.99L154.39 133.45L158.08 132.01L159.3 132.55L157.89 133.1L165.08 136.29L166.6 135.68L167.87 136.24L163.96 137.82Z" fill="white"/>
          <path d="M169.77 135.47L160.08 131.24L161.11 130.84L170.4 133.09L163.24 130.01L164.1 129.67L173.81 133.83L172.89 134.2L162.97 131.78L170.64 135.11L169.77 135.46V135.47Z" fill="white"/>
          <path d="M167.34 128.41L168.36 128.01L179.95 131.35L179.11 131.69L175.98 130.78L173.88 131.62L176.01 132.94L175.19 133.27L167.34 128.4V128.41ZM172.89 131.01L174.54 130.35L169.13 128.76L172.89 131.01Z" fill="white"/>
          <path d="M181.31 130.8L171.58 126.76L172.57 126.37L181.8 128.52L174.61 125.58L175.44 125.26L185.18 129.24L184.3 129.6L174.45 127.29L182.16 130.47L181.33 130.81L181.31 130.8Z" fill="white"/>
          <path d="M179.06 123.73C180 123.36 181.55 123.37 183.75 124.03L183.49 124.47C181.72 123.97 180.88 123.98 180.28 124.21C179.38 124.56 180.11 125.23 182.24 126.09L183.13 126.45C185.32 127.33 186.93 127.6 187.85 127.22C188.62 126.91 188.01 126.36 187.11 125.84L188.26 125.73C189.53 126.49 190.23 127.29 189.11 127.74C187.7 128.31 185.17 127.96 182.27 126.79L181.38 126.43C179.39 125.62 177.42 124.37 179.07 123.73H179.06Z" fill="white"/>
          <path d="M186.1 121.09L187.32 121.57L184.66 122.61L187.55 123.75L189.73 122.89L190.97 123.37L188.79 124.24L191.95 125.49L194.75 124.36L196.01 124.85L192.37 126.32L182.61 122.45L186.1 121.09Z" fill="white"/>
          <path d="M233.65 129.86C235.07 129.29 237.65 129.6 240.41 130.64L241.89 131.2C244.61 132.23 245.44 133.21 244.07 133.75C242.7 134.29 240.11 134.02 237.39 133.01L235.9 132.46C233.08 131.41 232.24 130.42 233.65 129.86ZM238.3 132.64C240.4 133.42 242.04 133.64 242.88 133.31C243.72 132.98 243.03 132.36 240.94 131.57L239.46 131.01C237.48 130.26 235.76 129.94 234.84 130.31C233.92 130.68 234.81 131.33 236.81 132.08L238.3 132.63V132.64Z" fill="white"/>
          <path d="M237.91 128.26L239.93 127.45C241.2 126.94 243.23 126.89 245.36 127.71C247.51 128.54 247.32 129.31 246.07 129.81L244.99 130.24L248.91 131.74L248 132.1L237.92 128.25L237.91 128.26ZM244.87 129.31C245.71 128.98 245.55 128.54 244.4 128.09C243.15 127.61 242.07 127.6 241.27 127.92L240.12 128.38L243.72 129.76L244.86 129.31H244.87Z" fill="white"/>
          <path d="M248.15 124.18L249.43 124.69L246.34 125.92L249.34 127.1L251.85 126.1L253.11 126.6L250.6 127.6L253.76 128.84L256.97 127.57L258.2 128.06L254.05 129.71L244.08 125.81L248.15 124.19V124.18Z" fill="white"/>
          <path d="M260.19 127.27L250.33 123.31L252.12 122.6C253.38 122.1 255.42 121.83 257.44 122.66L257.76 122.79C259.14 123.36 259.32 123.94 258.72 124.46L258.67 124.48L264.82 125.44L263.75 125.86L257.82 124.93L256.99 125.26L261.09 126.91L260.19 127.27ZM255.78 124.76L256.7 124.39C257.53 124.06 257.88 123.59 256.81 123.15L256.49 123.02C255.32 122.54 254.25 122.74 253.44 123.07L252.52 123.44L255.78 124.76Z" fill="white"/>
          <path d="M258.21 120.17L259.33 119.72L271.06 122.96L270.15 123.32L267.07 122.46L264.79 123.37L266.81 124.64L265.93 124.99L258.22 120.16L258.21 120.17ZM263.82 122.78L265.62 122.07L260.09 120.52L263.82 122.78Z" fill="white"/>
          <path d="M263.02 119.27L261.77 118.74L266.79 116.74L268.03 117.27L266.02 118.07L274.38 121.64L273.42 122.02L265.05 118.46L263.04 119.26L263.02 119.27Z" fill="white"/>
          <path d="M278.07 120.18L276.87 119.66L278.39 119.06L271.33 115.98L269.9 116.55L268.65 116.01L272.58 114.45L273.82 115L272.31 115.6L279.36 118.69L280.95 118.06L282.14 118.59L278.07 120.2V120.18Z" fill="white"/>
          <path d="M276.77 112.67C278.22 112.09 280.7 112.45 283.25 113.61L284.61 114.23C287.12 115.37 287.8 116.42 286.39 116.98C284.98 117.54 282.5 117.2 279.99 116.08L278.61 115.47C276.01 114.31 275.31 113.25 276.76 112.67H276.77ZM280.94 115.7C282.88 116.57 284.45 116.83 285.31 116.49C286.17 116.15 285.58 115.48 283.65 114.6L282.28 113.98C280.45 113.15 278.82 112.79 277.87 113.16C276.92 113.53 277.71 114.24 279.56 115.08L280.93 115.69L280.94 115.7Z" fill="white"/>
          <path d="M290.35 115.32L281.05 111.07L282.17 110.62L291.39 112.89L284.49 109.7L285.44 109.32L294.66 113.61L293.67 114L283.98 111.62L291.27 114.95L290.34 115.32H290.35Z" fill="white"/>
          <path d="M235.98 154.25L237.2 154.72L233.88 156.03L236.87 157.2L239.54 156.15L240.76 156.63L238.09 157.68L242.27 159.31L241.29 159.7L231.69 155.94L235.98 154.25Z" fill="white"/>
          <path d="M247.66 157.17L246.42 156.69L247.95 156.08L240.79 153.31L239.37 153.87L238.14 153.39L242.03 151.86L243.26 152.34L241.77 152.93L248.93 155.7L250.54 155.06L251.78 155.54L247.66 157.17Z" fill="white"/>
          <path d="M253.81 154.74L244.16 151.02L245.26 150.59L254.7 152.43L247.54 149.69L248.47 149.32L258.13 153.02L257.14 153.41L247.12 151.44L254.73 154.36L253.8 154.73L253.81 154.74Z" fill="white"/>
          <path d="M251.26 149.17L250.04 148.7L255 146.74L256.22 147.21L254.22 148L262.68 151.22L261.71 151.61L253.26 148.38L251.26 149.17Z" fill="white"/>
          <path d="M260.7 144.51L261.93 144.97L258.84 146.19L261.73 147.28L264.26 146.28L265.49 146.75L262.96 147.75L266.07 148.93L269.33 147.64L270.57 148.11L266.34 149.78L256.65 146.1L260.71 144.5L260.7 144.51Z" fill="white"/>
          <path d="M264.9 142.74C265.97 142.32 267.63 142.27 269.89 142.87L269.53 143.34C267.72 142.89 266.81 142.93 266.12 143.2C265.09 143.6 265.78 144.27 267.91 145.07L268.79 145.4C270.96 146.21 272.62 146.42 273.66 146.01C274.53 145.66 273.99 145.13 273.13 144.62L274.38 144.46C275.58 145.2 276.17 145.98 274.9 146.48C273.3 147.11 270.69 146.86 267.81 145.78L266.92 145.44C264.92 144.68 263.01 143.47 264.88 142.74H264.9Z" fill="white"/>
          <path d="M278.57 144.94L268.83 141.3L269.76 140.93L274.02 142.52L276.54 141.52L272.27 139.93L273.2 139.56L282.95 143.19L282.02 143.56L277.8 141.99L275.28 142.99L279.49 144.56L278.55 144.93L278.57 144.94Z" fill="white"/>
          <path d="M291.36 156.38L292.61 156.93L289.51 158.17L292.47 159.48L295.02 158.46L296.29 159.02L293.74 160.05L296.97 161.48L300.27 160.15L301.57 160.72L297.28 162.45L287.3 158.03L291.37 156.4L291.36 156.38Z" fill="white"/>
          <path d="M293.36 155.58L294.62 155.08L301.27 157.21L301.46 157.13L296.54 154.32L297.8 153.82L307.94 158.14L307 158.52L299.32 155.12L299.13 155.2L304.1 158.16L303.61 158.36L296.6 156.21L296.41 156.29L304.3 159.62L303.43 159.97L293.36 155.61V155.58Z" fill="white"/>
          <path d="M299.71 153.04L301.72 152.24C302.98 151.74 304.99 151.71 307.11 152.59C309.29 153.5 309.12 154.3 307.85 154.81L306.75 155.25L310.81 156.96L309.88 157.34L299.71 153.04ZM306.62 154.25C307.46 153.91 307.3 153.45 306.14 152.96C304.9 152.44 303.82 152.42 303.02 152.74L301.88 153.2L305.47 154.71L306.62 154.25Z" fill="white"/>
          <path d="M306.08 150.49L307.02 150.11L315.97 153.78L318.94 152.58L320.28 153.12L316.35 154.71L306.08 150.48V150.49Z" fill="white"/>
          <path d="M313.51 147.42C314.9 146.86 317.46 147.2 320.26 148.31L321.78 148.91C324.63 150.04 325.56 151.1 324.17 151.67C322.78 152.24 320.08 151.88 317.27 150.75L315.76 150.14C312.95 149.01 312.13 147.98 313.52 147.42H313.51ZM318.19 150.37C320.36 151.24 322.06 151.51 322.91 151.17C323.76 150.83 323.01 150.15 320.83 149.28L319.31 148.68C317.31 147.88 315.59 147.53 314.68 147.9C313.77 148.27 314.66 148.94 316.67 149.76L318.18 150.37H318.19Z" fill="white"/>
          <path d="M316.76 146.23L317.83 145.8L323.82 146.94L320.78 144.62L321.75 144.23L325.82 147.35L330.26 149.1L329.31 149.48L324.92 147.76L316.75 146.22L316.76 146.23Z" fill="white"/>
          <path d="M327.26 142.03L328.58 142.53L325.59 143.73L328.71 144.93L331.17 143.94L332.51 144.45L330.05 145.44L33.46 146.75L336.64 145.47L338.01 145.99L333.87 147.66L323.34 143.6L327.27 142.03H327.26Z" fill="white"/>
          <path d="M333.23 139.64L334.56 140.13L331.59 141.32L334.73 142.5L337.17 141.52L338.52 142.02L336.07 143L339.5 144.29L342.66 143.01L344.04 143.52L339.92 145.18L329.3 141.19L333.2 139.63L333.23 139.64Z" fill="white"/>
          <path d="M342.96 141.2C344.28 141.65 345.87 141.84 346.84 141.45C347.59 141.15 347.41 140.65 346.32 140.26C343.41 139.2 342.07 141.4 338.02 139.91C336.43 139.33 335.94 138.46 337.09 138C338.24 137.54 340.18 137.71 342.01 138.1L341.7 138.61C340.48 138.32 339.25 138.16 338.42 138.49C337.79 138.74 337.83 139.17 338.76 139.51C341.52 140.52 342.86 138.32 347.11 139.85C348.94 140.51 349.52 141.42 348.22 141.95C346.83 142.51 344.69 142.38 342.62 141.74L342.95 141.19L342.96 141.2Z" fill="white"/>
        </g>
        <path d="M381.45 136.65L251.48 188.16L121.5 136.65L251.48 85.1499L381.45 136.65Z" stroke="#0A649B" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </g>
      <g opacity="0.4" filter="url(#filter1_f_6432_641)" style={{ pointerEvents: 'none' }}>
        <path d="M344 224.504L251.504 261L159 224.504L251.504 188L344 224.504Z" fill="#01162A"/>
      </g>
      <g opacity="0.4" filter="url(#filter2_f_6432_641)" style={{ pointerEvents: 'none' }}>
        <path d="M344 133.504L251.504 170L159 133.504L251.504 97L344 133.504Z" fill="#01162A"/>
      </g>
      <g className={`cg-iso-layer-container ${visualIndex === 0 ? 'active' : ''}`} data-layer="0" onClick={() => setActiveIndex(0)} onMouseEnter={() => setHoveredIndex(0)}>
        <g fill="transparent" stroke="transparent">
          <path d="M121.5 52.01V57.64L251.48 109.15V103.51L121.5 52.01Z" />
          <path d="M251.48 109.15V103.51L381.45 52.01V57.64L251.48 109.15Z" />
          <path d="M381.45 52.01L251.48 103.51L121.5 52.01L251.48 0.5L381.45 52.01Z" />
        </g>
        <g className="cg-iso-layer">
          <path d="M121.5 52.01V57.64L251.48 109.15V103.51L121.5 52.01Z" fill="url(#paint15_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M251.48 109.15V103.51L381.45 52.01V57.64L251.48 109.15Z" fill="url(#paint16_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M381.45 52.01L251.48 103.51L121.5 52.01L251.48 0.5L381.45 52.01Z" fill="url(#paint17_linear_6432_641)" stroke="#305C86" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M270.107 41.1623C267.487 40.1423 264.417 39.3523 260.967 38.8023C260.937 38.8023 260.907 38.7923 260.867 38.7823C260.827 38.7723 260.797 38.7823 260.767 38.7723C257.317 38.2323 253.697 37.9723 250.007 38.0023C246.407 38.0323 242.907 38.3323 239.587 38.9023C236.267 39.4723 233.317 40.2723 230.807 41.2823C228.207 42.3323 226.207 43.5623 224.857 44.9423C223.507 46.3323 222.887 47.7723 223.017 49.2423C223.137 50.6523 223.957 52.0323 225.427 53.3323C226.897 54.6323 228.957 55.7823 231.547 56.7623C234.217 57.7723 237.347 58.5523 240.827 59.0823C244.307 59.6123 247.937 59.8523 251.627 59.8123C255.187 59.7723 258.647 59.4623 261.917 58.8923C265.097 58.3423 267.937 57.5723 270.377 56.6123L270.577 56.5323C273.137 55.4923 275.127 54.2823 276.477 52.9223C277.827 51.5623 278.467 50.1323 278.377 48.6823C278.287 47.2823 277.517 45.9123 276.097 44.6123C274.667 43.3123 272.657 42.1523 270.097 41.1623H270.107ZM254.057 43.9023C251.757 46.2323 245.077 47.3823 239.147 46.4623L228.707 44.8523C231.987 42.8223 240.927 42.0423 250.867 43.0023C252.227 43.1323 253.637 43.1223 254.967 42.9823L254.057 43.9123V43.9023ZM254.297 48.3623C254.917 48.9223 255.747 49.4323 256.737 49.8723C255.247 49.9323 253.767 50.0823 252.357 50.3323C250.937 50.5723 249.657 50.9023 248.527 51.2923C248.367 50.7023 247.967 50.1223 247.347 49.5623C246.717 49.0023 245.897 48.4923 244.897 48.0523C246.397 47.9923 247.877 47.8423 249.297 47.5923C250.717 47.3523 252.007 47.0223 253.127 46.6323C253.287 47.2223 253.677 47.8023 254.307 48.3623H254.297ZM240.657 53.3523C231.717 51.4023 226.467 48.4423 227.507 46.0623L237.947 47.6723C240.827 48.1123 243.097 48.9723 244.337 50.0823C245.577 51.1923 245.647 52.4223 244.547 53.5423L243.637 54.4623C242.907 54.0023 241.887 53.6223 240.657 53.3523ZM247.607 54.0023C248.717 52.8823 250.867 51.9923 253.677 51.5123C256.477 51.0323 259.597 51.0023 262.447 51.4423L272.717 53.0223C269.467 55.0323 260.647 55.8223 250.787 54.8923C249.427 54.7623 248.027 54.7723 246.697 54.9223L247.607 54.0023ZM260.987 44.5723C269.837 46.5323 274.967 49.4823 273.897 51.8323L263.627 50.2423C260.777 49.8023 258.527 48.9523 257.297 47.8423C256.067 46.7323 255.997 45.5023 257.107 44.3723L258.017 43.4423C258.747 43.9023 259.757 44.2923 260.977 44.5623L260.987 44.5723ZM250.107 39.3123C252.837 39.2923 255.527 39.4423 258.127 39.7723L257.357 40.5523C256.467 41.4523 254.007 41.9623 251.627 41.7323C245.737 41.1623 239.867 41.1423 235.097 41.6623C234.857 41.6923 234.627 41.7123 234.397 41.7423C236.327 41.0623 238.517 40.5123 240.927 40.0923C243.847 39.5923 246.937 39.3223 250.097 39.3023L250.107 39.3123ZM228.447 52.8123C227.377 51.8723 226.707 50.8823 226.447 49.8623C226.567 49.9423 226.687 50.0223 226.817 50.1123C229.427 51.7723 233.777 53.3223 239.077 54.4723C241.207 54.9423 242.157 55.9623 241.277 56.8623L240.517 57.6323C238.047 57.1823 235.807 56.5823 233.847 55.8323C231.567 54.9723 229.757 53.9523 228.457 52.8123H228.447ZM251.537 58.5323C248.827 58.5623 246.157 58.4223 243.557 58.1023L244.317 57.3323C245.197 56.4423 247.647 55.9323 250.017 56.1523C255.857 56.7023 261.657 56.7123 266.367 56.1823C266.597 56.1523 266.827 56.1323 267.057 56.1023C265.147 56.7723 262.987 57.3223 260.617 57.7323C257.737 58.2323 254.677 58.5023 251.537 58.5423V58.5323ZM273.107 45.1223C274.147 46.0623 274.787 47.0523 275.027 48.0623C274.907 47.9823 274.787 47.9023 274.667 47.8123C272.127 46.1523 267.837 44.6023 262.587 43.4323C260.457 42.9623 259.527 41.9223 260.417 41.0223L261.187 40.2423C263.647 40.7023 265.877 41.3223 267.817 42.0723C270.067 42.9423 271.847 43.9723 273.107 45.1123V45.1223Z" fill="#0264A0"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_f_6432_641" x="125" y="238" width="253" height="141" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="17" result="effect1_foregroundBlur_6432_641"/>
        </filter>
        <filter id="filter1_f_6432_641" x="125" y="154" width="253" height="141" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="17" result="effect1_foregroundBlur_6432_641"/>
        </filter>
        <filter id="filter2_f_6432_641" x="125" y="63" width="253" height="141" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="17" result="effect1_foregroundBlur_6432_641"/>
        </filter>
        <linearGradient id="paint0_linear_6432_641" x1="121.5" y1="503.83" x2="251.48" y2="503.83" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint1_linear_6432_641" x1="251.48" y1="503.83" x2="381.45" y2="503.83" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint2_linear_6432_641" x1="186.488" y1="540.246" x2="316.469" y2="410.265" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint3_linear_6432_641" x1="121" y1="419.18" x2="122" y2="419.18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint4_linear_6432_641" x1="251.48" y1="419.18" x2="381.45" y2="419.18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint5_linear_6432_641" x1="251.475" y1="339.1" x2="251.475" y2="442.12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#003F6F"/>
          <stop offset="1" stopColor="#0091FF"/>
        </linearGradient>
        <linearGradient id="paint6_linear_6432_641" x1="121" y1="334.53" x2="122" y2="334.53" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint7_linear_6432_641" x1="251.48" y1="334.53" x2="381.45" y2="334.53" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint8_linear_6432_641" x1="273.804" y1="305.955" x2="121.5" y2="305.955" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F8DFF"/>
          <stop offset="0.735577" stopColor="#983B3B"/>
          <stop offset="1" stopColor="#0B6D18"/>
        </linearGradient>
        <linearGradient id="paint9_linear_6432_641" x1="121" y1="249.88" x2="122" y2="249.88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint10_linear_6432_641" x1="251.48" y1="249.88" x2="381.45" y2="249.88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint11_linear_6432_641" x1="251.475" y1="169.8" x2="251.475" y2="272.81" gradientUnits="userSpaceOnUse">
          <stop stopColor="#003F6F"/>
          <stop offset="1" stopColor="#0091FF"/>
        </linearGradient>
        <linearGradient id="paint12_linear_6432_641" x1="121" y1="165.22" x2="122" y2="165.22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint13_linear_6432_641" x1="251.48" y1="165.22" x2="381.45" y2="165.22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint14_linear_6432_641" x1="251.475" y1="85.1499" x2="251.475" y2="188.16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#003F6F"/>
          <stop offset="1" stopColor="#0091FF"/>
        </linearGradient>
        <linearGradient id="paint15_linear_6432_641" x1="121" y1="80.58" x2="122" y2="80.58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint16_linear_6432_641" x1="251.48" y1="80.58" x2="381.45" y2="80.58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
        <linearGradient id="paint17_linear_6432_641" x1="186.495" y1="116.996" x2="316.469" y2="-12.977" gradientUnits="userSpaceOnUse">
          <stop stopColor="#01162A"/>
          <stop offset="1" stopColor="#0A3258"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

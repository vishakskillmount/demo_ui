// Original flat illustrations for course thumbnails. Drawn on a solid tone so they read on black.
const INK = "#0a0a0a";

const shapes = {
  waves: (
    <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
      <path d="M-10 118 C40 60 80 60 120 100 S210 140 250 70 330 40 350 60" />
      <path d="M-10 142 C40 90 80 90 120 124 S210 160 250 100 330 70 350 86" opacity=".45" />
      <circle cx="250" cy="70" r="11" fill={INK} />
      <rect x="46" y="26" width="46" height="46" rx="12" transform="rotate(-14 69 49)" fill="#fff" stroke="none" />
      <path d="M59 49h20M69 39v20" />
    </g>
  ),
  orbit: (
    <g fill="none" stroke={INK} strokeWidth="3">
      <ellipse cx="170" cy="86" rx="120" ry="40" transform="rotate(-18 170 86)" />
      <ellipse cx="170" cy="86" rx="120" ry="40" transform="rotate(42 170 86)" opacity=".45" />
      <circle cx="170" cy="86" r="28" fill={INK} />
      <circle cx="66" cy="112" r="12" fill="#fff" stroke="none" />
      <circle cx="262" cy="44" r="8" fill={INK} />
    </g>
  ),
  hex: (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round" fill="none">
      <path d="M118 40l34 20v40l-34 20-34-20V60z" fill={INK} />
      <path d="M186 40l34 20v40l-34 20-34-20V60z" />
      <path d="M220 100l34 20v40l-34 20-34-20v-40z" opacity=".45" />
      <path d="M220 60l34-20M84 100l-34 20" />
      <circle cx="262" cy="36" r="12" fill="#fff" />
      <circle cx="42" cy="124" r="9" fill={INK} />
    </g>
  ),
  cells: (
    <g fill="none" stroke={INK} strokeWidth="3">
      <circle cx="122" cy="82" r="52" />
      <circle cx="214" cy="96" r="38" fill="#fff" />
      <circle cx="108" cy="70" r="19" fill={INK} />
      <circle cx="224" cy="102" r="11" fill={INK} />
      <circle cx="140" cy="108" r="6" fill={INK} />
      <circle cx="266" cy="38" r="14" opacity=".45" />
      <circle cx="46" cy="136" r="22" opacity=".45" />
    </g>
  ),
  grid: (
    <g stroke={INK} strokeWidth="3">
      {[0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4].map((c) => (
        <rect key={`${r}-${c}`} x={46 + c * 48} y={22 + r * 46} width="36" height="34" rx="9"
          fill={(r + c * 2) % 5 === 0 ? INK : (r * 3 + c) % 7 === 0 ? "#fff" : "none"} />
      )))}
    </g>
  ),
  pages: (
    <g stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="86" y="34" width="104" height="128" rx="10" transform="rotate(-12 138 98)" fill="none" />
      <rect x="138" y="26" width="104" height="128" rx="10" transform="rotate(8 190 90)" fill="#fff" />
      <g transform="rotate(8 190 90)"><path d="M158 54h64M158 74h64M158 94h42" fill="none" /></g>
      <circle cx="60" cy="48" r="14" fill={INK} />
    </g>
  ),
};

export default function CourseArt({ course }) {
  return (
    <svg className={`art fill-${course.tone}`} viewBox="0 0 320 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="art-shapes">{shapes[course.art]}</g>
    </svg>
  );
}

// Hand-drawn line-art scene (not a stock photo) so it matches the rest of the
// app's minimal icon language and carries zero licensing risk.
export default function PullingScene() {
  return (
    <svg
      viewBox="0 0 240 120"
      className="mx-auto mb-5 h-28 w-full max-w-xs text-navy"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="102" x2="232" y2="102" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />

      {/* motion lines behind the dog */}
      <line x1="14" y1="72" x2="26" y2="68" strokeOpacity="0.35" strokeWidth="3" />
      <line x1="18" y1="84" x2="30" y2="81" strokeOpacity="0.35" strokeWidth="3" />
      <line x1="22" y1="96" x2="34" y2="94" strokeOpacity="0.35" strokeWidth="3" />

      {/* dog, leaning forward mid-pull */}
      <ellipse cx="72" cy="80" rx="36" ry="15" transform="rotate(-10 72 80)" />
      <circle cx="112" cy="64" r="13" />
      <path d="M123 68 q9 3 12 9" />
      <path d="M104 53 q-2 -8 4 -10" />
      <circle cx="117" cy="61" r="1.6" fill="currentColor" stroke="none" />
      <path d="M42 90 q-10 6 -16 4" />
      <path d="M52 96 l-6 14" />
      <path d="M68 98 l-4 15" />
      <path d="M92 96 l6 14" />
      <path d="M104 92 l10 12" />

      {/* taut leash */}
      <path d="M122 62 q30 -6 62 -10" strokeWidth="3" />

      {/* person leaning back, digging heels in */}
      <circle cx="200" cy="30" r="11" />
      <path d="M198 41 q-4 20 -6 34" />
      <path d="M195 48 q-9 3 -14 9" />
      <path d="M191 75 l-16 24" />
      <path d="M192 75 l14 25" />
    </svg>
  );
}

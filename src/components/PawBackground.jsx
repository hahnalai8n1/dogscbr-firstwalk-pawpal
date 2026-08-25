import { PawPrint } from "lucide-react";

// Fixed, hand-placed paw prints so nothing shifts on re-render.
// Mirrors the scattered-paw-print motif from dogscbr.org's own banner.
const PAWS = [
  { top: "6%", left: "4%", size: 28, rotate: -18 },
  { top: "14%", left: "88%", size: 22, rotate: 24 },
  { top: "42%", left: "2%", size: 18, rotate: 10 },
  { top: "68%", left: "92%", size: 26, rotate: -30 },
  { top: "86%", left: "8%", size: 20, rotate: 16 },
  { top: "92%", left: "80%", size: 24, rotate: -12 },
];

export default function PawBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {PAWS.map((p, i) => (
        <PawPrint
          key={i}
          className="absolute text-navy/[0.07]"
          style={{ top: p.top, left: p.left, transform: `rotate(${p.rotate}deg)` }}
          size={p.size}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

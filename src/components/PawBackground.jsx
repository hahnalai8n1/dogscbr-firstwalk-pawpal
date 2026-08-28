import { PawPrint } from "lucide-react";

// Fixed, hand-placed paw prints so nothing shifts on re-render.
// Mirrors the scattered-paw-print motif from dogscbr.org's own banner.
const PAWS = [
  { top: "6%", left: "4%", size: 28, rotate: -18 },
  { top: "10%", left: "34%", size: 16, rotate: 8 },
  { top: "14%", left: "88%", size: 22, rotate: 24 },
  { top: "22%", left: "62%", size: 18, rotate: -22 },
  { top: "30%", left: "16%", size: 14, rotate: 30 },
  { top: "42%", left: "2%", size: 18, rotate: 10 },
  { top: "38%", left: "96%", size: 16, rotate: -14 },
  { top: "54%", left: "44%", size: 15, rotate: 18 },
  { top: "62%", left: "24%", size: 20, rotate: -8 },
  { top: "68%", left: "92%", size: 26, rotate: -30 },
  { top: "74%", left: "56%", size: 16, rotate: 26 },
  { top: "86%", left: "8%", size: 20, rotate: 16 },
  { top: "80%", left: "38%", size: 14, rotate: -20 },
  { top: "92%", left: "80%", size: 24, rotate: -12 },
  { top: "96%", left: "18%", size: 16, rotate: 12 },
  { top: "4%", left: "56%", size: 14, rotate: -6 },
  { top: "18%", left: "8%", size: 16, rotate: 20 },
  { top: "26%", left: "78%", size: 20, rotate: -16 },
  { top: "34%", left: "48%", size: 14, rotate: 12 },
  { top: "46%", left: "84%", size: 16, rotate: -24 },
  { top: "50%", left: "6%", size: 18, rotate: 8 },
  { top: "58%", left: "68%", size: 14, rotate: -10 },
  { top: "66%", left: "36%", size: 16, rotate: 22 },
  { top: "78%", left: "62%", size: 18, rotate: -18 },
  { top: "88%", left: "48%", size: 14, rotate: 14 },
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

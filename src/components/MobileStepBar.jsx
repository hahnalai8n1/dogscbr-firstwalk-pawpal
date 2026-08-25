import { useLocation } from "react-router-dom";
import { steps } from "../lib/steps";

export default function MobileStepBar() {
  const location = useLocation();
  const currentIndex = steps.findIndex((s) => s.path === location.pathname);
  const step = steps[currentIndex];
  if (!step) return null;
  const pct = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="lg:hidden sticky top-0 z-20 border-b border-sand/70 bg-cream-light/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-navy/60">
        <span>
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span>{step.label}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand/60">
        <div className="h-full rounded-full bg-amber transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

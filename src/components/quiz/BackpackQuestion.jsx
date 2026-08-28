import { useRef } from "react";
import { motion } from "framer-motion";
import { Backpack, Check, X } from "lucide-react";

export default function BackpackQuestion({ options, selected, status, correct, onToggle, disabled }) {
  const bagRef = useRef(null);

  function handleDragEnd(id, event, info) {
    const bag = bagRef.current?.getBoundingClientRect();
    if (!bag) return;
    const { x, y } = info.point;
    const inside = x >= bag.left && x <= bag.right && y >= bag.top && y <= bag.bottom;
    const alreadyPacked = selected.includes(id);
    if (inside && !alreadyPacked) onToggle(id);
  }

  return (
    <div>
      <div className="relative mb-6 flex justify-center">
        <div
          ref={bagRef}
          className="flex h-40 w-40 flex-col items-center justify-center rounded-3xl border-4 border-dashed border-navy/25 bg-tan/20"
        >
          <Backpack size={30} className="mb-2 text-navy/40" />
          <div className="flex flex-wrap justify-center gap-1.5 px-3">
            {options
              .filter((o) => selected.includes(o.id))
              .map((o) => {
                const Icon = o.icon;
                return (
                  <span
                    key={o.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-cream"
                  >
                    <Icon size={14} />
                  </span>
                );
              })}
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-navy/40">
            tap or drag items here
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected.includes(opt.id);
          const isCorrectOpt = correct.includes(opt.id);
          const revealCorrect = status === "wrong" && isCorrectOpt;
          const revealWrong = status === "wrong" && isSelected && !isCorrectOpt;
          const locked = status === "correct" && isCorrectOpt;

          return (
            <motion.button
              key={opt.id}
              type="button"
              drag={!disabled}
              dragSnapToOrigin
              dragElastic={0.4}
              whileDrag={{ scale: 1.1, zIndex: 20 }}
              onDragEnd={(event, info) => handleDragEnd(opt.id, event, info)}
              onClick={() => !disabled && onToggle(opt.id)}
              disabled={disabled}
              className={`relative flex w-20 cursor-grab flex-col items-center gap-1.5 rounded-2xl border-2 bg-white px-2 py-3 text-center text-xs font-medium shadow-sm active:cursor-grabbing ${
                locked
                  ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                  : revealWrong
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : revealCorrect
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                  : isSelected
                  ? "border-navy bg-navy/5 text-navy opacity-40"
                  : "border-sand text-navy/80"
              }`}
            >
              {revealWrong && <X size={12} className="absolute right-1 top-1 text-rose-500" />}
              {(locked || revealCorrect) && (
                <Check size={12} className="absolute right-1 top-1 text-emerald-500" />
              )}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tan/50 text-navy">
                <Icon size={18} />
              </span>
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

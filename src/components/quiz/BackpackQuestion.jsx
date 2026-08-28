import { AnimatePresence, motion } from "framer-motion";
import { Backpack, Check, X } from "lucide-react";

export default function BackpackQuestion({ options, selected, status, correct, onToggle, disabled }) {
  return (
    <div>
      <div className="relative mb-6 flex justify-center">
        <div
          className="relative flex h-44 w-44 items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label={selected.length ? `Packed: ${options.filter((option) => selected.includes(option.id)).map((option) => option.label).join(", ")}` : "Backpack is empty"}
        >
          <Backpack
            aria-hidden="true"
            size={172}
            strokeWidth={1.35}
            className="absolute inset-0 text-navy"
          />
          <div className="absolute inset-x-9 top-[4.35rem] flex min-h-14 flex-wrap content-center justify-center gap-1.5 px-1">
            <AnimatePresence initial={false}>
              {options
                .filter((option) => selected.includes(option.id))
                .map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.span
                      key={option.id}
                      initial={{ opacity: 0, scale: 0.5, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -8 }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-navy shadow-sm"
                      aria-hidden="true"
                    >
                      <Icon size={17} />
                    </motion.span>
                  );
                })}
            </AnimatePresence>
          </div>
          <p className="absolute -bottom-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-navy/45" aria-hidden="true">
            Tap an option to pack or unpack it
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4" role="group" aria-label="Items to pack for the walk">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected.includes(opt.id);
          const isCorrectOpt = correct.includes(opt.id);
          const revealCorrect = status === "wrong" && isCorrectOpt;
          const revealWrong = status === "wrong" && isSelected && !isCorrectOpt;
          const locked = status === "correct" && isCorrectOpt;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => !disabled && onToggle(opt.id)}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`${opt.label}${revealWrong ? ", incorrect" : ""}${locked || revealCorrect ? ", correct" : ""}`}
              className={`relative flex w-20 flex-col items-center gap-1.5 rounded-2xl border-2 bg-white px-2 py-3 text-center text-xs font-medium shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/50 ${
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
              {revealWrong && <X aria-hidden="true" size={12} className="absolute right-1 top-1 text-rose-500" />}
              {(locked || revealCorrect) && (
                <Check aria-hidden="true" size={12} className="absolute right-1 top-1 text-emerald-500" />
              )}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tan/50 text-navy">
                <Icon size={18} />
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

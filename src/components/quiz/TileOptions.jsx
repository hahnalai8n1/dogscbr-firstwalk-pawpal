import { Check, X } from "lucide-react";

export default function TileOptions({ options, selected, status, correct, onToggle, disabled }) {
  const cols = options.length > 3 ? "sm:grid-cols-2" : options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 ${cols} gap-3`}>
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
            onClick={() => onToggle(opt.id)}
            disabled={disabled}
            className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center text-sm font-medium transition-colors ${
              locked
                ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                : revealWrong
                ? "border-rose-300 bg-rose-50 text-rose-700"
                : revealCorrect
                ? "border-emerald-300 bg-emerald-50/60 text-emerald-800"
                : isSelected
                ? "border-navy bg-navy/5 text-navy"
                : "border-sand bg-white text-navy/80 hover:border-navy/30"
            }`}
          >
            {revealWrong && <X size={14} className="absolute right-2 top-2 text-rose-500" />}
            {(locked || revealCorrect) && (
              <Check size={14} className="absolute right-2 top-2 text-emerald-500" />
            )}
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                isSelected || locked ? "bg-navy text-cream" : "bg-tan/50 text-navy"
              }`}
            >
              <Icon size={20} />
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

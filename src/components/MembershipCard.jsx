import { motion } from "framer-motion";
import { PawPrint, User } from "lucide-react";

export default function MembershipCard({ name, cmNumber, since }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 160, damping: 14 }}
      className="relative w-full max-w-sm select-none overflow-hidden rounded-2xl bg-navy p-5 text-cream shadow-2xl shadow-navy/30"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#fff5df 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber/20" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-display text-sm font-extrabold tracking-wide">
          <PawPrint size={16} className="text-amber" />
          DOGS CANBERRA
        </div>
        <span className="rounded-full bg-amber/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber">
          Community Member
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream/10 ring-2 ring-cream/30">
          <User size={26} className="text-cream/80" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold leading-tight">{name}</p>
          <p className="text-xs text-cream/60">Member since {since}</p>
        </div>
      </div>

      <div className="relative mt-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-cream/50">Member No.</p>
          <p className="font-display text-2xl font-extrabold tracking-widest text-amber">{cmNumber}</p>
        </div>
        <div className="flex items-end gap-[3px]">
          {[3, 5, 2, 6, 4, 2, 5, 3, 6, 2, 4].map((h, i) => (
            <span key={i} className="w-[3px] bg-cream/40" style={{ height: `${h * 3}px` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

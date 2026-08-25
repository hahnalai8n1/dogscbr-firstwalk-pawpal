import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, Check, PawPrint, Dog } from "lucide-react";
import Button from "../components/Button";
import PawBackground from "../components/PawBackground";
import { useWizard } from "../context/WizardContext";

export default function Confirmation() {
  const { state } = useWizard();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state.cmNumber) return;
    const timer = setInterval(() => {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0 },
        startVelocity: 35,
      });
    }, 500);
    const stop = setTimeout(() => clearInterval(timer), 1600);
    return () => {
      clearInterval(timer);
      clearTimeout(stop);
    };
  }, [state.cmNumber]);

  if (!state.cmNumber) return <Navigate to="/" replace />;

  function copyNumber() {
    navigator.clipboard.writeText(state.cmNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PawBackground />
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-14 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 12 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy text-cream shadow-xl"
        >
          <Dog size={36} />
        </motion.div>

        <p className="mb-2 flex items-center gap-1 font-display text-sm font-bold uppercase tracking-widest text-amber">
          <PawPrint size={14} /> Application complete
        </p>
        <h1 className="font-display text-4xl font-extrabold text-navy sm:text-5xl">
          Welcome to the pack, {state.step0.fullName.split(" ")[0]}!
        </h1>
        <p className="mt-3 max-w-md text-navy/70">
          Your induction, OHS quiz, ID and signature are all on file. Here's your Community
          Member number — you'll need it to book walks.
        </p>

        <button
          onClick={copyNumber}
          className="mt-8 flex items-center gap-3 rounded-2xl border-2 border-dashed border-navy/30 bg-white px-8 py-5 font-display text-3xl font-extrabold tracking-wide text-navy transition-colors hover:border-navy"
        >
          {state.cmNumber}
          {copied ? <Check size={22} className="text-emerald-500" /> : <Copy size={20} className="text-navy/40" />}
        </button>

        <div className="mt-10 w-full rounded-2xl border border-sand bg-cream-light p-5 text-left text-sm text-navy/70">
          <p className="mb-2 font-display font-bold text-navy">One more (human!) step</p>
          <p>
            Your very first walk with any dog is always supervised by a DogsCBR staff member —
            that's where we do a quick chat about your experience and answer any questions. After
            that, you're free to book walks solo any time.
          </p>
        </div>

        <a href="https://www.dogscbr.org/dogs.html" target="_blank" rel="noreferrer" className="mt-8">
          <Button variant="secondary">Browse dogs & book your first walk</Button>
        </a>
      </div>
    </div>
  );
}

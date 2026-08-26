import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PawPrint, IdCard, MessageCircle, Backpack, MapPin } from "lucide-react";
import Button from "../components/Button";
import MembershipCard from "../components/MembershipCard";
import { useWizard } from "../context/WizardContext";

const CHECKLIST = [
  {
    icon: IdCard,
    title: "Bring the same photo ID",
    body: "Staff will check it matches what you uploaded, then hold onto it until you return the dog.",
  },
  {
    icon: MessageCircle,
    title: "A quick chat first",
    body: "About your experience with dogs and anything you flagged in your application.",
  },
  {
    icon: Backpack,
    title: "Gear fitting & basics",
    body: "We'll fit the harness, hand over water, treats and poop bags, and show you the walking basics.",
  },
  {
    icon: MapPin,
    title: "A short supervised walk",
    body: "15–30 minutes together nearby. After that, you're free to book solo, any time.",
  },
];

export default function Confirmation() {
  const { state } = useWizard();

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

  const since = new Date(state.submittedAt || Date.now()).toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });

  return (
    <div>
      <div className="text-center">
        <p className="mb-2 flex items-center justify-center gap-1 font-display text-sm font-bold uppercase tracking-widest text-amber">
          <PawPrint size={14} /> Application complete
        </p>
        <h1 className="font-display text-4xl font-extrabold text-navy sm:text-5xl">
          Welcome to the pack, {state.step0.fullName.split(" ")[0]}!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-navy/70">
          Your induction, OHS quiz, ID and signature are all on file. Here's your membership —
          you'll need your number to book walks.
        </p>
      </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="flex justify-center md:justify-end md:pr-2">
            <MembershipCard name={state.step0.fullName} cmNumber={state.cmNumber} since={since} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-sand bg-white/80 p-5 backdrop-blur"
          >
            <p className="mb-4 font-display font-bold text-navy">
              What happens at your first walk
            </p>
            <ul className="space-y-4">
              {CHECKLIST.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tan/50 text-navy">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">{title}</p>
                    <p className="text-sm text-navy/60">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <a href="https://www.dogscbr.org/dogs.html" target="_blank" rel="noreferrer">
          <Button variant="secondary">Browse dogs & book your first walk</Button>
        </a>
        <p className="text-xs text-navy/40">
          Pick any dog and time that suits you — no need to wait for us to reach out.
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import PageShell from "../components/PageShell";
import Button from "../components/Button";
import GuideAssistant from "../components/GuideAssistant";
import { useWizard } from "../context/WizardContext";
import { guideCards } from "../lib/guideCards";

export default function OhsGuide() {
  const { state, update } = useWizard();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const lastCard = index === guideCards.length - 1;
  const card = guideCards[index];
  const Icon = card.icon;

  function go(delta) {
    const next = index + delta;
    if (next < 0 || next >= guideCards.length) return;
    setDirection(delta);
    setIndex(next);
  }

  function handleDragEnd(_, info) {
    if (info.offset.x < -80) go(1);
    else if (info.offset.x > 80) go(-1);
  }

  return (
    <>
    <PageShell
      eyebrow="Step 2 of 6"
      title="OHS Guidelines"
      subtitle="Swipe (or click) through — this is exactly what we quiz you on next."
      onNext={() => navigate("/apply/quiz")}
      nextDisabled={!state.ohsGuideRead}
      nextLabel={state.ohsGuideRead ? "I'm ready — take the quiz" : "Read all cards to continue"}
    >
      <div className="flex items-center justify-center gap-1.5 pb-6">
        {guideCards.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-navy" : i < index ? "w-1.5 bg-amber" : "w-1.5 bg-sand"
            }`}
          />
        ))}
      </div>

      <div className="relative h-72 select-none">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            initial={{ x: direction > 0 ? 120 : -120, opacity: 0, rotate: direction > 0 ? 6 : -6 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: direction > 0 ? -120 : 120, opacity: 0, rotate: direction > 0 ? -6 : 6 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="absolute inset-0 flex cursor-grab flex-col items-center justify-center rounded-3xl border border-sand bg-white p-8 text-center shadow-xl shadow-navy/5 active:cursor-grabbing"
          >
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-tan/50 text-navy">
              <Icon size={30} />
            </span>
            <h3 className="font-display text-xl font-extrabold text-navy">{card.title}</h3>
            <p className="mt-2 max-w-sm text-navy/70">{card.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="ghost" onClick={() => go(-1)} disabled={index === 0}>
          Previous
        </Button>
        {lastCard ? (
          <Button
            variant="secondary"
            onClick={() => update({ ohsGuideRead: true })}
            disabled={state.ohsGuideRead}
          >
            {state.ohsGuideRead ? (
              <>
                <CheckCircle2 size={18} /> Marked as read
              </>
            ) : (
              "That's everything — mark as read"
            )}
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => go(1)}>
            Next tip
          </Button>
        )}
      </div>
    </PageShell>
    <GuideAssistant />
    </>
  );
}

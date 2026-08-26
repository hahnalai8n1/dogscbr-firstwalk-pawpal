import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Lightbulb, PartyPopper, ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell";
import Button from "../components/Button";
import TileOptions from "../components/quiz/TileOptions";
import BackpackQuestion from "../components/quiz/BackpackQuestion";
import { useWizard } from "../context/WizardContext";
import { quizQuestions } from "../lib/quizData";

function sameSet(a, b) {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

export default function Quiz() {
  const { state, update } = useWizard();
  const navigate = useNavigate();

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState(null); // null | 'correct' | 'wrong'
  const [attemptsByQ, setAttemptsByQ] = useState({});
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[qIndex];
  const progressPct = (qIndex / quizQuestions.length) * 100;

  useEffect(() => {
    setSelected([]);
    setStatus(null);
  }, [qIndex]);

  function toggle(optId) {
    if (status === "correct") return;
    if (question.type === "single") {
      setSelected([optId]);
    } else {
      setSelected((prev) =>
        prev.includes(optId) ? prev.filter((x) => x !== optId) : [...prev, optId]
      );
    }
    if (status === "wrong") setStatus(null);
  }

  function check() {
    const attemptsSoFar = attemptsByQ[question.id] || 0;
    const correct = sameSet(selected, question.correct);

    if (correct) {
      setStatus("correct");
      if (attemptsSoFar === 0) setFirstTryCorrect((c) => c + 1);
      confetti({ particleCount: 60, spread: 55, startVelocity: 32, origin: { y: 0.65 } });
    } else {
      setStatus("wrong");
      setAttemptsByQ((prev) => ({ ...prev, [question.id]: attemptsSoFar + 1 }));
    }
  }

  function next() {
    if (qIndex + 1 < quizQuestions.length) {
      setQIndex((i) => i + 1);
    } else {
      const totalAttempts = Object.values(attemptsByQ).reduce((a, b) => a + b, 0);
      update({
        quiz: { completed: true, score: firstTryCorrect, total: quizQuestions.length, attempts: totalAttempts },
      });
      confetti({ particleCount: 140, spread: 100, startVelocity: 45, origin: { y: 0.5 } });
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <PageShell
        eyebrow="Step 3 of 6"
        title="Nailed it! 🐾"
        onNext={() => navigate("/apply/id-upload")}
        nextLabel="Continue to ID verification"
        hideNext={false}
      >
        <div className="flex flex-col items-center rounded-3xl border border-sand bg-white p-10 text-center shadow-xl shadow-navy/5">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber text-navy"
          >
            <PartyPopper size={30} />
          </motion.span>
          <h3 className="font-display text-2xl font-extrabold text-navy">100% — quiz passed</h3>
          <p className="mt-2 max-w-sm text-navy/70">
            You got {firstTryCorrect} of {quizQuestions.length} correct on the first try. You
            clearly read the guidelines properly — well done.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Step 3 of 6"
      title="OHS Program Test"
      subtitle="All answers are in the guidelines you just read. 100% required to move on — no shame in a retry."
      hideNext
      onBack={() => navigate("/apply/ohs-guide")}
    >
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-sand/60">
        <motion.div
          className="h-full rounded-full bg-amber"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-navy/40">
        Question {qIndex + 1} of {quizQuestions.length}
        {question.type === "multi" && " · select all that apply"}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="mb-5 font-display text-xl font-bold text-navy">{question.prompt}</h2>

          {question.render === "backpack" ? (
            <BackpackQuestion
              options={question.options}
              selected={selected}
              status={status}
              correct={question.correct}
              onToggle={toggle}
              disabled={status === "correct"}
            />
          ) : (
            <TileOptions
              options={question.options}
              selected={selected}
              status={status}
              correct={question.correct}
              onToggle={toggle}
              disabled={status === "correct"}
            />
          )}

          <AnimatePresence>
            {status === "wrong" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden rounded-2xl border border-amber/50 bg-tan/25 p-4 text-sm text-navy/80"
              >
                <p className="mb-1 flex items-center gap-1.5 font-bold text-navy">
                  <Lightbulb size={15} className="text-amber" /> Not quite
                </p>
                {question.hint}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-end">
            {status === "correct" ? (
              <Button variant="secondary" onClick={next}>
                {qIndex + 1 === quizQuestions.length ? "See my result" : "Next question"}{" "}
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={check} disabled={selected.length === 0}>
                Check answer
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}

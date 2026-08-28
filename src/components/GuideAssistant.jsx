import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PawPrint, X, Send, Loader2 } from "lucide-react";
import { askGuidelines } from "../lib/api";

function useAsk() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      setAnswer(await askGuidelines(question.trim()));
    } catch {
      setAnswer("Ruh-roh, something went wrong asking that. Try again, or check the cards above.");
    } finally {
      setLoading(false);
    }
  }

  return { question, setQuestion, answer, loading, handleAsk };
}

function AskForm({ question, setQuestion, loading }) {
  return (
    <div className="flex gap-2">
      <input
        className="input flex-1 py-2 text-sm"
        placeholder="e.g. can I let go of the lead?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading || !question.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-cream disabled:opacity-40"
      >
        <Send size={16} />
      </button>
    </div>
  );
}

function AnswerBox({ loading, answer }) {
  if (!loading && !answer) return null;
  return (
    <div className="mb-3 max-h-40 overflow-y-auto rounded-2xl bg-cream-light p-3 text-sm text-navy/80">
      {loading ? (
        <span className="flex items-center gap-2 text-navy/50">
          <Loader2 size={14} className="animate-spin" /> Sniffing around for an answer…
        </span>
      ) : (
        answer
      )}
    </div>
  );
}

// Desktop: portals into the sidebar's own column (#sidebar-slot, rendered by
// StepSidebar) so it can never float over page content.
function SidebarAssistant() {
  const [target, setTarget] = useState(null);
  const { question, setQuestion, answer, loading, handleAsk } = useAsk();

  useEffect(() => {
    setTarget(document.getElementById("sidebar-slot"));
  }, []);

  if (!target) return null;

  return createPortal(
    <div className="rounded-2xl border border-sand bg-white p-3">
      <p className="mb-2 flex items-center gap-1.5 font-display text-xs font-bold text-navy">
        <PawPrint size={12} className="text-amber" /> Ask about the guidelines
      </p>
      <AnswerBox loading={loading} answer={answer} />
      <form onSubmit={handleAsk}>
        <AskForm question={question} setQuestion={setQuestion} loading={loading} />
      </form>
    </div>,
    target
  );
}

// Mobile/tablet: a floating button that opens a proper bottom-sheet modal
// (backdrop + slide-up panel) so it never sits ambiguously on top of content.
function MobileAssistant() {
  const [open, setOpen] = useState(false);
  const { question, setQuestion, answer, loading, handleAsk } = useAsk();

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-36 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-cream shadow-xl shadow-navy/20 sm:bottom-24"
        aria-label="Ask about the guidelines"
      >
        <PawPrint size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-sand bg-white p-5 pb-8 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-1.5 font-display text-sm font-bold text-navy">
                  <PawPrint size={14} className="text-amber" /> Ask about the guidelines
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-navy/40 hover:bg-cream-light"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <AnswerBox loading={loading} answer={answer} />
              <form onSubmit={handleAsk}>
                <AskForm question={question} setQuestion={setQuestion} loading={loading} />
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GuideAssistant() {
  return (
    <>
      <div className="hidden lg:block">
        <SidebarAssistant />
      </div>
      <div className="lg:hidden">
        <MobileAssistant />
      </div>
    </>
  );
}

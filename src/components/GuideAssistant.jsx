import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PawPrint, X, Send, Loader2 } from "lucide-react";
import { askGuidelines } from "../lib/api";

export default function GuideAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await askGuidelines(question.trim());
      setAnswer(res);
    } catch {
      setAnswer("Ruh-roh, something went wrong asking that. Try again, or check the cards above.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-28 right-5 z-30 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] rounded-3xl border border-sand bg-white p-4 shadow-2xl shadow-navy/10"
          >
            <p className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-navy">
              <PawPrint size={14} className="text-amber" /> Ask me about the guidelines
            </p>

            {(loading || answer) && (
              <div className="mb-3 max-h-40 overflow-y-auto rounded-2xl bg-cream-light p-3 text-sm text-navy/80">
                {loading ? (
                  <span className="flex items-center gap-2 text-navy/50">
                    <Loader2 size={14} className="animate-spin" /> Sniffing around for an answer…
                  </span>
                ) : (
                  answer
                )}
              </div>
            )}

            <form onSubmit={handleAsk} className="flex gap-2">
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
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-cream shadow-xl shadow-navy/20"
        aria-label="Ask about the guidelines"
      >
        {open ? <X size={22} /> : <PawPrint size={22} />}
      </motion.button>
    </div>
  );
}

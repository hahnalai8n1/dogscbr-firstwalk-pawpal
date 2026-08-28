import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PawPrint, ArrowRight, HeartHandshake } from "lucide-react";
import Button from "../components/Button";
import PawBackground from "../components/PawBackground";
import { useWizard } from "../context/WizardContext";
import dogscbrLogo from "../assets/dogscbr-logo.jpg";

function calcAge(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export default function Landing() {
  const { state, updateStep0 } = useWizard();
  const navigate = useNavigate();
  const [form, setForm] = useState(state.step0);
  const [touched, setTouched] = useState(false);

  const age = calcAge(form.dob);
  const isMinor = age !== null && age < 18;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid =
    form.fullName.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim() &&
    form.dob &&
    (!isMinor || (form.guardianName.trim() && form.guardianContact.trim())) &&
    (!form.hasAccessibilityNeeds || form.accessibilityNotes.trim());

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    updateStep0({ ...form, isMinor });
    navigate("/apply/induction");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PawBackground />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 py-14 sm:px-8">
        <motion.img
          src={dogscbrLogo}
          alt="Dogs Canberra"
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mb-4 w-48 rounded-2xl shadow-lg sm:w-56"
        />

        <p className="mb-2 flex items-center gap-1 font-display text-sm font-bold uppercase tracking-widest text-amber">
          <PawPrint size={14} /> Community Program
        </p>
        <h1 className="text-center font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
          Become a Community Member
        </h1>
        <p className="mt-3 max-w-lg text-center text-navy/70">
          A few quick steps to get you reading, quizzed, verified and booked in to walk one of
          our rescue dogs. Your first walk is always alongside one of our staff — everything
          before that, you can do right here.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full space-y-5 rounded-3xl border border-sand/70 bg-white/80 p-6 shadow-xl shadow-navy/5 backdrop-blur sm:p-8"
        >
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <Field label="Full name" required error={touched && !form.fullName.trim()}>
              <input
                className="input"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                placeholder="Jamie Rivers"
              />
            </Field>
            <Field label="Email" required error={touched && !/\S+@\S+\.\S+/.test(form.email)}>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="jamie@email.com"
              />
            </Field>
            <Field label="Phone number" required error={touched && !form.phone.trim()}>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="04xx xxx xxx"
              />
            </Field>
            <Field label="Date of birth" required error={touched && !form.dob}>
              <input
                type="date"
                className="input max-w-[80%]"
                value={form.dob}
                onChange={(e) => setField("dob", e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </Field>
          </div>

          {isMinor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 rounded-2xl border border-amber/40 bg-tan/30 p-4"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <HeartHandshake size={16} className="text-amber" />
                Walkers under 18 must be accompanied by an adult Community Member — we just
                need their details.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Accompanying adult's name"
                  required
                  error={touched && !form.guardianName.trim()}
                >
                  <input
                    className="input"
                    value={form.guardianName}
                    onChange={(e) => setField("guardianName", e.target.value)}
                  />
                </Field>
                <Field
                  label="Accompanying adult's phone/email"
                  required
                  error={touched && !form.guardianContact.trim()}
                >
                  <input
                    className="input"
                    value={form.guardianContact}
                    onChange={(e) => setField("guardianContact", e.target.value)}
                  />
                </Field>
              </div>
            </motion.div>
          )}

          <div className="rounded-2xl border border-sand bg-cream-light p-4">
            <label className="flex items-start gap-3 text-sm text-navy/80">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-navy"
                checked={form.hasAccessibilityNeeds}
                onChange={(e) => setField("hasAccessibilityNeeds", e.target.checked)}
              />
              I have a health, mobility or accessibility consideration I'd like staff to know
              about before my first walk.
            </label>
            {form.hasAccessibilityNeeds && (
              <div className="mt-3">
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Tell us a little about it — helps us match you with the right dog and prepare properly."
                  value={form.accessibilityNotes}
                  onChange={(e) => setField("accessibilityNotes", e.target.value)}
                />
                {touched && !form.accessibilityNotes.trim() && (
                  <span className="mt-1 block text-xs text-rose-500">
                    Please add a few details so staff know what to prepare for
                  </span>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Start my application <ArrowRight size={18} />
          </Button>
          <p className="text-center text-xs text-navy/40">
            Takes about 10–15 minutes. You can retake the OHS quiz as many times as you need.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="mb-1 flex items-center gap-1 font-medium text-navy/80">
        {label}
        {required && <span className="text-amber">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-500">Required</span>}
    </label>
  );
}

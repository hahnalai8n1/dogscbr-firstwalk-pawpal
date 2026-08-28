import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { steps } from "../lib/steps";
import { useWizard } from "../context/WizardContext";

function isStepComplete(path, state) {
  switch (path) {
    case "/apply/induction":
      return state.inductionAccepted;
    case "/apply/ohs-guide":
      return state.ohsGuideRead;
    case "/apply/quiz":
      return state.quiz.completed;
    case "/apply/id-upload":
      return !!state.idFile;
    case "/apply/signature":
      return !!state.signature;
    case "/apply/confirmation":
      return !!state.cmNumber;
    default:
      return false;
  }
}

export default function StepSidebar() {
  const location = useLocation();
  const { state } = useWizard();
  const currentIndex = steps.findIndex((s) => s.path === location.pathname);

  return (
    <nav
      aria-label="Application progress"
      className="hidden lg:flex w-64 shrink-0 flex-col gap-1 border-r border-sand/70 bg-cream-light/60 px-5 py-8"
      style={{ minHeight: "100vh" }}
    >
      <p className="mb-6 px-2 font-display text-sm font-bold uppercase tracking-wide text-navy/60">
        Your journey
      </p>
      <ol className="relative flex flex-col">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const active = i === currentIndex;
          const done = isStepComplete(step.path, state) && !active;
          const reachable = done || active || i < currentIndex;
          const content = (
            <div className="group relative flex items-start gap-3 py-3">
              {i < steps.length - 1 && (
                <span
                  className={`absolute left-[15px] top-9 h-[calc(100%-8px)] w-0.5 ${
                    done ? "bg-amber" : "bg-sand"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  active
                    ? "border-navy bg-navy text-cream"
                    : done
                    ? "border-amber bg-amber text-navy"
                    : "border-sand bg-white text-navy/40"
                }`}
              >
                {done ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </span>
              <span
                className={`pt-1 text-sm font-medium leading-tight ${
                  active ? "text-navy font-bold" : done ? "text-navy/80" : "text-navy/40"
                }`}
              >
                {step.label}
              </span>
              {active && (
                <motion.span
                  layoutId="sidebar-active-dot"
                  className="absolute -left-5 top-4 h-2 w-2 rounded-full bg-amber"
                />
              )}
            </div>
          );

          return (
            <li key={step.path}>
              {reachable && !active ? (
                <Link to={step.path} className="block rounded-lg px-2 hover:bg-tan/30">
                  {content}
                </Link>
              ) : (
                <div className="px-2">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
      <div id="sidebar-slot" className="mt-auto pt-6" />
    </nav>
  );
}

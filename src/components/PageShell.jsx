import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  hideNext = false,
  hideFooter = false,
}) {
  const navigate = useNavigate();
  return (
    <div>
      {eyebrow && (
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-widest text-amber">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-navy/70">{subtitle}</p>}

      <div className="mt-8">{children}</div>

      {!hideFooter && (
        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => (onBack ? onBack() : navigate(-1))}>
            <ArrowLeft size={16} /> Back
          </Button>
          {!hideNext && (
            <Button onClick={onNext} disabled={nextDisabled}>
              {nextLabel} <ArrowRight size={16} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

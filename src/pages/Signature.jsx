import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignaturePad from "signature_pad";
import { Eraser, Loader2, PenLine } from "lucide-react";
import PageShell from "../components/PageShell";
import Button from "../components/Button";
import { useWizard } from "../context/WizardContext";
import { submitApplication } from "../lib/api";

export default function Signature() {
  const { state, update } = useWizard();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [signedName, setSignedName] = useState(state.step0.fullName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;

    function resize() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      padRef.current?.clear();
    }

    padRef.current = new SignaturePad(canvas, { penColor: "#010781", backgroundColor: "#fff7ed" });
    padRef.current.addEventListener("beginStroke", () => setIsEmpty(false));

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      padRef.current?.off();
    };
  }, []);

  function clearSignature() {
    padRef.current?.clear();
    setIsEmpty(true);
  }

  async function handleSubmit() {
    if (isEmpty || !signedName.trim()) return;
    setSubmitting(true);
    setError("");
    const signatureDataUrl = padRef.current.toDataURL("image/png");
    const payload = {
      ...state.step0,
      inductionAccepted: state.inductionAccepted,
      quiz: state.quiz,
      idFile: state.idFile,
      signedName,
      signature: signatureDataUrl,
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await submitApplication(payload);
      update({
        signature: signatureDataUrl,
        signedName,
        cmNumber: res.cmNumber,
        submittedAt: payload.submittedAt,
      });
      navigate("/apply/confirmation");
    } catch (e) {
      setError("Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      eyebrow="Step 5 of 6"
      title="Sign the Community Induction Form"
      subtitle="Last step. Your signature confirms you agree to the rights & responsibilities from Step 1 — this is what we need on file to issue your Community Member number."
      hideFooter
    >
      <div className="rounded-3xl border border-sand bg-white p-6">
        <label className="mb-4 block text-sm">
          <span className="mb-1 block font-medium text-navy/80">Type your full legal name</span>
          <input
            className="input"
            value={signedName}
            onChange={(e) => setSignedName(e.target.value)}
          />
        </label>

        <span className="mb-1 flex items-center gap-1.5 text-sm font-medium text-navy/80">
          <PenLine size={14} /> Draw your signature
        </span>
        <div className="rounded-2xl border-2 border-dashed border-sand bg-cream-light">
          <canvas ref={canvasRef} className="h-44 w-full touch-none rounded-2xl" />
        </div>
        <button
          type="button"
          onClick={clearSignature}
          className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-navy/50 hover:text-navy"
        >
          <Eraser size={13} /> Clear and redo
        </button>

        <p className="mt-5 rounded-xl bg-cream-light p-3 text-xs leading-relaxed text-navy/60">
          By signing, I confirm I have read and agree to the DogsCBR Community Induction Guide
          (rights, responsibilities and privacy policy), and that the information I've provided
          in this application is accurate.
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isEmpty || !signedName.trim() || submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </Button>
      </div>
    </PageShell>
  );
}

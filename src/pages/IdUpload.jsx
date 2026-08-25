import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadCloud, IdCard, RefreshCw, ShieldCheck, X } from "lucide-react";
import PageShell from "../components/PageShell";
import { useWizard } from "../context/WizardContext";

const MAX_MB = 8;

export default function IdUpload() {
  const { state, update } = useWizard();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Please upload a photo or PDF of your ID.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File's a bit large — keep it under ${MAX_MB}MB.`);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      update({ idFile: { name: file.name, type: file.type, dataUrl: reader.result } });
    };
    reader.readAsDataURL(file);
  }

  return (
    <PageShell
      eyebrow="Step 4 of 6"
      title="Verify your ID"
      subtitle="A valid photo ID (driver's licence or other government ID) — the same one you'll bring to sign in on walk day."
      onNext={() => navigate("/apply/signature")}
      nextDisabled={!state.idFile}
    >
      {!state.idFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${
            dragOver ? "border-navy bg-navy/5" : "border-sand bg-white hover:border-navy/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <motion.span
            animate={{ y: dragOver ? -4 : 0 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-tan/50 text-navy"
          >
            <UploadCloud size={26} />
          </motion.span>
          <p className="font-display font-bold text-navy">Drop your ID here, or click to browse</p>
          <p className="text-sm text-navy/50">JPG, PNG or PDF, up to {MAX_MB}MB</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-sand bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-tan/40">
              {state.idFile.type.startsWith("image/") ? (
                <img src={state.idFile.dataUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <IdCard className="text-navy" size={26} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy">{state.idFile.name}</p>
              <p className="text-xs text-emerald-600">Uploaded successfully</p>
            </div>
            <button
              type="button"
              onClick={() => update({ idFile: null })}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy/40 hover:bg-cream-light hover:text-navy"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-navy/60 hover:text-navy"
          >
            <RefreshCw size={13} /> Replace file
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-sand bg-cream-light p-4 text-sm text-navy/70">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-navy/50" />
        This is only ever seen by DogsCBR staff for sign-in verification — never shared or
        published. You can request its deletion at any time.
      </div>
    </PageShell>
  );
}

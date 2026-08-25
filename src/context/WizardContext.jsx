import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "dogscbr-wizard-state";

const defaultState = {
  step0: {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    hasAccessibilityNeeds: false,
    accessibilityNotes: "",
  },
  inductionAccepted: false,
  ohsGuideRead: false,
  quiz: {
    completed: false,
    score: 0,
    total: 10,
    attempts: 0,
  },
  idFile: null, // { name, type, dataUrl }
  signature: null, // dataUrl
  signedName: "",
  cmNumber: null,
  submittedAt: null,
};

function loadInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

const WizardContext = createContext(null);

export function WizardProvider({ children }) {
  const [state, setState] = useState(loadInitial);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function update(patch) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function updateStep0(patch) {
    setState((prev) => ({ ...prev, step0: { ...prev.step0, ...patch } }));
  }

  function reset() {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }

  return (
    <WizardContext.Provider value={{ state, update, updateStep0, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

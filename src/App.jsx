import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WizardProvider } from "./context/WizardContext";
import WizardLayout from "./layouts/WizardLayout";
import Landing from "./pages/Landing";
import Induction from "./pages/Induction";
import OhsGuide from "./pages/OhsGuide";
import Quiz from "./pages/Quiz";
import IdUpload from "./pages/IdUpload";
import Signature from "./pages/Signature";
import Confirmation from "./pages/Confirmation";

export default function App() {
  return (
    <WizardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/apply" element={<WizardLayout />}>
            <Route path="induction" element={<Induction />} />
            <Route path="ohs-guide" element={<OhsGuide />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="id-upload" element={<IdUpload />} />
            <Route path="signature" element={<Signature />} />
            <Route path="confirmation" element={<Confirmation />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WizardProvider>
  );
}

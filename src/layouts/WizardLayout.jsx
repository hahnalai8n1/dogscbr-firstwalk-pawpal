import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import StepSidebar from "../components/StepSidebar";
import MobileStepBar from "../components/MobileStepBar";
import PawBackground from "../components/PawBackground";

export default function WizardLayout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <PawBackground />
      <div className="flex min-h-screen">
        <StepSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <MobileStepBar />
          <main className="flex-1 px-4 py-10 sm:px-8 lg:px-16 xl:px-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mx-auto w-full max-w-6xl"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

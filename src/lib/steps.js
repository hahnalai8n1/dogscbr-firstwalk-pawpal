import { UserRound, ScrollText, ShieldCheck, Gamepad2, IdCard, PenTool, PartyPopper } from "lucide-react";

// Single source of truth for routing + the sidebar flow diagram.
// step 0 (landing) intentionally excluded from the sidebar per the brief.
export const steps = [
  { path: "/apply/induction", label: "Community Induction", icon: ScrollText },
  { path: "/apply/ohs-guide", label: "OHS Guidelines", icon: ShieldCheck },
  { path: "/apply/quiz", label: "OHS Quiz", icon: Gamepad2 },
  { path: "/apply/id-upload", label: "ID Verification", icon: IdCard },
  { path: "/apply/signature", label: "Sign & Submit", icon: PenTool },
  { path: "/apply/confirmation", label: "You're In!", icon: PartyPopper },
];

export const landingStep = { path: "/", label: "Your Details", icon: UserRound };

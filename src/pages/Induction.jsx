import { useNavigate } from "react-router-dom";
import { CalendarCheck, HeartHandshake, ShieldAlert, Lock } from "lucide-react";
import PageShell from "../components/PageShell";
import Accordion, { AccordionItem } from "../components/Accordion";
import { useWizard } from "../context/WizardContext";

export default function Induction() {
  const { state, update } = useWizard();
  const navigate = useNavigate();

  return (
    <PageShell
      eyebrow="Step 1 of 6"
      title="Community Induction"
      subtitle="This is DogsCBR's Community Membership Framework — your rights and responsibilities as a member. Have a read through, then confirm you understand."
      onNext={() => navigate("/apply/ohs-guide")}
      nextDisabled={!state.inductionAccepted}
    >
      <Accordion>
        <AccordionItem icon={CalendarCheck} title="Your rights as a Community Member" defaultOpen>
          <ul className="list-disc space-y-1.5 pl-4">
            <li>
              Access to all DogsCBR services and programs — the Walking Program, Therapy Dog
              Events and Mental Health Playdates, Educational Seminars, Community Events, and
              General Meetings.
            </li>
            <li>A safe, respectful, non-judgmental and inclusive environment, always.</li>
            <li>
              A voice — we welcome feedback and suggestions, and you'll get regular updates on
              new programs and developments.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem icon={HeartHandshake} title="Your responsibilities">
          <p className="mb-2">
            Treat DogsCBR staff, volunteers, other members, and our dogs with kindness and
            respect.
          </p>
          <p>
            Follow every guideline and procedure we set out — including all safety and animal
            welfare policies, approved walking routes, equipment usage, and duration limits.
          </p>
        </AccordionItem>

        <AccordionItem icon={Lock} title="Privacy policy">
          <p className="mb-2">
            We only use your data to contact you about DogsCBR, or to provide a service you've
            asked for. We never sell your data, and we won't share it with third parties without
            your consent — except where reasonably necessary to meet a legal obligation, address
            fraud or security issues, or protect against harm.
          </p>
          <p className="mb-2">
            Your data is stored securely and access is restricted to DogsCBR staff who need it to
            do their jobs. You can request a copy, correction, or deletion of your data at any
            time.
          </p>
          <p>
            Questions about this policy?{" "}
            <a className="underline" href="mailto:secretary@dogscbr.org">
              secretary@dogscbr.org
            </a>
          </p>
        </AccordionItem>

        <AccordionItem icon={ShieldAlert} title="Why all these steps, for a dog walk?">
          <p>
            Many of our dogs come from vulnerable backgrounds. These checks — induction, OHS
            guidelines, a short quiz, ID verification, and a supervised first walk — exist to
            keep every walk safe and supportive for you and for them.
          </p>
        </AccordionItem>
      </Accordion>

      <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber/50 bg-tan/25 p-4 text-sm font-medium text-navy">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-navy"
          checked={state.inductionAccepted}
          onChange={(e) => update({ inductionAccepted: e.target.checked })}
        />
        I've read and understood my rights and responsibilities as a DogsCBR Community Member.
      </label>
      <p className="mt-2 text-xs text-navy/40">
        You'll give this a proper signature at the end — this just confirms you've read it.
      </p>
    </PageShell>
  );
}

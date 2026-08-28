import { motion } from "framer-motion";
import {
  Ban,
  Check,
  Clock3,
  Dog,
  Droplets,
  Hand,
  IdCard,
  Link2,
  Lock,
  MapPin,
  PhoneCall,
  Repeat2,
  ShieldAlert,
  Smartphone,
  Timer,
  Undo2,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import pullingScene from "../../assets/quiz-pulling-first-person.webp";
import leadHoldScene from "../../assets/quiz-lead-hold-first-person.webp";
import harnessScene from "../../assets/quiz-harness-first-person.webp";
import routeScene from "../../assets/quiz-route-choice-first-person.webp";
import groundItemScene from "../../assets/quiz-ground-item-first-person.webp";

function ScenarioImage({ src, alt, caption }) {
  return (
    <figure className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-sand bg-white">
      <img src={src} alt={alt} className="aspect-[3/2] w-full object-cover" />
      <figcaption className="border-t border-sand bg-cream-light px-4 py-2 text-xs text-navy/60">
        {caption}
      </figcaption>
    </figure>
  );
}

function ChoiceButton({ option, selected, status, correct, onToggle, children, className = "" }) {
  const isCorrect = correct.includes(option.id);
  const revealCorrect = status === "wrong" && isCorrect;
  const revealWrong = status === "wrong" && selected && !isCorrect;
  const locked = status === "correct" && isCorrect;
  const disabled = status === "correct";

  const stateClass = locked
    ? "border-emerald-500 bg-emerald-50 text-emerald-950"
    : revealWrong
      ? "border-rose-400 bg-rose-50 text-rose-800"
      : revealCorrect
        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
        : selected
          ? "border-navy bg-navy text-cream shadow-lg shadow-navy/15"
          : "border-sand bg-white text-navy hover:border-navy/40 hover:bg-cream-light";

  return (
    <button
      type="button"
      onClick={() => onToggle(option.id)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${option.label}${revealWrong ? ", incorrect" : ""}${locked || revealCorrect ? ", correct" : ""}`}
      className={`relative min-h-24 rounded-2xl border-2 p-4 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/50 disabled:cursor-default ${stateClass} ${className}`}
    >
      {children}
      {revealWrong ? <X aria-hidden="true" className="absolute right-3 top-3" size={17} /> : null}
      {locked || revealCorrect ? (
        <Check aria-hidden="true" className="absolute right-3 top-3" size={17} />
      ) : null}
    </button>
  );
}

function IdHandoff({ question, selected, status, onToggle }) {
  const handed = selected.includes("hand");
  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-32 max-w-lg overflow-hidden rounded-3xl border border-sand bg-tan/20" aria-hidden="true">
        <div className="absolute bottom-4 left-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-navy shadow-sm">
          <WalletCards size={28} />
        </div>
        <div className="absolute bottom-4 right-5 flex h-16 w-24 items-center justify-center rounded-2xl bg-navy text-cream shadow-sm">
          <span className="text-center text-[10px] font-extrabold uppercase tracking-wider">Staff desk</span>
        </div>
        <motion.div
          animate={{ left: handed ? "calc(100% - 7.75rem)" : "5rem", rotate: handed ? 5 : -4 }}
          transition={{ type: "spring", stiffness: 170, damping: 18 }}
          className="absolute bottom-9 flex h-12 w-16 items-center justify-center rounded-lg border-2 border-navy bg-cream text-navy shadow-md"
        >
          <IdCard size={24} />
        </motion.div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose what to do with your photo ID">
        {question.options.map((option) => {
          const Icon = option.id === "hand" ? IdCard : Smartphone;
          return (
            <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle}>
              <Icon className="mb-3" size={25} aria-hidden="true" />
              {option.label}
            </ChoiceButton>
          );
        })}
      </div>
    </div>
  );
}

function Pulling({ question, selected, status, onToggle }) {
  const icons = { tug: Undo2, carry: Hand, wait: Timer };
  return (
    <div className="space-y-4">
      <ScenarioImage
        src={pullingScene}
        alt="Three first-person scenes: pulling one continuous lead sharply with two hands, trying to lift the dog, and calmly gripping the lead with a hand through its wrist loop."
        caption="Compare the three actions, then choose the safest response."
      />
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose how to respond when the dog pulls">
        {question.options.map((option) => {
          const Icon = icons[option.id];
          return (
            <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle}>
              <Icon className="mb-3" size={25} aria-hidden="true" />
              {option.label}
            </ChoiceButton>
          );
        })}
      </div>
    </div>
  );
}

const distanceValues = { 5: 3, "5-10": 7, 10: 10 };

function Distance({ question, selected, status, onToggle }) {
  const active = selected[0];
  const value = distanceValues[active] ?? 7;

  function chooseFromSlider(event) {
    const next = Number(event.target.value);
    onToggle(next < 5 ? "5" : next < 10 ? "5-10" : "10");
  }

  return (
    <div className="space-y-4">
      {active === "any" ? (
        <div
          className="flex min-h-52 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-navy/25 bg-tan/20 p-6 text-center"
          role="status"
          aria-live="polite"
        >
          <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-navy shadow-sm" aria-hidden="true">
            <Ban size={32} />
          </span>
          <p className="font-display text-xl font-extrabold text-navy">No set distance</p>
          <p className="mt-1 max-w-sm text-sm text-navy/65">
            This choice treats the distance between dogs as irrelevant.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-sand bg-white p-5">
          <div className="relative mx-auto h-28 max-w-xl overflow-hidden rounded-2xl bg-tan/20" aria-hidden="true">
            <Dog className="absolute bottom-4 left-5 text-navy" size={42} />
            <motion.div animate={{ left: `${Math.min(78, 28 + value * 4)}%` }} className="absolute bottom-4 text-navy">
              <Dog size={42} />
            </motion.div>
            <div className="absolute inset-x-14 bottom-2 border-b-2 border-dashed border-navy/30" />
            <motion.span animate={{ left: `${Math.min(69, 18 + value * 3.7)}%` }} className="absolute bottom-1 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-cream">
              {value} m
            </motion.span>
          </div>
          <label htmlFor="dog-distance" className="mt-4 block text-sm font-bold text-navy">
            Move the dogs apart: <output>{value} metres</output>
          </label>
          <input
            id="dog-distance"
            type="range"
            min="3"
            max="12"
            step="1"
            value={value}
            disabled={status === "correct"}
            onChange={chooseFromSlider}
            className="mt-3 w-full accent-navy"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-navy/50" aria-hidden="true">
            <span>3 m</span><span>5 m</span><span>10 m</span><span>12 m</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Distance answer options">
        {question.options.map((option) => (
          <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle} className="min-h-20 p-3 text-center">
            {option.label}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}

function LeadHold({ question, selected, status, onToggle }) {
  const visual = {
    wrap: <><Repeat2 size={31} /><span className="h-1 w-12 rounded bg-current" /></>,
    loop: <><span className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-current"><Hand size={22} /></span><span className="h-1 w-12 rounded bg-current" /></>,
    "loop-only": <><Link2 size={31} /><span className="h-1 w-8 rounded bg-current opacity-40" /></>,
  };
  return (
    <div className="space-y-4">
      <ScenarioImage
        src={leadHoldScene}
        alt="Three first-person scenes: the lead wrapped tightly around a hand, a hand through the loop while gripping the lead, and fingertips holding only the loop."
        caption="Look closely at how the loop and lead are held in each scene."
      />
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose the correct way to hold the lead">
        {question.options.map((option) => (
          <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle} className="min-h-36 text-center">
            <span className="mb-4 flex h-16 items-center justify-center gap-1 rounded-xl bg-tan/25" aria-hidden="true">{visual[option.id]}</span>
            {option.label}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}

function Detach({ question, selected, status, onToggle }) {
  const unlocked = selected[0] && selected[0] !== "never";
  return (
    <div className="space-y-4">
      <div className="relative mx-auto flex h-36 max-w-lg items-center justify-center overflow-hidden rounded-3xl border border-sand bg-tan/20" aria-hidden="true">
        <Dog className="absolute right-12 text-navy" size={66} />
        <motion.div animate={{ x: unlocked ? -24 : 0, rotate: unlocked ? -25 : 0 }} className="flex items-center text-navy">
          <span className="h-1 w-28 rounded bg-navy" />
          {unlocked ? <Link2 size={30} /> : <Lock size={30} />}
        </motion.div>
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-navy">Lead stays attached</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose when the lead can be removed">
        {question.options.map((option) => (
          <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle}>
            {option.id === "never" ? <Lock className="mb-3" size={25} /> : <Link2 className="mb-3" size={25} />}
            {option.label}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}

function WaterTimeline({ question, selected, status, onToggle }) {
  const positions = { "5m": 8, "30m": 50, "1h": 92, end: 100 };
  return (
    <div className="rounded-3xl border border-sand bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-2 text-sm font-bold text-navy"><Droplets size={20} /> Tap a time on the walk</div>
      <div className="relative pt-8">
        <div className="absolute left-3 right-3 top-11 hidden h-1 rounded bg-sand sm:block" aria-hidden="true" />
        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-2" role="group" aria-label="Choose when to offer water">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id);
            const isCorrect = question.correct.includes(option.id);
            const revealCorrect = status === "wrong" && isCorrect;
            const revealWrong = status === "wrong" && isSelected && !isCorrect;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onToggle(option.id)}
                disabled={status === "correct"}
                aria-pressed={isSelected}
                  className="group relative z-10 flex min-h-24 flex-col items-center justify-center rounded-2xl bg-cream-light px-2 text-center text-xs font-semibold text-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/50 sm:min-h-0 sm:justify-start sm:rounded-none sm:bg-transparent"
              >
                <motion.span
                  animate={{ scale: isSelected ? 1.2 : 1 }}
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 ${(status === "correct" && isCorrect) || revealCorrect ? "border-emerald-500 bg-emerald-100" : revealWrong ? "border-rose-400 bg-rose-100" : isSelected ? "border-navy bg-navy text-cream" : "border-sand bg-white group-hover:border-navy/50"}`}
                >
                  <Clock3 size={18} />
                </motion.span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <span className="sr-only">Timeline positions: {Object.values(positions).join(", ")} percent.</span>
    </div>
  );
}

function Harness({ question, selected, status, onToggle }) {
  const icons = { "self-fix": Repeat2, remove: Ban, staff: PhoneCall };
  return (
    <div className="space-y-4">
      <ScenarioImage
        src={harnessScene}
        alt="Three first-person scenes: adjusting a loose harness, removing the harness, and keeping the dog secure while calling staff."
        caption="The harness is loose. Compare the three possible responses."
      />
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose what to do with a loose harness">
        {question.options.map((option) => {
          const Icon = icons[option.id];
          return <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle}><Icon className="mb-3" size={25} />{option.label}</ChoiceButton>;
        })}
      </div>
    </div>
  );
}

function RouteMap({ question, selected, status, onToggle }) {
  return (
    <div className="space-y-4">
      <ScenarioImage
        src={routeScene}
        alt="Two first-person scenes: an unmarked path beside private property and a maintained public park route."
        caption="Compare the unmarked track with the approved public walking route."
      />
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose where you can walk the dog">
        {question.options.map((option) => <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle} className="min-h-20">{option.id === "approved" ? <MapPin className="mb-2" size={23} /> : <Ban className="mb-2" size={23} />}{option.label}</ChoiceButton>)}
      </div>
    </div>
  );
}

function Minors({ question, selected, status, onToggle }) {
  const icons = { yes: UserRound, no: Ban, adult: UsersRound };
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose the supervision arrangement">
      {question.options.map((option) => {
        const Icon = icons[option.id];
        return (
          <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle} className="min-h-40 text-center">
            <span className="mx-auto mb-4 flex h-16 w-24 items-center justify-center rounded-2xl bg-tan/25" aria-hidden="true"><Icon size={36} strokeWidth={1.8} /></span>
            {option.label}
          </ChoiceButton>
        );
      })}
    </div>
  );
}

function Eating({ question, selected, status, onToggle }) {
  const icons = { grab: Hand, move: ShieldAlert, tug: Undo2 };
  return (
    <div className="space-y-4">
      <ScenarioImage
        src={groundItemScene}
        alt="Three first-person scenes: reaching toward the dog's mouth, moving the dog away while calling staff, and forcefully tugging the lead."
        caption="The dog notices food on the ground. Choose the safest next action."
      />
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose what to do if the dog tries to eat something">
        {question.options.map((option) => {
          const Icon = icons[option.id];
          return <ChoiceButton key={option.id} option={option} selected={selected.includes(option.id)} status={status} correct={question.correct} onToggle={onToggle}><Icon className="mb-3" size={25} />{option.label}</ChoiceButton>;
        })}
      </div>
    </div>
  );
}

const renderers = {
  "id-handling": IdHandoff,
  pulling: Pulling,
  distance: Distance,
  "lead-hold": LeadHold,
  detach: Detach,
  water: WaterTimeline,
  harness: Harness,
  where: RouteMap,
  minors: Minors,
  eating: Eating,
};

export default function ScenarioQuestion(props) {
  const Renderer = renderers[props.question.id];
  return Renderer ? <Renderer {...props} /> : null;
}

import { useEffect, useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Plain <select> elements, on purpose — no native <input type="date">. iOS
// Safari's date widget ignores CSS width constraints in a way three normal
// dropdowns never will, so this is the actually-reliable fix, not another
// CSS patch on the native control.
function daysInMonth(month, year) {
  if (!month) return 31;
  return new Date(year || 2000, month, 0).getDate();
}

function parse(value) {
  if (!value) return { year: null, month: null, day: null };
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

export default function DateOfBirthSelect({ value, onChange }) {
  // Local state, not derived straight from `value` on every render — a
  // partial pick (day only, say) has no valid ISO string to report yet, so
  // the parent's `value` stays "" until all three are chosen. If this read
  // straight from `value` each time, that first pick would visually reset
  // the moment you touched the next dropdown.
  const [parts, setParts] = useState(() => parse(value));
  const thisYear = new Date().getFullYear();

  useEffect(() => {
    if (!value) setParts({ year: null, month: null, day: null });
  }, [value]);

  const days = Array.from({ length: daysInMonth(parts.month, parts.year) }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => thisYear - i);

  function update(part, raw) {
    const val = raw ? Number(raw) : null;
    const next = { ...parts, [part]: val };
    if (part === "month" || part === "year") {
      next.day = next.day ? Math.min(next.day, daysInMonth(next.month, next.year)) : next.day;
    }
    setParts(next);
    onChange(
      next.year && next.month && next.day
        ? `${next.year}-${String(next.month).padStart(2, "0")}-${String(next.day).padStart(2, "0")}`
        : ""
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        className="input"
        aria-label="Day"
        value={parts.day ?? ""}
        onChange={(e) => update("day", e.target.value)}
      >
        <option value="" disabled>
          Day
        </option>
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        className="input"
        aria-label="Month"
        value={parts.month ?? ""}
        onChange={(e) => update("month", e.target.value)}
      >
        <option value="" disabled>
          Month
        </option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
      <select
        className="input"
        aria-label="Year"
        value={parts.year ?? ""}
        onChange={(e) => update("year", e.target.value)}
      >
        <option value="" disabled>
          Year
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

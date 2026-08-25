import clsx from "clsx";

export default function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-base font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-navy text-cream shadow-[0_4px_0_0_var(--color-navy-light)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-navy-light)] active:translate-y-0 active:shadow-[0_2px_0_0_var(--color-navy-light)]",
        variant === "secondary" &&
          "bg-amber text-navy shadow-[0_4px_0_0_#c98600] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#c98600] active:translate-y-0 active:shadow-[0_2px_0_0_#c98600]",
        variant === "ghost" && "bg-transparent text-navy/70 hover:bg-tan/40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

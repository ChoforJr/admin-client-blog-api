import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-forest/65">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const variants = {
    primary: "bg-forest text-white hover:bg-forest/90",
    secondary: "border border-forest/15 bg-white text-forest hover:bg-mint",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest/90 ${className}`}
    >
      {children}
    </Link>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  const tones = {
    info: "border-forest/10 bg-white text-ink/70",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-2xl border px-5 py-4 text-sm leading-6 ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-ink ${className}`}>
      {label}
      <input
        {...props}
        className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2.5 font-normal text-ink placeholder:text-ink/35 focus:border-forest"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-ink ${className}`}>
      {label}
      <textarea
        {...props}
        className="min-h-40 w-full resize-y rounded-xl border border-forest/15 bg-white px-3 py-2.5 font-normal leading-6 text-ink placeholder:text-ink/35 focus:border-forest"
      />
    </label>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-forest/10 bg-white px-5 py-8 text-center text-sm text-ink/65"
    >
      <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-forest/25 border-t-forest align-[-3px]" />
      {label}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/20 bg-white/70 px-5 py-12 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm text-ink/60">{description}</p>
    </div>
  );
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

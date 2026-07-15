import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

type RoleCardProps = {
  href: string;
  title: string;
  description: string;
  action: string;
  icon: ReactNode;
};

export function RoleCard({
  href,
  title,
  description,
  action,
  icon,
}: RoleCardProps) {
  return (
    <Link
      href={href}
      className="group flex min-h-64 flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] motion-reduce:transform-none motion-reduce:transition-none sm:p-8"
    >
      <span className="inline-flex size-12 items-center justify-center rounded bg-[var(--accent-muted)] text-[var(--accent)]">
        {icon}
      </span>
      <h2 className="mt-7 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      <p className="mt-2 max-w-[42ch] text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>
      <span className="mt-auto flex items-center gap-2 pt-7 text-sm font-semibold text-[var(--accent)]">
        {action}
        <ArrowRight
          aria-hidden
          size={18}
          weight="regular"
          className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

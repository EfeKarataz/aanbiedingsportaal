import Link from "next/link";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-slate-200 pb-5">
      <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="7" r="3.2" fill="currentColor" opacity="0.55" />
          <circle cx="7" cy="12" r="3.2" fill="currentColor" opacity="0.7" />
          <circle cx="17" cy="12" r="3.2" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="16" r="3.2" fill="currentColor" opacity="0.85" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        </svg>
        <span className="text-xs font-semibold tracking-wide uppercase">Van Rooij Bloemen</span>
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
    </header>
  );
}

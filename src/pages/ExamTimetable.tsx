import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Car,
  Check,
  Cog,
  Copy,
  Cpu,
  Globe,
  Monitor,
  Moon,
  Printer,
  Share2,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { VVIMP_BRANCHES, VVIMP_PRODUCTS, VvimpBranchKey } from '@/data/vvimpProducts';
import { EXAM_BRANCH_KEYS, EXAM_PAPERS, EXAM_PENDING_GUIDES, ExamPaper } from '@/data/examTimetableW26';

/* Same visual system as /vvimp-store: white storefront, deep-navy ink, royal blue,
   logo navy + cyan for brand moments. Schibsted Grotesk / Figtree / JetBrains Mono. */
const F_DISPLAY: React.CSSProperties = { fontFamily: '"Schibsted Grotesk","Segoe UI",system-ui,sans-serif' };
const F_BODY: React.CSSProperties = { fontFamily: 'Figtree,"Segoe UI",system-ui,-apple-system,sans-serif' };
const F_MONO: React.CSSProperties = { fontFamily: '"JetBrains Mono",ui-monospace,Consolas,monospace' };

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const LOGO_MARK = '/vvimp-logo-mark.png';
const LOGO_FULL = '/vvimp-logo-full.jpg';
const SITE = 'https://www.digidiploma.in';
const HELP_WA = '8432971897';
const BRANCH_ICON: Partial<Record<VvimpBranchKey, LucideIcon>> = {
  co: Monitor,
  it: Globe,
  ee: Zap,
  ej: Cpu,
  me: Cog,
  ae: Car,
  ce: Building2,
};

type Row = ExamPaper & { name: string; sem: number; price: number; url: string | null };
const PRODUCT = new Map(VVIMP_PRODUCTS.map((p) => [p.code, p]));
const ROWS: Row[] = EXAM_PAPERS.map((e) => {
  const p = PRODUCT.get(e.code)!;
  return { ...e, name: p.name, sem: p.semester, price: p.price, url: EXAM_PENDING_GUIDES.has(e.code) ? null : p.url };
}).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

const at = (date: string, hm: string) => new Date(`${date}T${hm}:00+05:30`).getTime();
const startOf = (r: Row) => at(r.date, r.start);
const endOf = (r: Row) => at(r.date, r.end);
const dateObj = (d: string) => new Date(`${d}T12:00:00+05:30`);
const fmtDate = (d: string, o: Intl.DateTimeFormatOptions) => dateObj(d).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', ...o });
const fmtHM = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};
const slot = (r: Row) => `${fmtHM(r.start)} – ${fmtHM(r.end)}`;
const istDay = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const daysBetween = (from: string, to: string) => Math.round((dateObj(to).getTime() - dateObj(from).getTime()) / 864e5);

const branchName = (k: VvimpBranchKey) => VVIMP_BRANCHES.find((b) => b.key === k)?.name ?? k.toUpperCase();
const branchCode = (k: VvimpBranchKey) => VVIMP_BRANCHES.find((b) => b.key === k)?.code ?? k.toUpperCase();
const isExamBranch = (v: string | null): v is VvimpBranchKey => !!v && (EXAM_BRANCH_KEYS as string[]).includes(v);

const FIRST = ROWS[0].date;
const LAST = ROWS[ROWS.length - 1].date;
const EXAM_DAYS = new Set(ROWS.map((r) => r.date)).size;

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

const Arrow: React.FC = () => (
  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-[#E2E7F0] text-[#1F4FE0] transition-colors group-hover:border-[#1F4FE0] group-hover:bg-[#1F4FE0] group-hover:text-white">
    <ArrowRight className="h-3.5 w-3.5" />
  </span>
);

const Track: React.FC<{ current: 1 | 2 | 3; branch?: string; sem?: string; onStep: (n: 1 | 2) => void }> = ({ current, branch, sem, onStep }) => {
  const steps = [
    { n: 1 as const, value: branch ?? 'Choose branch' },
    { n: 2 as const, value: sem ?? 'Choose semester' },
    { n: 3 as const, value: 'Your exam plan' },
  ];
  return (
    <nav aria-label="Progress" className="mb-6 flex flex-wrap gap-1.5">
      {steps.map((s) => {
        const done = s.n < current;
        const on = s.n === current;
        return (
          <button
            key={s.n}
            type="button"
            disabled={!done}
            aria-current={on ? 'step' : undefined}
            onClick={() => done && s.n !== 3 && onStep(s.n as 1 | 2)}
            className={[
              'flex items-center gap-2.5 rounded-xl border border-solid py-2 pl-2 pr-3.5 text-sm transition-colors',
              on
                ? 'border-[#1F4FE0] bg-white shadow-[0_0_0_3px_#EDF2FE] hover:bg-white'
                : done
                  ? 'cursor-pointer border-[#E2E7F0] bg-white hover:border-[#C9D4EA] hover:bg-white'
                  : 'cursor-default border-[#E2E7F0] bg-transparent hover:bg-transparent',
            ].join(' ')}
          >
            <span
              style={F_MONO}
              className={[
                'grid h-[26px] w-[26px] place-items-center rounded-lg border text-xs font-semibold',
                on ? 'border-[#1F4FE0] bg-[#1F4FE0] text-white' : done ? 'border-[#FFD54A] bg-[#FFD54A] text-[#0C1A33]' : 'border-[#E2E7F0] bg-[#F5F7FB] text-[#56647D]',
              ].join(' ')}
            >
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
            </span>
            <span className="max-w-[24ch] truncate font-semibold text-[#0C1A33]">{s.value}</span>
          </button>
        );
      })}
    </nav>
  );
};

const GhostBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...p }) => (
  <button
    type="button"
    {...p}
    className={`inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-solid border-[#E2E7F0] bg-white px-3.5 text-sm font-semibold text-[#0C1A33] hover:border-[#C9D4EA] hover:bg-white hover:shadow-none ${className}`}
  />
);

const pad = (n: number) => String(n).padStart(2, '0');

/** Navy panel: live countdown to the next paper + progress */
const PlanPanel: React.FC<{ rows: Row[]; now: number; title: string; onShare: () => void; onCopy: () => void; onPrint: () => void; copied: boolean }> = ({
  rows,
  now,
  title,
  onShare,
  onCopy,
  onPrint,
  copied,
}) => {
  const done = rows.filter((r) => endOf(r) <= now).length;
  const live = rows.find((r) => startOf(r) <= now && now < endOf(r));
  const next = rows.find((r) => startOf(r) > now);
  const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;
  const diff = next ? startOf(next) - now : 0;
  const parts = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];

  return (
    <section className="relative overflow-hidden rounded-[20px] bg-[#091629] p-5 text-white sm:p-7" aria-label="Exam countdown">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_100%_0%,#163A7A_0%,rgba(22,58,122,0)_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(180deg,#000,transparent_75%)]"
        style={{ backgroundImage: 'linear-gradient(rgba(45,226,238,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(45,226,238,.07) 1px,transparent 1px)', backgroundSize: '36px 36px' }}
      />
      <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="m-0 text-[11.5px] uppercase tracking-[.08em] text-[#2DE2EE]" style={F_MONO}>
            {live ? 'Paper in progress' : next ? 'Next paper starts in' : 'Exams complete'}
          </p>
          {live ? (
            <>
              <h3 className="mb-1 mt-2 text-[clamp(22px,3vw,30px)] font-extrabold tracking-[-0.025em]" style={F_DISPLAY}>{live.name}</h3>
              <p className="m-0 text-white/70">Ends at {fmtHM(live.end)} today. All the best!</p>
            </>
          ) : next ? (
            <>
              <div className="mt-3 flex gap-2 sm:gap-3" aria-live="off">
                {parts.map((v, i) => (
                  <div key={i} className="min-w-[62px] rounded-xl border border-white/15 bg-white/[.06] px-2.5 py-2 text-center sm:min-w-[76px]">
                    <b className="block text-[clamp(26px,4.6vw,40px)] font-extrabold leading-none tracking-[-0.03em] tabular-nums" style={F_DISPLAY}>
                      {i === 0 ? v : pad(v)}
                    </b>
                    <span className="mt-1 block text-[10.5px] uppercase tracking-[.08em] text-white/60" style={F_MONO}>
                      {['days', 'hrs', 'min', 'sec'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mb-0 mt-3.5 text-[15px] text-white/80">
                <b className="text-white">{next.name}</b> · {fmtDate(next.date, { weekday: 'short', day: 'numeric', month: 'short' })}, {fmtHM(next.start)}
              </p>
            </>
          ) : (
            <h3 className="mb-0 mt-2 text-[clamp(22px,3vw,30px)] font-extrabold tracking-[-0.025em]" style={F_DISPLAY}>All papers done. Well played!</h3>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-white/70">{title}</span>
            <b className="tabular-nums" style={F_MONO}>{done}/{rows.length} done</b>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={rows.length} aria-valuenow={done}>
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#2DE2EE,#FFD54A)] transition-[width] duration-700" style={{ width: `${Math.max(pct, done ? pct : 2)}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onShare} className="inline-flex h-10 items-center gap-2 rounded-[10px] border-0 bg-[#25D366] px-3.5 text-sm font-bold text-[#062A14] hover:bg-[#3ee07a]">
              <Share2 className="h-4 w-4" /> Share on WhatsApp
            </button>
            <button type="button" onClick={onCopy} className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-solid border-white/20 bg-white/[.06] px-3.5 text-sm font-semibold text-white hover:bg-white/[.12]">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy message'}
            </button>
            <button type="button" onClick={onPrint} className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-solid border-white/20 bg-white/[.06] px-3.5 text-sm font-semibold text-white hover:bg-white/[.12]">
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/** One exam paper on the timeline */
const PaperRow: React.FC<{ r: Row; now: number; today: string; showBranches: VvimpBranchKey[] }> = ({ r, now, today, showBranches }) => {
  const isDone = endOf(r) <= now;
  const isLive = startOf(r) <= now && now < endOf(r);
  const d = daysBetween(today, r.date);
  const when = isDone ? 'Done' : isLive ? 'Now' : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`;
  const tone = isDone ? 'bg-[#E3F4EC] text-[#0F8A5F]' : isLive || d <= 1 ? 'bg-[#FFD54A] text-[#0C1A33]' : d <= 4 ? 'bg-[#FFF3D1] text-[#7A5A00]' : 'bg-[#F5F7FB] text-[#56647D]';
  return (
    <article
      className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 rounded-2xl border border-[#E2E7F0] bg-white p-4 transition-shadow hover:shadow-[0_12px_32px_-18px_rgba(12,26,51,.28)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-[18px] ${isDone ? 'opacity-60' : ''} ${isLive ? 'ring-2 ring-[#1F4FE0]' : ''}`}
    >
      <div className="w-[64px] self-start overflow-hidden rounded-xl border border-[#E2E7F0] text-center">
        <span className="block bg-[#091629] py-1 text-[10.5px] font-semibold uppercase tracking-[.08em] text-[#2DE2EE]" style={F_MONO}>
          {fmtDate(r.date, { month: 'short' })}
        </span>
        <b className="block pt-1 text-[26px] font-extrabold leading-none tracking-[-0.03em]" style={F_DISPLAY}>{fmtDate(r.date, { day: 'numeric' })}</b>
        <span className="block pb-1.5 text-[11px] text-[#56647D]">{fmtDate(r.date, { weekday: 'short' })}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]" style={F_MONO}>
          <span className={`rounded-md px-[7px] py-[3px] font-semibold ${tone}`}>{when}</span>
          <span className="rounded-md border border-[#E2E7F0] bg-[#F5F7FB] px-[7px] py-[3px] text-[#56647D]">Day {r.day}</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-[#E2E7F0] bg-[#F5F7FB] px-[7px] py-[3px] text-[#56647D]">
            {r.session === 'M' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            {slot(r)}
          </span>
        </div>
        <h3 className="mb-0 mt-2 text-[17.5px] font-bold leading-[1.25] tracking-[-0.015em] text-[#0C1A33] [text-wrap:balance]" style={F_DISPLAY}>{r.name}</h3>
        <p className="m-0 mt-0.5 text-[13px] text-[#56647D]">
          <span style={F_MONO}>{r.code}</span> · Sem {ROMAN[r.sem - 1]} · {showBranches.map(branchCode).join(' · ')}
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-3 border-t border-[#E2E7F0] pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        {r.url ? (
          <>
            <span className="text-xs text-[#56647D] sm:order-2">VVIMP guide · ₹{r.price}</span>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get the VVIMP guide for ${r.name}, ₹${r.price}`}
              className="inline-flex h-[42px] items-center gap-2 whitespace-nowrap rounded-[11px] bg-[#1F4FE0] px-4 text-[14.5px] font-bold text-white transition-colors hover:bg-[#0B2A86] sm:order-1"
            >
              Get VVIMP <ArrowRight className="h-4 w-4" />
            </a>
          </>
        ) : (
          <>
            <span className="text-xs text-[#56647D] sm:order-2">Guide coming soon</span>
            <a
              href={`https://wa.me/91${HELP_WA}?text=${encodeURIComponent(`Hi, I need the VVIMP guide for ${r.name} (${r.code}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[42px] items-center gap-2 whitespace-nowrap rounded-[11px] border border-solid border-[#E2E7F0] bg-white px-4 text-[14.5px] font-bold text-[#0C1A33] hover:border-[#C9D4EA] sm:order-1"
            >
              Ask on WhatsApp
            </a>
          </>
        )}
      </div>
    </article>
  );
};

const ExamTimetable: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const now = useNow();
  const today = istDay(now);

  const bp = params.get('branch');
  const branch = isExamBranch(bp) ? bp : null;
  const branchRows = useMemo(() => (branch ? ROWS.filter((r) => r.branches.includes(branch)) : []), [branch]);
  const sp = params.get('sem');
  const semNum = Number(sp);
  const sem: number | 'all' | null =
    !branch ? null : sp === 'all' ? 'all' : semNum >= 1 && semNum <= 6 && branchRows.some((r) => r.sem === semNum) ? semNum : null;
  const step: 1 | 2 | 3 = !branch ? 1 : sem === null ? 2 : 3;
  const rows = useMemo(() => (sem === 'all' ? branchRows : branchRows.filter((r) => r.sem === sem)), [branchRows, sem]);
  const semLabel = sem === 'all' ? 'All semesters' : sem ? `Semester ${ROMAN[sem - 1]}` : undefined;
  const planTitle = branch && semLabel ? `${branchName(branch)} · ${semLabel}` : '';
  const pageUrl = branch && sem ? `${SITE}/exam-timetable?branch=${branch}&sem=${sem}` : `${SITE}/exam-timetable`;

  useEffect(() => {
    document.title = 'Winter 2026 Exam Timetable + VVIMP | DigiDiploma';
  }, []);
  useEffect(() => {
    if (step > 1) document.getElementById('tt-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, branch, sem]);

  const go = (b: VvimpBranchKey | null, s?: number | 'all' | null) => {
    const next = new URLSearchParams();
    if (b) next.set('branch', b);
    if (b && s) next.set('sem', String(s));
    setParams(next);
  };

  const byDate = useMemo(() => {
    const m = new Map<string, Row[]>();
    rows.forEach((r) => m.set(r.date, [...(m.get(r.date) ?? []), r]));
    return [...m.entries()];
  }, [rows]);

  const message = useMemo(() => {
    if (!branch) return '';
    let t = `📚 *MSBTE Winter 2026 – Exam timetable + VVIMP*\n*${branchName(branch)} · ${semLabel}*\n`;
    byDate.forEach(([d, list]) => {
      t += `\n🗓️ *${fmtDate(d, { weekday: 'short', day: 'numeric', month: 'short' })}* (Day ${list[0].day})\n`;
      list.forEach((r) => {
        t += `${r.session === 'M' ? '🌅' : '🌇'} ${sem === 'all' ? `Sem ${ROMAN[r.sem - 1]} – ` : ''}${r.name} (${r.code}), ${fmtHM(r.start)}\n`;
        t += r.url ? `👉 ${r.url}\n` : `👉 Guide coming soon – WhatsApp ${HELP_WA}\n`;
      });
    });
    t += `\nFull plan with countdown: ${pageUrl}\nSubject missing? WhatsApp ${HELP_WA}`;
    return t;
  }, [branch, semLabel, byDate, sem, pageUrl]);

  const share = () => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0C1A33] antialiased print:bg-white" style={F_BODY}>
      <style>{'@page{size:A4;margin:14mm} @media print{html,body{background:#fff!important}}'}</style>

      <div className="print:hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-[#E2E7F0] bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-4 px-4 sm:px-6">
            <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="DigiDiploma home">
              <img src={LOGO_MARK} alt="" width={40} height={40} className="h-10 w-10 rounded-[11px] bg-[#091629] shadow-[0_0_0_1px_rgba(45,226,238,.25),0_6px_14px_-8px_rgba(9,22,41,.8)]" />
              <b className="text-lg font-extrabold tracking-[-0.02em]" style={F_DISPLAY}>DigiDiploma</b>
            </Link>
            <nav className="hidden items-center gap-1 text-sm font-semibold lg:flex">
              <Link to="/" className="rounded-lg px-2.5 py-1.5 text-[#56647D] hover:bg-[#F5F7FB] hover:text-[#0C1A33]">Home</Link>
              <Link to="/materials" className="rounded-lg px-2.5 py-1.5 text-[#56647D] hover:bg-[#F5F7FB] hover:text-[#0C1A33]">Materials</Link>
              <Link to="/vvimp-store" className="rounded-lg px-2.5 py-1.5 text-[#56647D] hover:bg-[#F5F7FB] hover:text-[#0C1A33]">VVIMP Store</Link>
            </nav>
            <Link to="/vvimp-store" className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-[#1F4FE0] px-3.5 text-sm font-bold text-white hover:bg-[#0B2A86]">
              All guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="border-b border-[#E2E7F0] bg-white">
          <div className="mx-auto grid max-w-[1160px] items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_.9fr] md:gap-12 md:py-14">
            <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EDF2FE] px-3 py-1 text-xs text-[#0B2A86]" style={F_MONO}>
              <CalendarDays className="h-3.5 w-3.5" /> MSBTE Winter 2026 · K-Scheme theory
            </span>
            <h1 className="mb-4 mt-[18px] max-w-[18ch] text-[clamp(34px,5.2vw,58px)] font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]" style={F_DISPLAY}>
              Your exam timetable, with the{' '}
              <mark className="bg-transparent bg-[linear-gradient(transparent_58%,#FFD54A_58%,#FFD54A_92%,transparent_92%)] px-[.04em] text-inherit">VVIMP guide</mark> for every paper.
            </h1>
            <p className="m-0 max-w-[52ch] text-[17.5px] text-[#56647D]">
              Pick your branch and semester. You get your papers day by day, a live countdown to the next one, and the guide link for each subject.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5 border-t border-[#E2E7F0] pt-5">
              {[
                [String(ROWS.length), 'K-Scheme papers'],
                [String(EXAM_DAYS), 'exam days'],
                [`${fmtDate(FIRST, { day: 'numeric', month: 'short' })} – ${fmtDate(LAST, { day: 'numeric', month: 'short' })}`, 'exam window'],
              ].map(([b, s]) => (
                <div key={s} className="flex flex-col">
                  <b className="text-[26px] font-extrabold tracking-[-0.02em] tabular-nums" style={F_DISPLAY}>{b}</b>
                  <span className="text-[13px] text-[#56647D]">{s}</span>
                </div>
              ))}
            </div>
            </div>

            {/* Preview: the first exam day */}
            <div className="relative hidden pb-3.5 pl-1 pr-3 pt-2.5 md:block" aria-label="First exam day preview">
              <div className="absolute inset-[18px_0_0_18px] rotate-[1.4deg] rounded-[18px] bg-[#EDF2FE] motion-reduce:rotate-0" />
              <div className="relative z-[1] -rotate-[1.2deg] rounded-[18px] border border-[#E2E7F0] bg-white px-[22px] pb-[18px] pt-[22px] shadow-[0_30px_60px_-30px_rgba(12,26,51,.35)] motion-reduce:rotate-0">
                <div className="flex items-baseline justify-between gap-2.5 border-b-2 border-[#0C1A33] pb-2.5">
                  <b className="text-xl font-extrabold tracking-[-0.02em]" style={F_DISPLAY}>Day 1 · {fmtDate(FIRST, { weekday: 'short', day: 'numeric', month: 'short' })}</b>
                  <span className="text-[11.5px] text-[#56647D]" style={F_MONO}>2:00 – 5:00 PM</span>
                </div>
                {ROWS.filter((r) => r.date === FIRST).slice(0, 5).map((r) => (
                  <div key={r.code} className="grid grid-cols-[1fr_auto] items-center gap-2.5 border-b border-dashed border-[#E2E7F0] py-2.5 text-sm last:border-b-0">
                    <span>
                      <b className="font-semibold">{r.name}</b>
                      <span className="ml-2 text-[11px] text-[#56647D]" style={F_MONO}>{r.branches.map(branchCode).join('/')}-{ROMAN[r.sem - 1]}</span>
                    </span>
                    <span className="whitespace-nowrap rounded-md bg-[#0C1A33] px-[7px] py-[3px] text-[10.5px] font-semibold tracking-[.04em] text-white" style={F_MONO}>VVIMP ₹{r.price}</span>
                  </div>
                ))}
                <p className="mb-0 mt-2.5 text-xs text-[#56647D]">Every paper in the timetable links to its unit-wise VVIMP guide.</p>
              </div>
            </div>
          </div>
        </section>

        <main id="tt-stage" className="mx-auto max-w-[1160px] scroll-mt-20 px-4 pb-14 pt-11 sm:px-6" aria-live="polite">
          <Track current={step} branch={branch ? branchName(branch) : undefined} sem={semLabel} onStep={(n) => (n === 1 ? go(null) : go(branch))} />

          {step === 1 && (
            <section aria-labelledby="tt-h1">
              <div className="mb-5">
                <h2 id="tt-h1" className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>Choose your branch</h2>
                <p className="mt-1 max-w-[62ch] text-[#56647D]">Common papers like Applied Mathematics show up inside every branch that writes them.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EXAM_BRANCH_KEYS.map((k) => {
                  const list = ROWS.filter((r) => r.branches.includes(k));
                  const sems = new Set<number>(list.map((r) => r.sem));
                  const Icon = BRANCH_ICON[k] ?? Monitor;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => go(k)}
                      className="group relative flex flex-col gap-3.5 overflow-hidden rounded-2xl border border-solid border-[#E2E7F0] bg-white p-[18px] text-left font-normal text-[#0C1A33] transition-all duration-150 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,#1F4FE0,#2DE2EE)] before:opacity-0 before:transition-opacity hover:-translate-y-[3px] hover:border-[#C3D0F2] hover:bg-white hover:shadow-[0_12px_32px_-18px_rgba(12,26,51,.28)] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FE0]"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-[#EDF2FE] text-[#1F4FE0] transition-colors group-hover:bg-[#091629] group-hover:text-[#2DE2EE]">
                          <Icon className="h-6 w-6" strokeWidth={1.8} />
                        </span>
                        <span className="rounded-md border border-[#E2E7F0] px-[7px] py-[3px] text-[11.5px] font-semibold text-[#56647D]" style={F_MONO}>{branchCode(k)}</span>
                      </span>
                      <span>
                        <b className="block text-lg font-bold leading-[1.2] tracking-[-0.015em]" style={F_DISPLAY}>{branchName(k)}</b>
                        <small className="text-[13.5px] text-[#56647D]">{list.length} papers this winter</small>
                      </span>
                      <span className="grid grid-cols-6 gap-1" aria-label="Semesters with papers">
                        {ROMAN.map((r, i) => (
                          <span
                            key={r}
                            style={F_MONO}
                            className={[
                              'grid h-6 place-items-center rounded-[7px] border text-[10.5px] font-semibold',
                              sems.has(i + 1) ? 'border-transparent bg-[#EDF2FE] text-[#0B2A86]' : 'border-[#E2E7F0] bg-[#F5F7FB] text-[#A3AEC2]',
                            ].join(' ')}
                          >
                            {r}
                          </span>
                        ))}
                      </span>
                      <span className="flex items-center justify-between border-t border-[#E2E7F0] pt-3 text-[13.5px] font-semibold text-[#1F4FE0]">
                        Choose semester <Arrow />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && branch && (
            <section aria-labelledby="tt-h2">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="tt-h2" className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>{branchName(branch)}</h2>
                  <p className="mt-1 text-[#56647D]">{branchRows.length} papers this winter. Pick your semester.</p>
                </div>
                <GhostBtn onClick={() => go(null)}>
                  <ArrowLeft className="h-4 w-4" /> All branches
                </GhostBtn>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((s) => {
                  const list = branchRows.filter((r) => r.sem === s);
                  if (!list.length) return null;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => go(branch, s)}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[14px] border border-solid border-[#E2E7F0] bg-white p-4 text-left font-normal text-[#0C1A33] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1F4FE0] hover:bg-white hover:shadow-[0_12px_32px_-18px_rgba(12,26,51,.28)]"
                    >
                      <span className="min-w-[52px] text-center text-[30px] font-extrabold tracking-[-0.03em] text-[#1F4FE0]" style={F_DISPLAY}>{ROMAN[s - 1]}</span>
                      <span className="min-w-0">
                        <b className="block text-[17px] font-bold" style={F_DISPLAY}>
                          Semester {ROMAN[s - 1]}
                          <span className="ml-1.5 rounded-md bg-[#FFD54A] px-[7px] py-0.5 text-xs font-semibold text-[#0C1A33]" style={F_MONO}>
                            {list.length} paper{list.length > 1 ? 's' : ''}
                          </span>
                        </b>
                        <small className="text-[13px] text-[#56647D]">
                          {list[0].date === list[list.length - 1].date
                            ? fmtDate(list[0].date, { day: 'numeric', month: 'short' })
                            : `${fmtDate(list[0].date, { day: 'numeric', month: 'short' })} – ${fmtDate(list[list.length - 1].date, { day: 'numeric', month: 'short' })}`}
                        </small>
                        <span className="mt-1.5 block truncate text-[12.5px] text-[#56647D]">{list.map((r) => r.name).join(' · ')}</span>
                      </span>
                      <Arrow />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => go(branch, 'all')}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[14px] border border-dashed border-[#C9D4EA] bg-transparent p-4 text-left font-normal text-[#0C1A33] transition-all duration-150 hover:border-[#1F4FE0] hover:bg-white"
                >
                  <span className="min-w-[52px] text-center text-[22px] font-extrabold tracking-[-0.03em] text-[#1F4FE0]" style={F_DISPLAY}>All</span>
                  <span>
                    <b className="block text-[17px] font-bold" style={F_DISPLAY}>All semesters</b>
                    <small className="text-[13px] text-[#56647D]">Full {branchCode(branch)} timetable, handy for backlog papers</small>
                  </span>
                  <Arrow />
                </button>
              </div>
            </section>
          )}

          {step === 3 && branch && (
            <section aria-labelledby="tt-h3">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="tt-h3" className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>{planTitle}</h2>
                  <p className="mt-1 text-[#56647D]">
                    {rows.length} paper{rows.length > 1 ? 's' : ''} · {fmtDate(rows[0].date, { day: 'numeric', month: 'short' })} to {fmtDate(rows[rows.length - 1].date, { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <GhostBtn onClick={() => go(branch)}>
                  <ArrowLeft className="h-4 w-4" /> Change semester
                </GhostBtn>
              </div>

              <PlanPanel rows={rows} now={now} title={planTitle} onShare={share} onCopy={copy} onPrint={() => window.print()} copied={copied} />

              <div className="mt-7 grid gap-3">
                {rows.map((r, i) => {
                  const gap = i > 0 ? daysBetween(rows[i - 1].date, r.date) - 1 : 0;
                  return (
                    <React.Fragment key={r.code}>
                      {gap > 0 && (
                        <p className="m-0 flex items-center gap-3 py-1 text-[11.5px] uppercase tracking-[.08em] text-[#56647D] before:h-px before:w-6 before:bg-[#C9D4EA] after:h-px after:flex-1 after:bg-[#E2E7F0]" style={F_MONO}>
                          {gap} day{gap > 1 ? 's' : ''} to revise
                        </p>
                      )}
                      <PaperRow r={r} now={now} today={today} showBranches={r.branches.filter((b) => b === branch)} />
                    </React.Fragment>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        <section className="border-t border-[#E2E7F0] bg-white">
          <div className="mx-auto max-w-[1160px] px-4 py-8 text-sm text-[#56647D] sm:px-6">
            <p className="m-0 max-w-[80ch]">
              Dates and times are from the MSBTE Winter 2026 final theory timetable as issued for Government Polytechnic Awasari (Khurd), 1051. Always confirm against your hall ticket and your institute's notice. Only K-Scheme papers are listed.
            </p>
            <p className="mb-0 mt-2">
              Subject missing or a link not working? <b className="text-[#0C1A33]">WhatsApp {HELP_WA}</b> · chaitanya.zagade@digidiploma.in
            </p>
          </div>
        </section>

        <footer className="bg-[#091629] text-sm text-white/70">
          <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-x-8 gap-y-3.5 px-4 py-7 sm:px-6">
            <span className="flex items-center gap-4">
              <img src={LOGO_FULL} alt="DigiDiploma logo" width={96} height={78} className="h-auto w-24 rounded-[10px]" />
              <span>
                Study smart, not hard.
                <br />
                MSBTE K-Scheme VVIMP guides
              </span>
            </span>
            <span className="text-[12.5px]" style={F_MONO}>digidiploma.in · digidiplomahelp@gmail.com</span>
          </div>
        </footer>
      </div>

      {/* Print / PDF view */}
      {step === 3 && branch && (
        <div className="hidden bg-white text-[#0C1A33] print:block">
          <div className="flex items-center justify-between border-b-2 border-[#0C1A33] pb-3">
            <div className="flex items-center gap-3">
              <img src={LOGO_MARK} alt="" width={44} height={44} className="h-11 w-11 rounded-[10px] bg-[#091629]" />
              <div>
                <b className="block text-xl font-extrabold tracking-[-0.02em]" style={F_DISPLAY}>Winter 2026 exam timetable</b>
                <span className="text-sm text-[#56647D]">{planTitle} · MSBTE K-Scheme</span>
              </div>
            </div>
            <span className="text-xs text-[#56647D]" style={F_MONO}>digidiploma.in/exam-timetable</span>
          </div>
          <table className="mt-4 w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-[.06em] text-[#56647D]" style={F_MONO}>
                <th className="border-b border-[#C9D4EA] py-2 pr-2">Day</th>
                <th className="border-b border-[#C9D4EA] py-2 pr-2">Date</th>
                <th className="border-b border-[#C9D4EA] py-2 pr-2">Time</th>
                <th className="border-b border-[#C9D4EA] py-2 pr-2">Code</th>
                <th className="border-b border-[#C9D4EA] py-2 pr-2">Subject</th>
                <th className="border-b border-[#C9D4EA] py-2">VVIMP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code} className="break-inside-avoid align-top">
                  <td className="border-b border-[#E2E7F0] py-2 pr-2" style={F_MONO}>{r.day}</td>
                  <td className="whitespace-nowrap border-b border-[#E2E7F0] py-2 pr-2 font-semibold">{fmtDate(r.date, { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                  <td className="whitespace-nowrap border-b border-[#E2E7F0] py-2 pr-2">{slot(r)}</td>
                  <td className="border-b border-[#E2E7F0] py-2 pr-2" style={F_MONO}>{r.code}</td>
                  <td className="border-b border-[#E2E7F0] py-2 pr-2 font-semibold">
                    {r.name}
                    {sem === 'all' ? <span className="font-normal text-[#56647D]"> · Sem {ROMAN[r.sem - 1]}</span> : null}
                  </td>
                  <td className="whitespace-nowrap border-b border-[#E2E7F0] py-2">{r.url ? `₹${r.price} · digidiploma.in` : 'Coming soon'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[11px] text-[#56647D]">
            Source: MSBTE Winter 2026 final theory timetable (GP Awasari (Khurd), 1051). Confirm with your hall ticket. Get each subject's VVIMP guide at digidiploma.in/vvimp-store · WhatsApp {HELP_WA}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExamTimetable;

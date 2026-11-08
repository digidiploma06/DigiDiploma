import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  Car,
  Check,
  Cog,
  Cpu,
  Globe,
  Monitor,
  Search,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  VVIMP_BRANCHES,
  VVIMP_PRODUCTS,
  VvimpBranchKey,
  VvimpProduct,
  productsForBranch,
  vvimpPriceForSemester,
} from '@/data/vvimpProducts';

/* Design: white storefront, deep-navy ink and royal blue, with the logo's navy + cyan
   used for brand moments. Display: Schibsted Grotesk; body: Figtree; codes: JetBrains Mono. */
const F_DISPLAY: React.CSSProperties = { fontFamily: '"Schibsted Grotesk","Segoe UI",system-ui,sans-serif' };
const F_BODY: React.CSSProperties = { fontFamily: 'Figtree,"Segoe UI",system-ui,-apple-system,sans-serif' };
const F_MONO: React.CSSProperties = { fontFamily: '"JetBrains Mono",ui-monospace,Consolas,monospace' };

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const YEARS: { label: string; sems: number[] }[] = [
  { label: 'First year', sems: [1, 2] },
  { label: 'Second year', sems: [3, 4] },
  { label: 'Third year', sems: [5, 6] },
];
const LOGO_MARK = '/vvimp-logo-mark.png';
const LOGO_FULL = '/vvimp-logo-full.jpg';
const BRANCH_ICON: Record<VvimpBranchKey, LucideIcon> = {
  co: Monitor,
  it: Globe,
  an: Sparkles,
  ee: Zap,
  ej: Cpu,
  me: Cog,
  mk: Bot,
  ae: Car,
  ce: Building2,
};

const isBranchKey = (v: string | null): v is VvimpBranchKey =>
  !!v && VVIMP_BRANCHES.some((b) => b.key === v);

const branchCode = (k: VvimpBranchKey) => VVIMP_BRANCHES.find((b) => b.key === k)?.code ?? k.toUpperCase();
const forText = (p: VvimpProduct) => {
  if (p.common) return 'All branches';
  if (p.branches.length === 1) return VVIMP_BRANCHES.find((b) => b.key === p.branches[0])?.name ?? p.branchLabel;
  return p.branches.map(branchCode).join(' · ');
};

const Arrow: React.FC = () => (
  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-[#E2E7F0] text-[#1F4FE0] transition-colors group-hover:border-[#1F4FE0] group-hover:bg-[#1F4FE0] group-hover:text-white">
    <ArrowRight className="h-3.5 w-3.5" />
  </span>
);

/** Branch -> Semester -> Subject tracker */
const Track: React.FC<{ current: 1 | 2 | 3; branchName?: string; sem?: number; onStep: (n: 1 | 2) => void }> = ({
  current,
  branchName,
  sem,
  onStep,
}) => {
  const steps = [
    { n: 1 as const, value: branchName ?? 'Choose branch' },
    { n: 2 as const, value: sem ? `Semester ${ROMAN[sem - 1]}` : 'Choose semester' },
    { n: 3 as const, value: 'Buy your guide' },
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
                ? 'border-[#1F4FE0] bg-white hover:bg-white shadow-[0_0_0_3px_#EDF2FE]'
                : done
                  ? 'cursor-pointer border-[#E2E7F0] bg-white hover:bg-white hover:border-[#C9D4EA]'
                  : 'cursor-default border-[#E2E7F0] bg-transparent hover:bg-transparent',
            ].join(' ')}
          >
            <span
              style={F_MONO}
              className={[
                'grid h-[26px] w-[26px] place-items-center rounded-lg border text-xs font-semibold',
                on
                  ? 'border-[#1F4FE0] bg-[#1F4FE0] text-white'
                  : done
                    ? 'border-[#FFD54A] bg-[#FFD54A] text-[#0C1A33]'
                    : 'border-[#E2E7F0] bg-[#F5F7FB] text-[#56647D]',
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

/** Subject card: cover, codes, who it's for, price and Buy now */
const ProductCard: React.FC<{ p: VvimpProduct }> = ({ p }) => {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E7F0] bg-white transition-all duration-150 hover:-translate-y-[3px] hover:border-[#C9D4EA] hover:shadow-[0_12px_32px_-18px_rgba(12,26,51,.28)]">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="block aspect-[16/9] overflow-hidden bg-[#EDF2FE]"
      >
        {imgOk ? (
          <img
            src={`/vvimp-covers/${p.code}.jpg`}
            alt=""
            loading="lazy"
            width={640}
            height={360}
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center p-4 text-center text-sm font-semibold text-[#0B2A86]" style={F_DISPLAY}>
            {p.name}
          </div>
        )}
      </a>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]" style={F_MONO}>
          <span className="rounded-md bg-[#EDF2FE] px-[7px] py-[3px] font-semibold text-[#0B2A86]">Sem {ROMAN[p.semester - 1]}</span>
          <span className="rounded-md border border-[#E2E7F0] bg-[#F5F7FB] px-[7px] py-[3px] text-[#56647D]">{p.code}</span>
          {p.pages ? (
            <span className="rounded-md border border-[#E2E7F0] bg-[#F5F7FB] px-[7px] py-[3px] text-[#56647D]">{p.pages} pages</span>
          ) : null}
          {p.common ? <span className="rounded-md bg-[#E3F4EC] px-[7px] py-[3px] font-semibold text-[#0F8A5F]">Common</span> : null}
        </div>
        <h3 className="mt-0.5 text-[17.5px] font-bold leading-[1.25] tracking-[-0.015em] text-[#0C1A33] [text-wrap:balance]" style={F_DISPLAY}>
          {p.name}
        </h3>
        <p className="m-0 text-[13px] text-[#56647D]">For {forText(p)}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#E2E7F0] pt-3.5">
          <div className="flex flex-col leading-tight">
            <b className="text-2xl font-extrabold tracking-[-0.02em] text-[#0C1A33]" style={F_DISPLAY}>₹{p.price}</b>
            <small className="text-xs text-[#56647D]">Instant PDF</small>
          </div>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buy ${p.name} for ₹${p.price}`}
            className="inline-flex h-[42px] items-center gap-2 whitespace-nowrap rounded-[11px] bg-[#1F4FE0] px-4 text-[14.5px] font-bold text-white transition-colors hover:bg-[#0B2A86]"
          >
            Buy now <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

const SAMPLE_ROWS: [string, 'VVIMP' | 'IMP'][] = [
  ['Draw and explain process state diagram.', 'VVIMP'],
  ['Explain any two multithreading models with suitable diagram.', 'VVIMP'],
  ['List the types of scheduler and describe the function of each.', 'VVIMP'],
  ['Explain process control block with the help of neat diagram.', 'IMP'],
];

const FAQ: [string, string][] = [
  [
    'How do I get the PDF after paying?',
    'Tap Buy now, complete payment on the Superprofile page, and the PDF is available to download right away. Use the same email if you need to download it again.',
  ],
  ['How much does a guide cost?', 'Odd-semester subjects (I, III, V) are ₹64. Even-semester subjects (II, IV, VI) are ₹99.'],
  [
    'My subject is common to many branches. Where is it?',
    'Common subjects such as Basic Mathematics appear under every branch they belong to, so you will find them inside your own branch.',
  ],
  [
    "I can't find my subject.",
    'Search by the 6-digit course code at the top of the page. If it is still missing, email digidiplomahelp@gmail.com with the subject name and code.',
  ],
];

const VvimpStore: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const branchParam = params.get('branch');
  const branch = isBranchKey(branchParam) ? branchParam : null;
  const semRaw = Number(params.get('sem'));
  const branchItems = useMemo(() => (branch ? productsForBranch(branch) : []), [branch]);
  const sem = branch && semRaw >= 1 && semRaw <= 6 && branchItems.some((p) => p.semester === semRaw) ? semRaw : null;
  const branchInfo = VVIMP_BRANCHES.find((b) => b.key === branch);
  const step: 1 | 2 | 3 = !branch ? 1 : !sem ? 2 : 3;
  const term = query.trim().toLowerCase();
  const searching = term.length >= 2;

  useEffect(() => {
    document.title = 'VVIMP Store | DigiDiploma';
  }, []);

  useEffect(() => {
    if (step > 1) document.getElementById('vvimp-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, branch, sem]);

  const go = (b: VvimpBranchKey | null, s?: number | null) => {
    setQuery('');
    const next = new URLSearchParams();
    if (b) next.set('branch', b);
    if (b && s) next.set('sem', String(s));
    setParams(next);
  };

  const semItems = useMemo(
    () =>
      sem
        ? branchItems
            .filter((p) => p.semester === sem)
            .sort((a, b) => Number(a.common) - Number(b.common) || a.code.localeCompare(b.code))
        : [],
    [branchItems, sem],
  );
  const results = useMemo(
    () => (searching ? VVIMP_PRODUCTS.filter((p) => p.name.toLowerCase().includes(term) || p.code.includes(term)) : []),
    [searching, term],
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0C1A33] antialiased" style={F_BODY}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#E2E7F0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="DigiDiploma home">
            <img
              src={LOGO_MARK}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-[11px] bg-[#091629] shadow-[0_0_0_1px_rgba(45,226,238,.25),0_6px_14px_-8px_rgba(9,22,41,.8)]"
            />
            <b className="hidden text-lg font-extrabold tracking-[-0.02em] sm:block" style={F_DISPLAY}>DigiDiploma</b>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-semibold lg:flex">
            <Link to="/" className="rounded-lg px-2.5 py-1.5 text-[#56647D] hover:bg-[#F5F7FB] hover:text-[#0C1A33]">Home</Link>
            <Link to="/materials" className="rounded-lg px-2.5 py-1.5 text-[#56647D] hover:bg-[#F5F7FB] hover:text-[#0C1A33]">Materials</Link>
            <Link to="/projects" className="rounded-lg px-2.5 py-1.5 text-[#56647D] hover:bg-[#F5F7FB] hover:text-[#0C1A33]">Projects</Link>
          </nav>
          <label htmlFor="vvimp-q" className="relative ml-auto w-full max-w-[440px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#56647D]" />
            <input
              id="vvimp-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('vvimp-stage')?.scrollIntoView({ behavior: 'smooth' })}
              placeholder="Search subject name or code, e.g. 315319"
              aria-label="Search subjects"
              autoComplete="off"
              className="h-[42px] w-full rounded-[11px] border border-[#E2E7F0] bg-[#F5F7FB] pl-[38px] pr-3.5 text-[14.5px] transition-colors focus:border-[#1F4FE0] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#EDF2FE]"
            />
          </label>
          <span className="hidden shrink-0 text-xs text-[#56647D] md:block" style={F_MONO}>{VVIMP_PRODUCTS.length} guides</span>
        </div>
      </header>

      {/* Hero */}
      <section className="overflow-x-clip border-b border-[#E2E7F0] bg-white">
        <div className="mx-auto grid max-w-[1160px] items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:gap-12 md:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EDF2FE] px-3 py-1 text-xs text-[#0B2A86]" style={F_MONO}>
              <i className="h-1.5 w-1.5 rounded-full bg-[#1F4FE0]" />
              MSBTE K-Scheme · Sem I to VI
            </span>
            <h1
              className="mb-4 mt-[18px] text-[clamp(34px,5.2vw,58px)] font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]"
              style={F_DISPLAY}
            >
              Study the questions that{' '}
              <mark className="bg-transparent bg-[linear-gradient(transparent_58%,#FFD54A_58%,#FFD54A_92%,transparent_92%)] px-[.04em] text-inherit">
                actually come
              </mark>{' '}
              in your exam.
            </h1>
            <p className="m-0 max-w-[46ch] text-[17.5px] text-[#56647D]">
              Unit-wise VVIMP guides for every diploma branch. Each question is tagged VVIMP or IMP, so you know what to revise first.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="#vvimp-stage"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#1F4FE0] px-5 font-bold text-white shadow-[0_10px_22px_-12px_rgba(31,79,224,.9)] hover:bg-[#0B2A86]"
              >
                Find my subject <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#vvimp-inside" className="inline-flex h-12 items-center rounded-xl border border-[#E2E7F0] bg-white px-5 font-bold hover:border-[#C9D4EA]">
                What's inside
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5 border-t border-[#E2E7F0] pt-5">
              {[
                [String(VVIMP_PRODUCTS.length), 'subject guides'],
                [String(VVIMP_BRANCHES.length), 'branches'],
                ['₹64 / ₹99', 'odd / even semester'],
              ].map(([b, s]) => (
                <div key={s} className="flex flex-col">
                  <b className="text-[26px] font-extrabold tracking-[-0.02em] tabular-nums" style={F_DISPLAY}>{b}</b>
                  <span className="text-[13px] text-[#56647D]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specimen page from a real guide */}
          <div className="relative pb-3.5 pl-1 pr-3 pt-2.5">
            <div className="absolute inset-[18px_0_0_18px] rotate-[1.4deg] rounded-[18px] bg-[#EDF2FE] motion-reduce:rotate-0" />
            <div
              className="relative z-[1] -rotate-[1.2deg] rounded-[18px] border border-[#E2E7F0] bg-white px-[22px] pb-[18px] pt-[22px] shadow-[0_30px_60px_-30px_rgba(12,26,51,.35)] motion-reduce:rotate-0"
              aria-label="Sample rows from the Operating System guide"
            >
              <div className="flex items-baseline justify-between gap-2.5 border-b-2 border-[#0C1A33] pb-2.5">
                <b className="text-xl font-extrabold tracking-[-0.02em]" style={F_DISPLAY}>Operating System</b>
                <span className="text-[11.5px] text-[#56647D]" style={F_MONO}>315319 · Sem V</span>
              </div>
              <div className="mb-1.5 mt-3.5 flex justify-between text-[11px] uppercase tracking-[.06em] text-[#0B2A86]" style={F_MONO}>
                <span>Unit 02 · Process Management</span>
                <span>4 marks</span>
              </div>
              {SAMPLE_ROWS.map(([q, tag], i) => (
                <div key={q} className="grid grid-cols-[28px_1fr_auto] items-start gap-2.5 border-b border-dashed border-[#E2E7F0] py-2.5 text-sm last:border-b-0">
                  <em className="pt-0.5 text-xs not-italic text-[#56647D]" style={F_MONO}>{String(i + 1).padStart(2, '0')}.</em>
                  <span>{q}</span>
                  <span
                    style={F_MONO}
                    className={[
                      'whitespace-nowrap rounded-md px-[7px] py-[3px] text-[10.5px] font-semibold tracking-[.04em]',
                      tag === 'VVIMP' ? 'bg-[#0C1A33] text-white' : 'bg-[#EDF2FE] text-[#0B2A86]',
                    ].join(' ')}
                  >
                    {tag}
                  </span>
                </div>
              ))}
              <p className="mt-2.5 text-xs text-[#56647D]">Sample rows from the guide. Every unit has 2, 4 and 6-mark sections plus a Top 10.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chooser */}
      <main id="vvimp-stage" className="mx-auto max-w-[1160px] scroll-mt-20 px-4 pb-14 pt-11 sm:px-6" aria-live="polite">
        {searching ? (
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>
                  Results for “{query.trim()}”
                </h2>
                <p className="mt-1 text-[#56647D]">
                  {results.length} guide{results.length === 1 ? '' : 's'} found across all branches
                </p>
              </div>
              <button type="button" onClick={() => setQuery('')} className="inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-solid border-[#E2E7F0] bg-white px-3.5 text-sm font-semibold text-[#0C1A33] hover:border-[#C9D4EA] hover:bg-white hover:shadow-none">
                Clear search
              </button>
            </div>
            {results.length ? (
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-[repeat(auto-fill,minmax(258px,1fr))]">
                {results.map((p) => <ProductCard key={p.code} p={p} />)}
              </div>
            ) : (
              <div className="rounded-[14px] border border-dashed border-[#C9D4EA] bg-white p-7 text-center text-[#56647D]">
                No guide matches that name or code. Try a shorter word, or browse by branch.
              </div>
            )}
          </section>
        ) : (
          <>
            <Track current={step} branchName={branchInfo?.name} sem={sem ?? undefined} onStep={(n) => (n === 1 ? go(null) : go(branch))} />

            {step === 1 && (
              <section aria-labelledby="vv-h1">
                <div className="mb-5">
                  <h2 id="vv-h1" className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>Choose your branch</h2>
                  <p className="mt-1 max-w-[62ch] text-[#56647D]">Common subjects like Basic Mathematics and Communication Skills are listed inside every branch.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {VVIMP_BRANCHES.map((b) => {
                    const items = productsForBranch(b.key);
                    const sems = new Set<number>(items.map((p) => p.semester));
                    const Icon = BRANCH_ICON[b.key];
                    return (
                      <button
                        key={b.key}
                        type="button"
                        onClick={() => go(b.key)}
                        className="group relative flex flex-col gap-3.5 overflow-hidden rounded-2xl border border-solid border-[#E2E7F0] bg-white p-[18px] text-left font-normal text-[#0C1A33] hover:bg-white transition-all duration-150 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,#1F4FE0,#2DE2EE)] before:opacity-0 before:transition-opacity hover:-translate-y-[3px] hover:border-[#C3D0F2] hover:shadow-[0_12px_32px_-18px_rgba(12,26,51,.28)] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FE0]"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-[#EDF2FE] text-[#1F4FE0] transition-colors group-hover:bg-[#091629] group-hover:text-[#2DE2EE]">
                            <Icon className="h-6 w-6" strokeWidth={1.8} />
                          </span>
                          <span className="rounded-md border border-[#E2E7F0] px-[7px] py-[3px] text-[11.5px] font-semibold text-[#56647D]" style={F_MONO}>{b.code}</span>
                        </span>
                        <span>
                          <b className="block text-lg font-bold leading-[1.2] tracking-[-0.015em]" style={F_DISPLAY}>{b.name}</b>
                          <small className="text-[13.5px] text-[#56647D]">{items.length} subject guides</small>
                        </span>
                        <span className="grid grid-cols-6 gap-1" aria-label="Semesters available">
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

            {step === 2 && branchInfo && (
              <section aria-labelledby="vv-h2">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="vv-h2" className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>{branchInfo.name}</h2>
                    <p className="mt-1 text-[#56647D]">{branchItems.length} guides across six semesters. Pick your semester.</p>
                  </div>
                  <button type="button" onClick={() => go(null)} className="inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-solid border-[#E2E7F0] bg-white px-3.5 text-sm font-semibold text-[#0C1A33] hover:border-[#C9D4EA] hover:bg-white hover:shadow-none">
                    <ArrowLeft className="h-4 w-4" /> All branches
                  </button>
                </div>
                {YEARS.map((y) => (
                  <div key={y.label}>
                    <p className={`mb-2.5 ${y.sems[0] === 1 ? 'mt-0' : 'mt-7'} flex items-center gap-3 text-[11.5px] uppercase tracking-[.08em] text-[#56647D] after:h-px after:flex-1 after:bg-[#E2E7F0]`} style={F_MONO}>
                      {y.label}
                    </p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {y.sems.map((s) => {
                        const list = branchItems.filter((p) => p.semester === s);
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={!list.length}
                            onClick={() => go(branch, s)}
                            className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[14px] border border-solid border-[#E2E7F0] bg-white p-4 text-left font-normal text-[#0C1A33] hover:bg-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1F4FE0] hover:shadow-[0_12px_32px_-18px_rgba(12,26,51,.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-[#E2E7F0] disabled:hover:shadow-none"
                          >
                            <span className="min-w-[52px] text-center text-[30px] font-extrabold tracking-[-0.03em] text-[#1F4FE0]" style={F_DISPLAY}>{ROMAN[s - 1]}</span>
                            <span className="min-w-0">
                              <b className="block text-[17px] font-bold" style={F_DISPLAY}>
                                Semester {ROMAN[s - 1]}
                                <span className="ml-1.5 rounded-md bg-[#FFD54A] px-[7px] py-0.5 text-xs font-semibold text-[#0C1A33]" style={F_MONO}>₹{vvimpPriceForSemester(s)}</span>
                              </b>
                              <small className="text-[13px] text-[#56647D]">
                                {list.length ? `${list.length} subject guide${list.length > 1 ? 's' : ''}` : 'Coming soon'}
                              </small>
                              {list.length ? (
                                <span className="mt-1.5 block truncate text-[12.5px] text-[#56647D]">{list.map((p) => p.name).join(' · ')}</span>
                              ) : null}
                            </span>
                            {list.length ? <Arrow /> : <span />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {step === 3 && branchInfo && sem && (
              <section aria-labelledby="vv-h3">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="vv-h3" className="m-0 text-[clamp(24px,3.2vw,34px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>
                      Semester {ROMAN[sem - 1]} · {branchInfo.name}
                    </h2>
                    <p className="mt-1 text-[#56647D]">
                      {semItems.length} guide{semItems.length > 1 ? 's' : ''} · ₹{vvimpPriceForSemester(sem)} each · payment and download on Superprofile
                    </p>
                  </div>
                  <button type="button" onClick={() => go(branch)} className="inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-solid border-[#E2E7F0] bg-white px-3.5 text-sm font-semibold text-[#0C1A33] hover:border-[#C9D4EA] hover:bg-white hover:shadow-none">
                    <ArrowLeft className="h-4 w-4" /> Change semester
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-[repeat(auto-fill,minmax(258px,1fr))]">
                  {semItems.map((p) => <ProductCard key={p.code} p={p} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* What's inside */}
      <section id="vvimp-inside" className="scroll-mt-16 border-y border-[#E2E7F0] bg-white">
        <div className="mx-auto grid max-w-[1160px] gap-7 px-4 py-10 sm:px-6 md:grid-cols-[.8fr_1.2fr] md:gap-11 md:py-[52px]">
          <div>
            <h2 className="mb-2.5 mt-0 text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-0.03em] [text-wrap:balance]" style={F_DISPLAY}>What every guide gives you</h2>
            <p className="m-0 max-w-[40ch] text-[#56647D]">A short, exam-focused PDF built on the K-Scheme unit structure, made for revising on your phone.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-7 gap-y-5 sm:grid-cols-2">
            {[
              ['2·4·6', 'Unit-wise questions', 'Questions grouped by unit and by marks, the way the paper is set.'],
              ['VVIMP', 'Priority tags', 'Every question is marked VVIMP or IMP, so you start with what matters most.'],
              ['TOP 10', 'Last-minute list', 'The ten most repeated questions on one page for the night before.'],
              ['PDF', 'Instant download', 'Pay on the secure Superprofile checkout and get the PDF right away.'],
            ].map(([k, t, d]) => (
              <div key={t}>
                <b className="mb-1 flex items-center gap-2.5 text-[16.5px] font-bold" style={F_DISPLAY}>
                  <span className="rounded-md bg-[#EDF2FE] px-[7px] py-[3px] text-[11px] font-semibold text-[#0B2A86]" style={F_MONO}>{k}</span>
                  {t}
                </b>
                <p className="m-0 text-[14.5px] text-[#56647D]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6">
          <h2 className="mb-3.5 mt-0 text-[clamp(22px,2.8vw,28px)] font-extrabold tracking-[-0.03em]" style={F_DISPLAY}>Questions</h2>
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-b border-[#E2E7F0] py-3.5">
              <summary className="flex cursor-pointer list-none justify-between gap-3 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-lg leading-none text-[#1F4FE0]" style={F_MONO}>
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mb-0 mt-2 max-w-[65ch] text-[#56647D]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
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
  );
};

export default VvimpStore;

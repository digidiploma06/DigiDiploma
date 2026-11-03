import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, FileDown, ListChecks, Repeat2 } from 'lucide-react';
import {
  VVIMP_BRANCHES,
  VVIMP_PRODUCTS,
  VvimpBranchKey,
  VvimpProduct,
  productsForBranch,
  vvimpPriceForSemester,
} from '@/data/vvimpProducts';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const YEARS: { label: string; sems: number[] }[] = [
  { label: 'First Year', sems: [1, 2] },
  { label: 'Second Year', sems: [3, 4] },
  { label: 'Third Year', sems: [5, 6] },
];
const LOGO = '/icons/android-chrome-512x512.png';

const isBranchKey = (v: string | null): v is VvimpBranchKey =>
  !!v && VVIMP_BRANCHES.some((b) => b.key === v);

/** Step tracker shown in the hero: Branch -> Semester -> Subject */
const Stepper: React.FC<{
  current: 1 | 2 | 3;
  branchName?: string;
  sem?: number;
  onStep: (n: 1 | 2) => void;
}> = ({ current, branchName, sem, onStep }) => {
  const steps = [
    { n: 1 as const, label: 'Branch', value: branchName ?? 'Choose branch' },
    { n: 2 as const, label: 'Semester', value: sem ? `Semester ${ROMAN[sem - 1]}` : 'Choose semester' },
    { n: 3 as const, label: 'Subject', value: 'Buy your guide' },
  ];
  return (
    <nav aria-label="Progress" className="flex flex-wrap gap-2">
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
              'flex min-w-0 items-center gap-2.5 rounded-xl border px-2.5 py-2 pr-3.5 text-left text-sm transition-colors',
              on && 'border-white bg-white text-blue-900',
              done && 'cursor-pointer border-white/25 bg-white/10 text-white hover:bg-white/20',
              !on && !done && 'cursor-default border-white/15 bg-white/5 text-white/80',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span
              className={[
                'grid h-6 w-6 flex-none place-items-center rounded-md font-mono text-xs font-bold',
                on && 'bg-blue-600 text-white',
                done && 'bg-amber-400 text-amber-950',
                !on && !done && 'bg-white/15',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : s.n}
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="hidden text-[10.5px] uppercase tracking-wider opacity-70 sm:block">Step {s.n}</span>
              <span className="max-w-[22ch] truncate font-semibold">{s.value}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
};

const ProductCard: React.FC<{ p: VvimpProduct }> = ({ p }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-14px_rgba(16,60,170,0.28)] transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
    <a href={p.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="block aspect-video bg-blue-50">
      <img
        src={`/vvimp-covers/${p.code}.jpg`}
        alt=""
        loading="lazy"
        width={640}
        height={360}
        className="h-full w-full object-cover"
      />
    </a>
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] text-slate-500">
        <span
          className={[
            'rounded px-1.5 py-0.5 font-sans text-[10.5px] font-bold uppercase tracking-wide',
            p.common ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700',
          ].join(' ')}
        >
          {p.common ? 'Common' : `Sem ${ROMAN[p.semester - 1]}`}
        </span>
        <span>{p.code}</span>
        {p.pages ? <span>· {p.pages} pages</span> : null}
      </div>
      <h3 className="!text-slate-900 text-[15px] font-semibold leading-snug text-slate-900 sm:text-[17px]" style={{ textWrap: 'balance' }}>
        {p.name}
      </h3>
      <ul className="hidden space-y-0.5 text-[13px] text-slate-500 sm:block">
        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-600" />Unit-wise 2/4/6-mark questions</li>
        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-600" />VVIMP and IMP tagged</li>
      </ul>
      <div className="mt-auto flex flex-col items-stretch gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="leading-none">
          <div className="text-xl font-extrabold tabular-nums text-blue-950 sm:text-2xl">₹{p.price}</div>
          <div className="mt-1 text-[11.5px] text-slate-500">Instant PDF</div>
        </div>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buy ${p.name} VVIMP guide for ₹${p.price}`}
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_-8px_rgba(22,82,240,0.8)] transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Buy Now <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </article>
);

const VvimpStore: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const branchParam = params.get('branch');
  const branch = isBranchKey(branchParam) ? branchParam : null;
  const semRaw = Number(params.get('sem'));
  const branchItems = useMemo(() => (branch ? productsForBranch(branch) : []), [branch]);
  const sem = branch && semRaw >= 1 && semRaw <= 6 && branchItems.some((p) => p.semester === semRaw) ? semRaw : null;
  const branchInfo = VVIMP_BRANCHES.find((b) => b.key === branch);
  const step: 1 | 2 | 3 = !branch ? 1 : !sem ? 2 : 3;

  useEffect(() => {
    document.title = 'VVIMP Store | DigiDiploma';
  }, []);
  useEffect(() => {
    if (step > 1) document.getElementById('vvimp-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, branch, sem]);

  const go = (b: VvimpBranchKey | null, s?: number | null) => {
    const next = new URLSearchParams();
    if (b) next.set('branch', b);
    if (b && s) next.set('sem', String(s));
    setParams(next);
  };

  const semItems = sem
    ? branchItems.filter((p) => p.semester === sem).sort((a, b) => Number(a.common) - Number(b.common) || a.code.localeCompare(b.code))
    : [];

  return (
    <div className="min-h-screen bg-[#F4F7FD] text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={LOGO} alt="DigiDiploma logo" className="h-10 w-10 rounded-xl object-contain shadow" />
            <span className="text-xl font-bold text-blue-950 sm:text-2xl">DigiDiploma</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium sm:gap-5">
            <Link to="/" className="hidden text-slate-600 hover:text-blue-600 sm:inline">Home</Link>
            <Link to="/materials" className="hidden text-slate-600 hover:text-blue-600 sm:inline">Materials</Link>
            <Link to="/projects" className="hidden text-slate-600 hover:text-blue-600 sm:inline">Projects</Link>
            <span className="rounded-full bg-blue-600 px-3 py-1.5 font-semibold text-white">VVIMP Store</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 text-white">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[420px] w-[420px] rounded-full border-[56px] border-white/5" />
        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 py-7 sm:px-6 sm:py-9">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" className="h-12 w-12 rounded-xl ring-1 ring-white/25" />
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">
              MSBTE K-Scheme · {VVIMP_PRODUCTS.length} subjects
            </span>
          </div>
          <div>
            <h1 className="max-w-[22ch] !text-white text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl" style={{ textWrap: 'balance' }}>
              Get your <span className="rounded bg-amber-400 px-2 text-amber-950">VVIMP</span> exam guide in 3 steps
            </h1>
            <p className="mt-3 max-w-[58ch] text-white/85">
              Pick your branch, then your semester, then your subject. Pay on the secure Superprofile page and download the PDF instantly.
            </p>
          </div>
          <Stepper current={step} branchName={branchInfo?.name} sem={sem ?? undefined} onStep={(n) => (n === 1 ? go(null) : go(branch))} />
        </div>
      </section>

      {/* Stage */}
      <main id="vvimp-stage" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10" aria-live="polite">
        {step === 1 && (
          <>
            <div className="mb-5">
              <h2 className="!text-slate-900 text-2xl font-extrabold tracking-tight sm:text-3xl">Choose your branch</h2>
              <p className="mt-1 text-slate-500">Subjects common to every branch, like Maths and Communication Skills, appear inside each branch too.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {VVIMP_BRANCHES.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => go(b.key)}
                  className="group flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-[0_10px_30px_-14px_rgba(16,60,170,0.28)] transition hover:-translate-y-0.5 hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:p-5"
                >
                  <span className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 font-mono text-sm font-bold text-blue-700">{b.code}</span>
                  <span className="text-base font-semibold leading-snug sm:text-lg">{b.name}</span>
                  <span className="text-sm text-slate-500">{productsForBranch(b.key).length} subject guides</span>
                  <span className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-sm font-semibold text-blue-600">
                    Choose semester <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && branchInfo && (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="!text-slate-900 text-2xl font-extrabold tracking-tight sm:text-3xl">{branchInfo.name}: choose your semester</h2>
                <p className="mt-1 text-slate-500">{branchItems.length} guides for this branch across six semesters.</p>
              </div>
              <button type="button" onClick={() => go(null)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:border-blue-300 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4" /> Change branch
              </button>
            </div>
            <div className="grid gap-6">
              {YEARS.map((y) => (
                <div key={y.label}>
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{y.label}</p>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {y.sems.map((s) => {
                      const n = branchItems.filter((p) => p.semester === s).length;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={!n}
                          onClick={() => go(branch, s)}
                          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-[0_10px_30px_-14px_rgba(16,60,170,0.28)] transition hover:-translate-y-0.5 hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:p-5"
                        >
                          <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-blue-600 text-xl font-extrabold text-white sm:h-14 sm:w-14">{ROMAN[s - 1]}</span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="text-base font-semibold sm:text-lg">Semester {ROMAN[s - 1]}</span>
                            <span className="text-sm text-slate-500">{n ? `${n} subject guide${n > 1 ? 's' : ''}` : 'Coming soon'}</span>
                            <span className="w-fit rounded-md bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-amber-950">₹{vvimpPriceForSemester(s)} each</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 3 && branchInfo && sem && (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="!text-slate-900 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Semester {ROMAN[sem - 1]} · {branchInfo.name}
                </h2>
                <p className="mt-1 text-slate-500">
                  {semItems.length} subject guide{semItems.length > 1 ? 's' : ''} · ₹{vvimpPriceForSemester(sem)} each · tap Buy Now to pay on Superprofile
                </p>
              </div>
              <button type="button" onClick={() => go(branch)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:border-blue-300 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4" /> Change semester
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {semItems.map((p) => (
                <ProductCard key={p.code} p={p} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* What you get */}
      <section className="border-t border-slate-200 bg-white" aria-label="What you get">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: ListChecks, t: 'Unit-wise questions', d: '2, 4 and 6-mark questions sorted by unit' },
            { icon: Check, t: 'VVIMP / IMP tags', d: 'Know exactly what to study first' },
            { icon: Repeat2, t: 'Top 10 repeated', d: 'Most repeated questions for last-minute revision' },
            { icon: FileDown, t: 'Instant download', d: 'PDF delivered right after payment' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3 text-sm">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-blue-50 text-blue-700"><Icon className="h-4 w-4" /></span>
              <span><b className="block text-slate-900">{t}</b><span className="text-slate-500">{d}</span></span>
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-blue-950 text-sm text-white/75">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6">
          <span className="flex items-center gap-2"><img src={LOGO} alt="" className="h-6 w-6 rounded" /><b className="text-white">DigiDiploma</b> · digidiploma.in</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Secure checkout by Superprofile · Odd sem ₹64 · Even sem ₹99</span>
        </div>
      </footer>
    </div>
  );
};

export default VvimpStore;

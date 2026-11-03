import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  FileDown,
  ListChecks,
  Repeat2,
  Sparkles,
  Zap,
  Star,
  BookOpen,
  CheckCircle2,
  Search,
  Eye,
  GraduationCap,
  X,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
  { label: 'First Year (Foundation)', sems: [1, 2] },
  { label: 'Second Year (Core Engineering)', sems: [3, 4] },
  { label: 'Third Year (Advanced & Electives)', sems: [5, 6] },
];
const LOGO = '/icons/android-chrome-512x512.png';

const isBranchKey = (v: string | null): v is VvimpBranchKey =>
  !!v && VVIMP_BRANCHES.some((b) => b.key === v);

/** Step Indicator Tracker */
const Stepper: React.FC<{
  current: 1 | 2 | 3;
  branchName?: string;
  sem?: number;
  onStep: (n: 1 | 2) => void;
}> = ({ current, branchName, sem, onStep }) => {
  const steps = [
    { n: 1 as const, label: 'Branch', value: branchName ?? 'Choose Branch' },
    { n: 2 as const, label: 'Semester', value: sem ? `Semester ${ROMAN[sem - 1]}` : 'Choose Semester' },
    { n: 3 as const, label: 'Subject', value: 'Select VVIMP Guide' },
  ];

  return (
    <nav aria-label="Store steps" className="flex flex-wrap items-center gap-2 sm:gap-3">
      {steps.map((s, idx) => {
        const done = s.n < current;
        const on = s.n === current;
        return (
          <React.Fragment key={s.n}>
            <button
              type="button"
              disabled={!done}
              aria-current={on ? 'step' : undefined}
              onClick={() => done && s.n !== 3 && onStep(s.n as 1 | 2)}
              className={[
                'group flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs sm:text-sm font-medium transition-all duration-200',
                on
                  ? 'border-indigo-400 bg-white text-slate-900 shadow-lg shadow-black/10 ring-2 ring-indigo-400/30'
                  : done
                  ? 'cursor-pointer border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40'
                  : 'cursor-default border-white/10 bg-white/5 text-white/50',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className={[
                  'grid h-6 w-6 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold transition-transform group-hover:scale-105',
                  on
                    ? 'bg-indigo-600 text-white'
                    : done
                    ? 'bg-emerald-400 text-emerald-950 font-black'
                    : 'bg-white/15 text-white/70',
                ].join(' ')}
              >
                {done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.n}
              </span>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Step {s.n}</span>
                <span className="truncate max-w-[18ch] sm:max-w-[24ch] font-semibold">{s.value}</span>
              </div>
            </button>
            {idx < steps.length - 1 && (
              <span className="hidden sm:inline-block text-white/30 text-xs font-bold">→</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

/** Redesigned VVIMP Product Card with Preview Modal Support */
const ProductCard: React.FC<{
  p: VvimpProduct;
  onPreview: (product: VvimpProduct) => void;
}> = ({ p, onPreview }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const originalPrice = Math.round(p.price * 1.65);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10">
      
      {/* 85%+ Repeat Badge */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm border border-white/10">
          <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
          85%+ REPEATS
        </span>
      </div>

      {/* Cover Image Banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {imageLoaded ? (
          <img
            src={`/vvimp-covers/${p.code}.jpg`}
            alt={p.name}
            loading="lazy"
            width={640}
            height={360}
            onError={() => setImageLoaded(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center bg-indigo-50/50">
            <BookOpen className="h-8 w-8 text-indigo-400 mb-1" />
            <span className="text-xs font-bold text-slate-700">{p.name}</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">Code: {p.code}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={[
                'rounded-md px-2 py-0.5 font-sans text-[10.5px] font-bold uppercase tracking-wider border',
                p.common
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200',
              ].join(' ')}
            >
              {p.common ? 'Common All' : `Sem ${ROMAN[p.semester - 1]}`}
            </span>
            <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {p.code}
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
          {p.name}
        </h3>

        {/* Features Checklist */}
        <div className="my-auto py-2.5 space-y-1.5 border-t border-slate-100 text-[12px] text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Unit-wise 2M, 4M & 6M segregated</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Model answers formatted to MSBTE scheme</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Past 5-year repeated exam questions</span>
          </div>
        </div>

        {/* Micro Specs */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 pb-3">
          <span>⚡ Instant PDF Download</span>
          {p.pages ? <span>📄 {p.pages} Pages</span> : <span>📄 MSBTE K-Scheme</span>}
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                ₹{p.price}
              </span>
              <span className="text-xs text-slate-400 line-through">₹{originalPrice}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Save {Math.round(((originalPrice - p.price) / originalPrice) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPreview(p)}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors"
              title="Preview sample pages"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy ${p.name} VVIMP guide for ₹${p.price}`}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
            >
              <span>Get Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>
    </article>
  );
};

const VvimpStore: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [previewProduct, setPreviewProduct] = useState<VvimpProduct | null>(null);

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
    if (step > 1) {
      document.getElementById('vvimp-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step, branch, sem]);

  const go = (b: VvimpBranchKey | null, s?: number | null) => {
    const next = new URLSearchParams();
    if (b) next.set('branch', b);
    if (b && s) next.set('sem', String(s));
    setParams(next);
  };

  // Filtered Subject Items for Step 3
  const semItems = useMemo(() => {
    if (!sem) return [];
    let items = branchItems
      .filter((p) => p.semester === sem)
      .sort((a, b) => Number(a.common) - Number(b.common) || a.code.localeCompare(b.code));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      );
    }
    return items;
  }, [branchItems, sem, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={LOGO} alt="DigiDiploma logo" className="h-10 w-10 rounded-xl object-contain shadow-sm transition-transform group-hover:scale-105" />
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-2xl">
                DigiDiploma
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">VVIMP Store</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5 sm:gap-4 text-sm font-semibold">
            <Link to="/" className="hidden text-slate-600 hover:text-indigo-600 sm:inline px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Home
            </Link>
            <Link to="/materials" className="hidden text-slate-600 hover:text-indigo-600 sm:inline px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Materials
            </Link>
            <Link to="/projects" className="hidden text-slate-600 hover:text-indigo-600 sm:inline px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Projects
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200">
              <Zap className="h-3.5 w-3.5 fill-indigo-600" />
              Store Active
            </span>
          </nav>
        </div>
      </header>

      {/* Hero Section with Stepper */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-white/15 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Latest MSBTE K-Scheme 2024–25 Curriculum
              </span>
              <span className="hidden sm:inline-flex text-xs font-medium text-slate-400">
                • {VVIMP_PRODUCTS.length}+ Verified Subjects
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
                Get Your{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                  VVIMP Exam Guide
                </span>{' '}
                in 3 Steps
              </h1>
              <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Unit-wise repeated questions with step-by-step MSBTE model answers. Instant PDF download on payment completion.
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="pt-2">
              <Stepper
                current={step}
                branchName={branchInfo?.name}
                sem={sem ?? undefined}
                onStep={(n) => (n === 1 ? go(null) : go(branch))}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Main Multi-Step Interactive Area */}
      <main id="vvimp-stage" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12" aria-live="polite">
        
        {/* STEP 1: CHOOSE BRANCH */}
        {step === 1 && (
          <section aria-labelledby="step1-heading" className="animate-in fade-in duration-300">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 1 of 3</span>
              <h2 id="step1-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Select Your Engineering Branch
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Common first-year subjects (Applied Mathematics, Basic Science) are available inside every branch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VVIMP_BRANCHES.map((b) => {
                const count = productsForBranch(b.key).length;
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => go(b.key)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 font-mono text-sm font-extrabold text-indigo-700 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {b.code}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {count} {count === 1 ? 'Guide' : 'Guides'}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {b.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        All semester K-Scheme unit-wise question banks.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                      <span>Choose Semester</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2: CHOOSE SEMESTER */}
        {step === 2 && branchInfo && (
          <section aria-labelledby="step2-heading" className="animate-in fade-in duration-300">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 2 of 3</span>
                <h2 id="step2-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  {branchInfo.name}: Select Your Semester
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {branchItems.length} curated question banks available for this branch.
                </p>
              </div>

              <button
                type="button"
                onClick={() => go(null)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Change Branch
              </button>
            </div>

            <div className="space-y-8">
              {YEARS.map((y) => (
                <div key={y.label}>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{y.label}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {y.sems.map((s) => {
                      const count = branchItems.filter((p) => p.semester === s).length;
                      const price = vvimpPriceForSemester(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={!count}
                          onClick={() => go(branch, s)}
                          className="group flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                        >
                          <div className="flex items-center gap-4">
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-lg font-black text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                              {ROMAN[s - 1]}
                            </span>
                            <div>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                Semester {ROMAN[s - 1]}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {count ? `${count} Subject Guide${count > 1 ? 's' : ''}` : 'Syllabus in preparation'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {count ? (
                              <>
                                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
                                  ₹{price} each
                                </span>
                                <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-0.5">
                                  Select <ArrowRight className="h-3 w-3" />
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-medium text-slate-400">Coming Soon</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: CHOOSE SUBJECT GUIDES */}
        {step === 3 && branchInfo && sem && (
          <section aria-labelledby="step3-heading" className="animate-in fade-in duration-300">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 3 of 3</span>
                <h2 id="step3-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Semester {ROMAN[sem - 1]} · {branchInfo.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {semItems.length} verified subject question bank{semItems.length > 1 ? 's' : ''} available.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Instant Search Bar */}
                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search subject or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => go(branch)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" /> Change Semester
                </button>
              </div>
            </div>

            {semItems.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800">No subjects matching "{searchQuery}"</h3>
                <p className="text-xs text-slate-500 mt-1">Try clearing your search query or pick a different semester.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {semItems.map((p) => (
                  <ProductCard
                    key={p.code}
                    p={p}
                    onPreview={(product) => setPreviewProduct(product)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* SAMPLE PREVIEW MODAL */}
      <Dialog open={!!previewProduct} onOpenChange={(open) => !open && setPreviewProduct(null)}>
        {previewProduct && (
          <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
            <DialogHeader className="p-0">
              <DialogTitle className="sr-only">Preview {previewProduct.name}</DialogTitle>
              <DialogDescription className="sr-only">Free sample preview for {previewProduct.name}</DialogDescription>
            </DialogHeader>

            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 text-xs font-bold">
                  Code: {previewProduct.code}
                </span>
                <span className="text-xs text-slate-400">Sample Preview</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {previewProduct.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                MSBTE K-Scheme Verified Solution Sample
              </p>
            </div>

            {/* Simulated Watermarked Sample Pages */}
            <div className="p-6 bg-slate-50 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="absolute right-2 top-2 select-none opacity-10 text-4xl font-black text-slate-900 rotate-12">
                  SAMPLE
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Unit 1: High Frequency 2-Mark Question
                </span>
                <p className="text-xs font-bold text-slate-800">
                  Q. State the primary classification of standard engineering materials with suitable examples.
                </p>
                <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-700">Model Answer (MSBTE Pattern):</p>
                  <p className="mt-1">1. Metals & Alloys (e.g., Cast Iron, Mild Steel) [1 Mark]</p>
                  <p>2. Non-Metals / Polymers (e.g., Teflon, Bakelite, Ceramics) [1 Mark]</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="absolute right-2 top-2 select-none opacity-10 text-4xl font-black text-slate-900 rotate-12">
                  SAMPLE
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Unit 2: 4-Mark Analytical Question
                </span>
                <p className="text-xs font-bold text-slate-800">
                  Q. Explain the working principle with a labeled block diagram. (Winter 2023 Repeated)
                </p>
                <div className="mt-2 text-[11px] text-slate-500 italic">
                  [ Full step-by-step schematics and point-wise breakdown available in full PDF ]
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-xl font-black text-slate-900">₹{previewProduct.price}</div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase">Instant PDF Delivery</div>
              </div>
              <a
                href={previewProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>Unlock Full PDF</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Feature Guarantee Bar */}
      <section className="border-t border-slate-200/80 bg-white py-8" aria-label="VVIMP Features">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            {
              icon: ListChecks,
              title: 'Unit-Wise Questions',
              desc: '2, 4, and 6-mark questions categorized with exact mark allocations.',
            },
            {
              icon: Zap,
              title: 'VVIMP Tagged Focus',
              desc: 'Highlighted high-frequency questions so you know what to memorize first.',
            },
            {
              icon: Repeat2,
              title: 'Exam Repeats (85%+)',
              desc: 'Compiled from the past 5 examination sessions of MSBTE papers.',
            },
            {
              icon: FileDown,
              title: 'Instant PDF Access',
              desc: 'Download directly to your device via WhatsApp and email confirmation.',
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3.5 p-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-xs text-slate-400 py-6 border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="DigiDiploma logo" className="h-6 w-6 rounded-md object-contain" />
            <span className="font-bold text-white text-sm">DigiDiploma</span>
            <span>• Maharashtra's #1 Polytechnic Companion</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted checkout via Superprofile • 100% MSBTE K-Scheme Guaranteed</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VvimpStore;

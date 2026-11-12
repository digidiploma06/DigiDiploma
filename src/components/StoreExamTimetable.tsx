import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Moon, Search, Sun } from 'lucide-react';
import { VvimpBranchKey } from '@/data/vvimpProducts';
import { EXAM_BRANCH_KEYS } from '@/data/examTimetableW26';
import { ROWS, Row, branchCode, branchName, daysBetween, endOf, fmtDate, FIRST, LAST, istDay, slot, startOf } from '@/lib/examTimetable';

/* Winter 2026 exam timetable band shown at the top of /vvimp-store.
   Navy brand band + white results card, same type system as the store. */
const F_DISPLAY: React.CSSProperties = { fontFamily: '"Schibsted Grotesk","Segoe UI",system-ui,sans-serif' };
const F_MONO: React.CSSProperties = { fontFamily: '"JetBrains Mono",ui-monospace,Consolas,monospace' };
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const HELP_WA = '8432971897';
const LIMIT = 6;

const selectCls =
  'h-11 rounded-[11px] border border-white/15 bg-white/[.08] px-3 text-[14.5px] font-semibold text-white focus:border-[#2DE2EE] focus:outline-none [&>option]:text-[#0C1A33]';

const StoreExamTimetable: React.FC = () => {
  const [q, setQ] = useState('');
  const [br, setBr] = useState<VvimpBranchKey | ''>('');
  const [sem, setSem] = useState<number | ''>('');
  const [all, setAll] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => setAll(false), [q, br, sem]);

  const today = istDay(now);
  const term = q.trim().toLowerCase();
  const filtered = !!(term || br || sem);
  const upcoming = ROWS.filter((r) => endOf(r) > now);
  const nextDay = upcoming[0]?.date;

  const list: Row[] = useMemo(() => {
    if (!filtered) return nextDay ? ROWS.filter((r) => r.date === nextDay && endOf(r) > now) : [];
    return ROWS.filter(
      (r) =>
        (!br || r.branches.includes(br)) &&
        (!sem || r.sem === sem) &&
        (!term || r.name.toLowerCase().includes(term) || r.code.includes(term)),
    );
  }, [filtered, nextDay, now, br, sem, term]);

  const semsForBranch = useMemo(() => {
    const s = new Set<number>(ROWS.filter((r) => !br || r.branches.includes(br)).map((r) => r.sem));
    return [1, 2, 3, 4, 5, 6].filter((n) => s.has(n));
  }, [br]);

  const fullLink = br && sem ? `/exam-timetable?branch=${br}&sem=${sem}` : br ? `/exam-timetable?branch=${br}` : '/exam-timetable?view=subject';
  const shown = all ? list : list.slice(0, LIMIT);
  const first = upcoming[0];
  const daysToFirst = first ? daysBetween(today, first.date) : 0;

  return (
    <section className="relative overflow-hidden bg-[#091629] text-white" aria-labelledby="ex-h">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_100%_0%,#163A7A_0%,rgba(22,58,122,0)_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(180deg,#000,transparent_70%)]"
        style={{ backgroundImage: 'linear-gradient(rgba(45,226,238,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(45,226,238,.07) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="relative mx-auto max-w-[1160px] px-4 py-9 sm:px-6 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#2DE2EE] px-3 py-1 text-xs font-semibold text-[#091629]" style={F_MONO}>
              <CalendarDays className="h-3.5 w-3.5" /> Winter 2026 exams · {fmtDate(FIRST, { day: 'numeric', month: 'short' })} – {fmtDate(LAST, { day: 'numeric', month: 'short' })}
            </span>
            <h2 id="ex-h" className="mb-0 mt-3.5 text-white max-w-[22ch] text-[clamp(26px,3.8vw,40px)] font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]" style={F_DISPLAY}>
              Find your paper date, and its <span className="text-[#FFD54A]">VVIMP guide</span>
            </h2>
          </div>
          {first ? (
            <div className="rounded-2xl border border-white/15 bg-white/[.06] px-4 py-3 text-right">
              <span className="block text-[11px] uppercase tracking-[.08em] text-white/60" style={F_MONO}>First paper in</span>
              <b className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-white" style={F_DISPLAY}>
                {daysToFirst <= 0 ? 'Today' : `${daysToFirst} day${daysToFirst > 1 ? 's' : ''}`}
              </b>
            </div>
          ) : null}
        </div>

        {/* Controls */}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search subject or code, e.g. 315319"
              aria-label="Search exam subject"
              autoComplete="off"
              className="h-11 w-full rounded-[11px] border border-white/15 bg-white/[.08] pl-[38px] pr-3.5 text-[14.5px] text-white placeholder:text-white/50 focus:border-[#2DE2EE] focus:outline-none"
            />
          </label>
          <select
            value={br}
            onChange={(e) => {
              setBr(e.target.value as VvimpBranchKey | '');
              setSem('');
            }}
            aria-label="Branch"
            className={selectCls}
          >
            <option value="">All branches</option>
            {EXAM_BRANCH_KEYS.map((k) => (
              <option key={k} value={k}>
                {branchName(k)} ({branchCode(k)})
              </option>
            ))}
          </select>
          <select value={sem} onChange={(e) => setSem(e.target.value ? Number(e.target.value) : '')} aria-label="Semester" className={selectCls}>
            <option value="">All semesters</option>
            {semsForBranch.map((s) => (
              <option key={s} value={s}>
                Semester {ROMAN[s - 1]}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-white text-[#0C1A33] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E7F0] px-[18px] py-3 text-[13px] text-[#56647D]">
            <span>
              {filtered ? (
                <>
                  <b className="text-[#0C1A33]">{list.length}</b> paper{list.length === 1 ? '' : 's'}
                  {br ? ` · ${branchName(br)}` : ''}
                  {sem ? ` · Sem ${ROMAN[sem - 1]}` : ''}
                </>
              ) : nextDay ? (
                <>
                  Next exam day · <b className="text-[#0C1A33]">{fmtDate(nextDay, { weekday: 'long', day: 'numeric', month: 'short' })}</b>
                </>
              ) : (
                'All Winter 2026 papers are done'
              )}
            </span>
            <span className="text-[11px] uppercase tracking-[.06em]" style={F_MONO}>K-Scheme theory</span>
          </div>

          {shown.length ? (
            shown.map((r) => {
              const done = endOf(r) <= now;
              const d = daysBetween(today, r.date);
              const when = done ? 'Done' : startOf(r) <= now ? 'Now' : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`;
              const tone = done ? 'bg-[#E3F4EC] text-[#0F8A5F]' : d <= 1 ? 'bg-[#FFD54A] text-[#0C1A33]' : d <= 4 ? 'bg-[#FFF3D1] text-[#7A5A00]' : 'bg-[#F5F7FB] text-[#56647D]';
              const brs = (br ? [br] : r.branches).map((b) => `${branchCode(b)}-${ROMAN[r.sem - 1]}`).join(', ');
              return (
                <div key={r.code} className={`grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2.5 border-b border-[#E2E7F0] px-[18px] py-3.5 last:border-b-0 sm:grid-cols-[auto_1fr_auto] ${done ? 'opacity-60' : ''}`}>
                  <div className="w-[54px] overflow-hidden rounded-[10px] border border-[#E2E7F0] text-center">
                    <span className="block bg-[#091629] py-0.5 text-[10px] font-semibold uppercase tracking-[.08em] text-[#2DE2EE]" style={F_MONO}>
                      {fmtDate(r.date, { month: 'short' })}
                    </span>
                    <b className="block pt-0.5 text-[21px] font-extrabold leading-none tracking-[-0.03em]" style={F_DISPLAY}>{fmtDate(r.date, { day: 'numeric' })}</b>
                    <span className="block pb-1 text-[10.5px] text-[#56647D]">{fmtDate(r.date, { weekday: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <b className="block text-[16px] font-bold leading-[1.25] tracking-[-0.01em]" style={F_DISPLAY}>{r.name}</b>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#56647D]">
                      <span style={F_MONO}>{r.code}</span>
                      <span>{brs}</span>
                      <span className="inline-flex items-center gap-1">
                        {r.session === 'M' ? <Sun className="h-3.5 w-3.5 text-[#B07A00]" /> : <Moon className="h-3.5 w-3.5 text-[#1F4FE0]" />}
                        {slot(r)}
                      </span>
                      <span className={`rounded px-1.5 py-px text-[11px] font-semibold ${tone}`} style={F_MONO}>{when}</span>
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Get the VVIMP guide for ${r.name}, ₹${r.price}`}
                        className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-[#1F4FE0] px-3.5 text-[14px] font-bold text-white hover:bg-[#0B2A86]"
                      >
                        Get VVIMP · ₹{r.price}
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/91${HELP_WA}?text=${encodeURIComponent(`Hi, I need the VVIMP guide for ${r.name} (${r.code}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center whitespace-nowrap rounded-[10px] border border-solid border-[#E2E7F0] bg-white px-3.5 text-[14px] font-bold text-[#0C1A33]"
                      >
                        Ask on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="m-0 px-[18px] py-6 text-center text-[#56647D]">No paper matches that in the Winter 2026 timetable. Try a shorter word.</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E7F0] bg-[#F5F7FB] px-[18px] py-3">
            {list.length > LIMIT ? (
              <button
                type="button"
                onClick={() => setAll((v) => !v)}
                className="inline-flex h-9 items-center rounded-[10px] border border-solid border-[#E2E7F0] bg-white px-3.5 text-[13.5px] font-semibold text-[#0C1A33] hover:border-[#C9D4EA] hover:bg-white"
              >
                {all ? 'Show fewer' : `Show all ${list.length} papers`}
              </button>
            ) : (
              <span className="text-[12.5px] text-[#56647D]">Confirm dates with your hall ticket.</span>
            )}
            <Link to={fullLink} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#1F4FE0] hover:text-[#0B2A86]">
              Full timetable · countdown, WhatsApp share, PDF <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreExamTimetable;

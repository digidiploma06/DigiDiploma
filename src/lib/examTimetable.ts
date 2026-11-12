// Shared Winter 2026 exam timetable helpers (used by /exam-timetable and the VVIMP store).
import { VVIMP_BRANCHES, VVIMP_PRODUCTS, VvimpBranchKey } from '@/data/vvimpProducts';
import { EXAM_BRANCH_KEYS, EXAM_PAPERS, EXAM_PENDING_GUIDES, ExamPaper } from '@/data/examTimetableW26';

export type Row = ExamPaper & { name: string; sem: number; price: number; url: string | null };
export const PRODUCT = new Map(VVIMP_PRODUCTS.map((p) => [p.code, p]));
export const ROWS: Row[] = EXAM_PAPERS.map((e) => {
  const p = PRODUCT.get(e.code)!;
  return { ...e, name: p.name, sem: p.semester, price: p.price, url: EXAM_PENDING_GUIDES.has(e.code) ? null : p.url };
}).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

export const at = (date: string, hm: string) => new Date(`${date}T${hm}:00+05:30`).getTime();
export const startOf = (r: Row) => at(r.date, r.start);
export const endOf = (r: Row) => at(r.date, r.end);
export const dateObj = (d: string) => new Date(`${d}T12:00:00+05:30`);
export const fmtDate = (d: string, o: Intl.DateTimeFormatOptions) => dateObj(d).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', ...o });
export const fmtHM = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};
export const slot = (r: Row) => `${fmtHM(r.start)} – ${fmtHM(r.end)}`;
export const istDay = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
export const daysBetween = (from: string, to: string) => Math.round((dateObj(to).getTime() - dateObj(from).getTime()) / 864e5);

export const branchName = (k: VvimpBranchKey) => VVIMP_BRANCHES.find((b) => b.key === k)?.name ?? k.toUpperCase();
export const branchCode = (k: VvimpBranchKey) => VVIMP_BRANCHES.find((b) => b.key === k)?.code ?? k.toUpperCase();
export const isExamBranch = (v: string | null): v is VvimpBranchKey => !!v && (EXAM_BRANCH_KEYS as string[]).includes(v);

export const FIRST = ROWS[0].date;
export const LAST = ROWS[ROWS.length - 1].date;
export const EXAM_DAYS = new Set(ROWS.map((r) => r.date)).size;


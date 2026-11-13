import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  CalendarDays,
  Car,
  CheckCircle2,
  Code,
  Cpu,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  NotebookPen,
  Phone,
  Presentation,
  Radio,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { ALL_BRANCHES } from "@/constants/branches";
import { VVIMP_PRODUCTS } from "@/data/vvimpProducts";
import SiteNav, { WHATSAPP_COMMUNITY_URL } from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Counter, Reveal, ScrollProgress } from "@/components/site/motion";

const TELEGRAM_URL = "https://t.me/digidiploma";

// Config for each branch card (icon, description, subjects, color) — must match ALL_BRANCHES order/names
const BRANCH_CARD_CONFIG: Record<string, { icon: React.ReactNode; description: string; subjects: string[]; color: string }> = {
  "Computer Engineering": {
    icon: <Code className="w-8 h-8" />,
    description: "Programming, software development, and computer systems with modern technologies.",
    subjects: ["Programming", "Database", "Web Development", "Networking"],
    color: "blue"
  },
  "Information Technology": {
    icon: <Smartphone className="w-8 h-8" />,
    description: "IT infrastructure, software applications, and digital transformation solutions.",
    subjects: ["IT Fundamentals", "Software Engineering", "Cloud Computing", "Cybersecurity"],
    color: "green"
  },
  "Electronics & Telecommunication": {
    icon: <Radio className="w-8 h-8" />,
    description: "Electronics and telecommunications with modern communication systems.",
    subjects: ["Electronics", "Communication", "Signal Processing", "Telecom"],
    color: "purple"
  },
  "Mechanical Engineering": {
    icon: <Cpu className="w-8 h-8" />,
    description: "Machine design, manufacturing processes, and mechanical systems engineering.",
    subjects: ["Machine Design", "Thermodynamics", "Manufacturing", "CAD/CAM"],
    color: "orange"
  },
  "Electrical Engineering": {
    icon: <Brain className="w-8 h-8" />,
    description: "Electrical systems, power generation, and electronic circuit design.",
    subjects: ["Circuit Theory", "Power Systems", "Electronics", "Control Systems"],
    color: "yellow"
  },
  "Civil Engineering": {
    icon: <Target className="w-8 h-8" />,
    description: "Infrastructure development, construction management, and structural design.",
    subjects: ["Structural Analysis", "Construction", "Surveying", "Transportation"],
    color: "brown"
  },
  "Automobile Engineering": {
    icon: <Car className="w-8 h-8" />,
    description: "Vehicle design, automotive systems, and transportation engineering.",
    subjects: ["Vehicle Dynamics", "Engine Systems", "Automotive Electronics", "EV/Hybrid"],
    color: "orange"
  },
  "Instrumentation Engineering": {
    icon: <Shield className="w-8 h-8" />,
    description: "Measurement systems, process control, and industrial instrumentation.",
    subjects: ["Sensors", "Process Control", "Automation", "Industrial IoT"],
    color: "purple"
  },
  "Artificial Intelligence & Machine Learning (AIML)": {
    icon: <Brain className="w-8 h-8" />,
    description: "Data science, neural networks, and AI-driven automation projects.",
    subjects: ["AI Fundamentals", "Machine Learning", "Deep Learning", "MLOps"],
    color: "blue"
  },
  "Mechatronics Engineering": {
    icon: <Cpu className="w-8 h-8" />,
    description: "Robotics, intelligent systems, and modern mechatronic integration.",
    subjects: ["Robotics", "Embedded Systems", "Sensors & Actuators", "Smart Manufacturing"],
    color: "orange"
  }
};



const STATS = [
  { icon: <Users className="h-7 w-7" />, value: 1250, label: "Active Students" },
  { icon: <GraduationCap className="h-7 w-7" />, value: 45, label: "Faculty Members" },
  { icon: <BookOpen className="h-7 w-7" />, value: 120, label: "Courses Available" },
  { icon: <FileText className="h-7 w-7" />, value: 850, label: "Study Materials" },
];

const STEPS = [
  {
    icon: <Search className="h-7 w-7" />,
    title: "Find Your Subject",
    text: "Pick your branch and semester. Every subject follows the MSBTE K-Scheme.",
  },
  {
    icon: <Download className="h-7 w-7" />,
    title: "Download",
    text: "Save notes, PPTs and projects to your phone and study offline.",
  },
  {
    icon: <Rocket className="h-7 w-7" />,
    title: "Join & Excel",
    text: "Join the community for exam updates and important questions.",
  },
];

const SERVICES = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "MSBTE Materials",
    text: "PDFs, PPTs, videos and handwritten notes organized by branch, semester and subject.",
    cta: "Explore Materials",
    to: "/materials",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "VVIMP Guides",
    text: "Unit-wise exam priority guides for MSBTE K-Scheme papers.",
    cta: "Open VVIMP Store",
    to: "/vvimp-store",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Free Projects",
    text: "Browse and share academic projects and build your portfolio.",
    cta: "Browse Projects",
    to: "/projects",
  },
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: "Exam Timetable",
    text: "Find your paper date and the matching guide for every paper.",
    cta: "View Timetable",
    to: "/exam-timetable",
  },
];

const COMMUNITY_POINTS = [
  { icon: <MessageCircle className="h-5 w-5" />, title: "Chat with peers", text: "Discuss subjects and projects with fellow students." },
  { icon: <Zap className="h-5 w-5" />, title: "Fast access to materials", text: "New notes and important questions shared as they arrive." },
  { icon: <Bell className="h-5 w-5" />, title: "Quick exam updates", text: "Timetable and exam announcements in one place." },
];

const RESOURCE_TYPES = [
  { icon: <FileText className="h-6 w-6" />, title: "Notes & PDFs", text: "Subject-wise study notes", to: "/materials" },
  { icon: <Presentation className="h-6 w-6" />, title: "PPTs", text: "Unit presentations", to: "/materials" },
  { icon: <NotebookPen className="h-6 w-6" />, title: "Handwritten Notes", text: "Easy-to-revise notes", to: "/materials" },
  { icon: <Star className="h-6 w-6" />, title: "VVIMP Questions", text: "Exam priority guides", to: "/vvimp-store" },
  { icon: <Code className="h-6 w-6" />, title: "Projects", text: "Microprojects and more", to: "/projects" },
  { icon: <CalendarDays className="h-6 w-6" />, title: "Exam Timetable", text: "Paper dates and timings", to: "/exam-timetable" },
  { icon: <Briefcase className="h-6 w-6" />, title: "Internship", text: "Apply and track", to: "/internship" },
  { icon: <LayoutDashboard className="h-6 w-6" />, title: "Student Dashboard", text: "Your learning in one place", to: "/open-dashboard" },
];

const FEATURES = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Comprehensive Study Materials",
    text: "Access PDFs, PPTs, videos, and handwritten notes organized by branch, semester, and subject with advanced search capabilities.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "10 Engineering Branches",
    text: "Complete coverage across Computer, IT, Mechanical, Electrical, Civil, ENTC, Automobile, Instrumentation, AIML, and Mechatronics engineering branches.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "6 Semester Structure",
    text: "Organized semester-wise content with MSBTE K-Scheme subjects, quizzes, and progress tracking.",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Project Management",
    text: "Showcase your projects, collaborate with peers, and build your portfolio with our integrated project system.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Secure & Reliable",
    text: "Enterprise-grade security with role-based access control, ensuring your data is always protected.",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "24/7 Access",
    text: "Access your learning materials anytime, anywhere with our responsive web platform and mobile optimization.",
  },
];

const TESTIMONIALS = [
  {
    name: "Karan Jadhav",
    role: "Vidya Prathisha Indapur",
    text: "DigiDiploma has completely transformed how I study. The organized materials and project showcase features are incredible!",
  },
  {
    name: "Tanishka Pokharkar",
    role: "Government Polytechnic, Awasari (khurd)",
    text: "The branch-specific content and semester organization make it so easy to find exactly what I need for my studies.",
  },
  {
    name: "Aditya Hule",
    role: "Government Polytechnic, Awasari (khurd)",
    text: "I love how I can access study materials 24/7 and collaborate on projects with my classmates. Highly recommended!",
  },
];

const FAQS = [
  {
    q: "What is DigiDiploma and who is it for?",
    a: "DigiDiploma is a comprehensive digital learning platform designed specifically for diploma and engineering students. It provides free study materials, project resources, course management, and a collaborative community. Whether you're studying Computer Engineering, Mechanical, Civil, or any other branch, DigiDiploma has resources tailored to your needs.",
  },
  {
    q: "Are the study materials really free?",
    a: "Yes! All study materials including PDFs, PPTs, videos, and handwritten notes are completely free. We believe in making quality education accessible to everyone. You can browse materials by branch, semester, and subject without any cost.",
  },
  {
    q: "Which engineering branches are supported?",
    a: "We support all major engineering branches including Computer Engineering, Information Technology, Mechanical, Electrical, Civil, ENTC, Automobile, Instrumentation, AIML, and Mechatronics Engineering. Each branch has dedicated resources organized by semester and subject.",
  },
  {
    q: "How do I create an account?",
    a: "Creating an account is simple and free! Click on the \"Login\" button, then select \"Create Account\". Fill in your details including your name, email, enrollment number, college, branch, and semester. Once registered, you'll have full access to all features and materials.",
  },
  {
    q: "Can I download materials for offline use?",
    a: "Yes, you can download PDFs, PPTs, and other study materials directly to your device for offline access. This allows you to study anytime, anywhere, even without an internet connection. Simply click the download button on any material you want to save.",
  },
  {
    q: "Is there a community or forum for students?",
    a: "Absolutely! We have an active WhatsApp community where students can connect, share resources, discuss projects, and help each other. You can join our community through the \"Join Community\" button on the homepage. It's a great place to network and collaborate with fellow students.",
  },
  {
    q: "Is my personal information secure?",
    a: "Your privacy and security are our top priorities. We use industry-standard encryption to protect your data, and we never share your personal information with third parties. Your account is password-protected, and you have full control over your profile information.",
  },
  {
    q: "Can I access DigiDiploma on mobile devices?",
    a: "Yes! DigiDiploma is fully responsive and works seamlessly on smartphones, tablets, and desktops. You can access all features, browse materials, and manage your courses from any device. The mobile-friendly interface ensures a great experience on the go.",
  },
];

// Guides for the current (odd-semester) exam season, shown on the home page
const FEATURED_GUIDES = VVIMP_PRODUCTS.filter((p) => p.semester % 2 === 1).slice(0, 3);

interface PublicNotice {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(true);
  const [libraryTab, setLibraryTab] = useState<"branch" | "type">("branch");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices/public");
        const data = await res.json();
        setNotices(Array.isArray(data) ? data : []);
      } catch {
        setNotices([]);
      }
    };
    fetchNotices();
  }, []);

  const latestNotice = notices[0];

  return (
    <div className="dd">
      <ScrollProgress />
      <SiteNav />

      {/* Latest notice strip (only when a notice is published) */}
      {latestNotice?.title ? (
        <div className="border-b border-[var(--dd-line)] bg-[var(--dd-blue-soft)]">
          <div className="dd-container flex items-center justify-center gap-2 py-2.5 text-center text-sm text-[var(--dd-blue-dark)]">
            <Bell className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold">{latestNotice.title}</span>
            {latestNotice.message ? <span className="hidden truncate sm:inline">· {latestNotice.message}</span> : null}
          </div>
        </div>
      ) : null}

      {/* ================= HERO ================= */}
      <section className="dd-hero pb-16 pt-14 sm:pt-20 md:pb-24">
        {/* Decorative floating chips (large screens) */}
        <div className="dd-container relative hidden xl:block" aria-hidden>
          <div className="dd-chip" style={{ left: 0, top: 40, ["--r" as string]: "-6deg" }}>
            <span style={{ background: "#dbeafe", color: "#2563eb" }}><FileText className="h-4 w-4" /></span>
            Notes &amp; PDFs
          </div>
          <div className="dd-chip" style={{ left: 40, top: 250, animationDelay: "1.2s", ["--r" as string]: "4deg" }}>
            <span style={{ background: "#fef3c7", color: "#d97706" }}><Star className="h-4 w-4" /></span>
            VVIMP Guides
          </div>
          <div className="dd-chip" style={{ right: 0, top: 60, animationDelay: "0.6s", ["--r" as string]: "5deg" }}>
            <span style={{ background: "#ede9fe", color: "#7c3aed" }}><Code className="h-4 w-4" /></span>
            Free Projects
          </div>
          <div className="dd-chip" style={{ right: 50, top: 260, animationDelay: "1.8s", ["--r" as string]: "-4deg" }}>
            <span style={{ background: "#dcfce7", color: "#16a34a" }}><CalendarDays className="h-4 w-4" /></span>
            Exam Timetable
          </div>
        </div>
        <div className="dd-container text-center">
          <Reveal>
            <span className="dd-eyebrow">MSBTE K-Scheme · Diploma &amp; Engineering</span>
            <h1 className="dd-h1 mx-auto mt-6 max-w-4xl">
              Study Smarter,{" "}
              <span className="dd-underline">
                <span className="dd-accent-grad">Score Better!</span>
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden>
                  <path d="M4 14 C 60 2, 120 20, 180 9 S 270 6, 296 12" />
                </svg>
              </span>
            </h1>
            <p className="dd-lead mx-auto mt-6 max-w-2xl">
              All your Diploma &amp; Engineering free resources, affordable courses in one place with huge community
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate("/open-dashboard")} className="dd-btn dd-btn-dark w-full sm:w-auto">
                <Rocket className="h-5 w-5" />
                Go to Dashboard
              </button>
              <button onClick={() => navigate("/materials")} className="dd-btn dd-btn-outline w-full sm:w-auto">
                <Download className="h-5 w-5" />
                Get Free Resources
              </button>
            </div>
            <Link to="/projects" className="dd-link mt-5">
              Download Free Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.1}>
            <div className="dd-card dd-stats mx-auto mt-14 grid max-w-4xl grid-cols-2 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-4 py-7 ${i % 2 === 1 ? "" : "border-r"} ${i < 2 ? "border-b md:border-b-0" : ""} ${i < 3 ? "md:border-r" : "md:border-r-0"} border-[var(--dd-line)]`}
                >
                  <div className="mx-auto mb-3 flex justify-center text-[var(--dd-blue)]">{s.icon}</div>
                  <Counter value={s.value} suffix="+" className="dd-display block text-3xl font-extrabold" />
                  <div className="mt-1 text-sm text-[var(--dd-mute)]">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-[var(--dd-mute)]">
              Built for MSBTE K-Scheme diploma students
            </p>
            <div className="dd-ticker mx-auto mt-5 max-w-4xl">
              {[0, 1].map((copy) => (
                <div key={copy} className="dd-ticker-track" aria-hidden={copy === 1}>
                  {ALL_BRANCHES.map((b) => (
                    <Link
                      key={b}
                      to={`/materials?branch=${encodeURIComponent(b)}`}
                      className="dd-ticker-item"
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      <GraduationCap className="h-4 w-4 text-[var(--dd-blue)]" />
                      {b}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= 3 STEPS ================= */}
      <section className="dd-section dd-soft">
        <div className="dd-container">
          <Reveal className="dd-section-head">
            <span className="dd-eyebrow">How it works</span>
            <h2 className="dd-h2">
              Your Path to Success in <span className="dd-accent-grad">3 Easy Steps</span>
            </h2>
            <p className="dd-lead">From finding your subject to exam day, everything is a few taps away.</p>
          </Reveal>
          <div className="dd-steps grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={0.06 * i}>
                <div className="dd-card h-full p-8 text-center">
                  <div className="dd-step mx-auto w-fit">
                    <div className="dd-icon dd-icon-round">{s.icon}</div>
                    <span className="dd-step-num">{i + 1}</span>
                  </div>
                  <h3 className="dd-h3 mt-5">{s.title}</h3>
                  <p className="mt-2 leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="dd-section">
        <div className="dd-container">
          <Reveal className="dd-section-head">
            <span className="dd-eyebrow">Our services</span>
            <h2 className="dd-h2">
              Everything You Need to <span className="dd-accent-grad">Succeed</span>
            </h2>
            <p className="dd-lead">Free study material, exam guides, projects and exam dates for diploma students.</p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={0.05 * i}>
                <Link to={s.to} className="dd-card dd-card-link dd-card-top flex h-full flex-col p-7">
                  <div className="dd-icon">{s.icon}</div>
                  <h3 className="dd-h3 mt-5">{s.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed">{s.text}</p>
                  <span className="dd-link mt-5">
                    {s.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY BAND ================= */}
      <section className="dd-section dd-band">
        <div className="dd-container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="dd-eyebrow" style={{ background: "rgba(96,165,250,0.15)", color: "#93c5fd" }}>
              Community
            </span>
            <h2 className="dd-h2 mt-4">Join Our Active Student Community</h2>
            <p className="dd-lead mt-4 max-w-lg">
              Get all exam updates and study materials with important questions, and learn together with students from
              your branch.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="dd-btn dd-btn-wa">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="dd-btn dd-btn-tg">
                <Phone className="h-5 w-5" />
                Telegram
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="mb-7 space-y-2.5 border-b border-white/10 pb-7" aria-hidden>
                <div className="dd-bubble dd-bubble-in">Anyone has the Sem 5 notes?</div>
                <div className="dd-bubble dd-bubble-out">Shared in the group just now ✅</div>
                <div className="dd-bubble dd-bubble-in">Thanks! Exam timetable is out too 🎉</div>
              </div>
              <ul className="space-y-6">
                {COMMUNITY_POINTS.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--dd-blue)] text-white">
                      {p.icon}
                    </span>
                    <div>
                      <h3 className="dd-h3">{p.title}</h3>
                      <p className="mt-1 text-slate-300">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= RESOURCE LIBRARY ================= */}
      <section className="dd-section">
        <div className="dd-container">
          <Reveal className="dd-section-head">
            <span className="dd-eyebrow">Resources</span>
            <h2 className="dd-h2">
              Your Complete <span className="dd-accent-grad">Resource Library</span>
            </h2>
            <p className="dd-lead">Choose your branch, or jump straight to the kind of resource you need.</p>
            <div className="dd-tabs mt-7" role="tablist" aria-label="Browse resources">
              <button
                type="button"
                role="tab"
                aria-selected={libraryTab === "branch"}
                className="dd-tab"
                onClick={() => setLibraryTab("branch")}
              >
                By Branch
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={libraryTab === "type"}
                className="dd-tab"
                onClick={() => setLibraryTab("type")}
              >
                By Resource
              </button>
            </div>
          </Reveal>

          {libraryTab === "branch" ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {ALL_BRANCHES.map((branchName) => {
                const config = BRANCH_CARD_CONFIG[branchName];
                return (
                  <Link
                    key={branchName}
                    to={`/materials?branch=${encodeURIComponent(branchName)}`}
                    className="dd-card dd-card-link flex h-full flex-col items-center p-5 text-center sm:p-6"
                  >
                    <span className="dd-icon dd-icon-round [&_svg]:h-6 [&_svg]:w-6">
                      {config?.icon ?? <BookOpen className="h-6 w-6" />}
                    </span>
                    <h3 className="dd-h3 mt-4 text-base">{branchName}</h3>
                    <p className="mt-1.5 hidden text-sm leading-snug text-[var(--dd-mute)] sm:block">
                      {config?.subjects.slice(0, 2).join(" · ")}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {RESOURCE_TYPES.map((r) => (
                <Link
                  key={r.title}
                  to={r.to}
                  className="dd-card dd-card-link flex h-full flex-col items-center p-5 text-center sm:p-6"
                >
                  <span className="dd-icon dd-icon-round">{r.icon}</span>
                  <h3 className="dd-h3 mt-4 text-base">{r.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--dd-mute)]">{r.text}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <button onClick={() => navigate("/materials")} className="dd-btn dd-btn-blue">
              View All Materials <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= VVIMP GUIDES ================= */}
      {FEATURED_GUIDES.length > 0 ? (
        <section className="dd-section dd-soft">
          <div className="dd-container">
            <Reveal className="dd-section-head">
              <span className="dd-eyebrow">Exam season</span>
              <h2 className="dd-h2">
                Explore Our <span className="dd-accent-grad">VVIMP Guides</span>
              </h2>
              <p className="dd-lead">Unit-wise exam priority guides for MSBTE K-Scheme papers.</p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {FEATURED_GUIDES.map((p, i) => (
                <Reveal key={p.code} delay={0.06 * i}>
                  <div className="dd-card flex h-full flex-col overflow-hidden">
                    <div className="flex h-44 items-center justify-center bg-[var(--dd-blue-soft)]">
                      <img
                        src={`/vvimp-covers/${p.code}.jpg`}
                        alt={`${p.name} VVIMP guide cover`}
                        className="h-36 w-auto rounded-md object-contain shadow-md"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-[var(--dd-blue)]">
                        Semester {p.semester} · {p.code}
                      </div>
                      <h3 className="dd-h3 mt-2">{p.name}</h3>
                      <p className="mt-1 text-sm text-[var(--dd-mute)]">{p.branchLabel}</p>
                      <div className="mt-5 flex items-center justify-between pt-1">
                        <span className="dd-display text-2xl font-extrabold">₹{p.price}</span>
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="dd-btn dd-btn-dark dd-btn-sm">
                          Get Now
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/vvimp-store" className="dd-link">
                View all VVIMP guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ================= WHY CHOOSE ================= */}
      <section className="dd-section">
        <div className="dd-container">
          <Reveal className="dd-section-head">
            <span className="dd-eyebrow">Why DigiDiploma</span>
            <h2 className="dd-h2">
              Why Choose <span className="dd-accent-grad">DigiDiploma?</span>
            </h2>
            <p className="dd-lead">
              Experience the future of education with our comprehensive digital platform designed specifically for
              diploma students.
            </p>
          </Reveal>
          <div className="grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.04 * i}>
                <div className="flex gap-4">
                  <span className="dd-icon">{f.icon}</span>
                  <div>
                    <h3 className="dd-h3">{f.title}</h3>
                    <p className="mt-1.5 leading-relaxed">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="dd-section dd-soft">
        <div className="dd-container">
          <Reveal className="dd-section-head">
            <span className="dd-eyebrow">Student reviews</span>
            <h2 className="dd-h2">
              What Our <span className="dd-accent-grad">Students Say</span>
            </h2>
            <p className="dd-lead">
              Hear from students who have transformed their learning experience with DigiDiploma.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={0.06 * i}>
                <figure className="dd-card flex h-full flex-col p-7">
                  <div className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-[var(--dd-ink)]">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--dd-line)] pt-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--dd-blue)] text-lg font-bold text-white">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-bold text-[var(--dd-ink)]">{t.name}</span>
                      <span className="block text-sm text-[var(--dd-mute)]">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="dd-section">
        <div className="dd-container">
          <Reveal className="dd-section-head">
            <span className="dd-eyebrow">Frequently Asked Questions</span>
            <h2 className="dd-h2">
              Got Questions? <span className="dd-accent-grad">We've Got Answers</span>
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i + 1}`} className="dd-faq-item border-b-0 px-5 sm:px-6">
                  <AccordionTrigger className="px-0 py-5 text-left hover:no-underline">
                    <span className="text-base font-semibold text-[var(--dd-ink)] sm:text-lg">{f.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-relaxed text-[var(--dd-body)]">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <p>Still have questions?</p>
              <button onClick={() => navigate("/contact")} className="dd-btn dd-btn-outline dd-btn-sm">
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-20 sm:pb-28">
        <div className="dd-container">
          <Reveal>
            <div className="dd-cta rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
              <h2 className="dd-h2 mx-auto max-w-3xl" style={{ color: "#fff" }}>
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
                Join thousands of students who have already discovered the power of digital education with
                DigiDiploma.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/open-dashboard")}
                  className="dd-btn dd-btn-white w-full sm:w-auto"
                >
                  <BookOpen className="h-5 w-5" />
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="dd-btn dd-btn-outline-white w-full sm:w-auto"
                >
                  <Phone className="h-5 w-5" />
                  Get Support
                </button>
              </div>
              <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
                {["Free study materials", "MSBTE K-Scheme", "Works on any phone"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      {/* ================= WhatsApp community popup ================= */}
      <Dialog open={showWhatsAppPopup} onOpenChange={setShowWhatsAppPopup}>
        <DialogContent className="rounded-3xl border-0 bg-white p-8 text-center shadow-2xl sm:max-w-md">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">Join our Group for IMPs</DialogTitle>
            <DialogDescription className="sr-only">
              Get exam updates and important questions. Join our WhatsApp community.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#22c55e] shadow-lg shadow-green-500/30">
            <img
              src="https://cdn.simpleicons.org/whatsapp/FFFFFF"
              alt="WhatsApp"
              className="h-10 w-10"
              loading="eager"
              decoding="async"
            />
          </div>
          <h3 className="dd-h2 mt-5 text-[1.7rem]">Join our Group for IMPs</h3>
          <p className="dd-lead mx-auto mt-2 max-w-xs text-base">
            Get all exam updates and study materials with important questions.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="dd-btn dd-btn-blue flex-1"
              onClick={() => {
                window.open(WHATSAPP_COMMUNITY_URL, "_blank");
                setShowWhatsAppPopup(false);
              }}
            >
              Join Now
            </button>
            <button className="dd-btn dd-btn-soft flex-1" onClick={() => setShowWhatsAppPopup(false)}>
              Already Joined
            </button>
          </div>
          <p className="mt-4 text-xs text-[var(--dd-mute)]">No spam. Community announcements only.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

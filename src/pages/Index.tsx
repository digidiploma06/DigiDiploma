import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen,
  Users,
  Award,
  Star,
  ArrowRight,
  ArrowUpRight,
  Code,
  Smartphone,
  Cpu,
  Brain,
  Target,
  MessageCircle,
  Download,
  Phone,
  Shield,
  Car,
  Radio,
  FileText,
  Sparkles,
  GraduationCap,
  Layers,
  Bell,
  ChevronDown,
} from "lucide-react";
import { getBranchImage } from "@/lib/branchImages";
import { ALL_BRANCHES } from "@/constants/branches";
import SiteNav, { WHATSAPP_COMMUNITY_URL } from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import {
  Counter,
  CursorGlow,
  Magnetic,
  Marquee,
  Reveal,
  SplitWords,
  Tilt,
  motion,
  useFinePointer,
  useLiteMotion,
  useMouseParallax,
  useSmoothScroll,
  useTransform,
} from "@/components/site/motion";
import "@/styles/dd-theme.css";

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


const BRANCH_ACCENTS: Record<string, string> = {
  blue: "#7c9cff",
  green: "#5dffb0",
  purple: "#b79bff",
  orange: "#ffa45c",
  yellow: "#ffe45c",
  brown: "#ffbf7a",
};

const FEATURES = [
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: "Comprehensive Study Materials",
    description:
      "Access PDFs, PPTs, videos, and handwritten notes organized by branch, semester, and subject with advanced search capabilities.",
    span: "md:col-span-2",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "10 Engineering Branches",
    description:
      "Complete coverage across Computer, IT, Mechanical, Electrical, Civil, ENTC, Automobile, Instrumentation, AIML, and Mechatronics engineering branches.",
    span: "",
  },
  {
    icon: <Award className="h-7 w-7" />,
    title: "6 Semester Structure",
    description: "Organized semester-wise content with MSBTE K-Scheme subjects, quizzes, and progress tracking.",
    span: "",
  },
  {
    icon: <Code className="h-7 w-7" />,
    title: "Project Management",
    description:
      "Showcase your projects, collaborate with peers, and build your portfolio with our integrated project system.",
    span: "",
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with role-based access control, ensuring your data is always protected.",
    span: "",
  },
  {
    icon: <Star className="h-7 w-7" />,
    title: "24/7 Access",
    description:
      "Access your learning materials anytime, anywhere with our responsive web platform and mobile optimization.",
    span: "md:col-span-2 lg:col-span-3",
  },
];

const STEPS = [
  { n: "01", title: "Pick your branch", text: "Choose from 10 diploma engineering branches." },
  { n: "02", title: "Open your semester", text: "Subjects are sorted semester-wise on the MSBTE K-Scheme." },
  { n: "03", title: "Download and study", text: "Save notes, PPTs and projects to your phone for offline use." },
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

const TICKER_WORDS = [
  "Notes",
  "VVIMP Questions",
  "Model Answers",
  "Microprojects",
  "PPTs",
  "Question Banks",
  "MSBTE K-Scheme",
  "Handwritten Notes",
  "Exam Timetable",
];

interface PublicNotice {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const stats = { students: 1250, faculty: 45, courses: 120, materials: 850 };
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(true);

  const lite = useLiteMotion();
  const finePointer = useFinePointer();
  const heavy = finePointer && !lite;
  useSmoothScroll(heavy);
  const { sx, sy } = useMouseParallax(heavy);
  const nearX = useTransform(sx, [-0.5, 0.5], [-34, 34]);
  const nearY = useTransform(sy, [-0.5, 0.5], [-24, 24]);
  const farX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const farY = useTransform(sy, [-0.5, 0.5], [14, -14]);
  const stackRX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const stackRY = useTransform(sx, [-0.5, 0.5], [-14, 14]);

  // Confetti burst when the community popup opens
  useEffect(() => {
    if (!showWhatsAppPopup || lite) return;

    const end = Date.now() + 1000;
    const colors = ["#7C5CFF", "#A892FF", "#C6FF3D", "#FF5FA2", "#FFFFFF"];

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 1.2) * 10,
      g: 0.25 + Math.random() * 0.2,
      size: 3 + Math.random() * 4,
      color: colors[(Math.random() * colors.length) | 0],
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
    }));

    let frameId = 0;
    const cleanup = () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.rotation += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (Date.now() < end) {
        frameId = requestAnimationFrame(draw);
      } else {
        cleanup();
      }
    };
    frameId = requestAnimationFrame(draw);

    return cleanup;
  }, [showWhatsAppPopup, lite]);

  useEffect(() => {
    // Public notices feed the ticker under the hero
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

  const openBranch = (branchName: string) => navigate(`/materials?branch=${encodeURIComponent(branchName)}`);

  return (
    <div className={`dd ${lite ? "dd-lite" : ""}`}>
      <CursorGlow enabled={heavy} />
      <SiteNav />

      {/* ================= HERO ================= */}
      <section className="dd-noise relative overflow-hidden pb-16 pt-32 sm:pt-40 lg:min-h-screen lg:pb-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="dd-blob dd-blob-a" />
          <div className="dd-blob dd-blob-b" />
          <div className="dd-blob dd-blob-c" />
          <div className="dd-grid-bg absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur"
            >
              <Sparkles className="h-4 w-4" style={{ color: "var(--dd-lime)" }} />
              <span className="dd-mono text-xs uppercase text-white/80">MSBTE K-Scheme · Diploma &amp; Engineering</span>
            </motion.div>

            <h1 className="dd-display text-[13vw] text-white sm:text-7xl lg:text-[5.6rem]">
              <SplitWords text="Every diploma" delay={0.3} />
              <br />
              <SplitWords text="resource." delay={0.45} />
              <br />
              <SplitWords text="One place." delay={0.6} wordClassName={() => "dd-grad-text"} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--dd-mute)] sm:text-xl"
            >
              All your Diploma &amp; Engineering free resources, affordable courses in one place with huge community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              <Magnetic disabled={!heavy}>
                <button onClick={() => navigate("/materials")} className="dd-btn dd-btn-lime w-full sm:w-auto">
                  <Download className="h-5 w-5" />
                  Get Free Resources
                </button>
              </Magnetic>
              <Magnetic disabled={!heavy}>
                <button onClick={() => navigate("/open-dashboard")} className="dd-btn dd-btn-violet w-full sm:w-auto">
                  <BookOpen className="h-5 w-5" />
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Magnetic>
              <Magnetic disabled={!heavy}>
                <button onClick={() => navigate("/projects")} className="dd-btn dd-btn-ghost w-full sm:w-auto">
                  <Code className="h-5 w-5" />
                  Download Free Projects
                </button>
              </Magnetic>
            </motion.div>
          </div>

          {/* Floating 3D study stack */}
          <div className="relative hidden h-[520px] lg:col-span-5 lg:block" aria-hidden>
            <motion.div
              className="absolute inset-0"
              style={{ rotateX: stackRX, rotateY: stackRY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div style={{ x: farX, y: farY }} className="absolute right-2 top-6 w-64">
                <div className="dd-float-slow rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="dd-mono text-[10px] uppercase text-white/50">Projects</span>
                    <Code className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-4/5 rounded-full bg-white/20" />
                    <div className="h-2 w-3/5 rounded-full bg-white/10" />
                    <div className="h-2 w-2/3 rounded-full bg-white/10" />
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    <Layers className="h-3 w-3" /> Microprojects
                  </div>
                </div>
              </motion.div>

              <motion.div style={{ x: nearX, y: nearY }} className="absolute left-0 top-28 w-80">
                <div
                  className="dd-float rounded-[28px] p-6 shadow-[0_40px_120px_-30px_rgba(124,92,255,0.9)]"
                  style={{ background: "linear-gradient(150deg, #7c5cff 0%, #4b2fd6 100%)" }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="dd-mono text-[11px] uppercase text-white/70">Study Material</span>
                    <FileText className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="dd-display text-4xl text-white">Notes, PPTs &amp; PDFs</div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"].map((s) => (
                      <span key={s} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div style={{ x: farX, y: nearY }} className="absolute bottom-6 right-0 w-64">
                <div
                  className="dd-float-slow rounded-3xl p-5"
                  style={{ background: "var(--dd-lime)", color: "var(--dd-ink)" }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="dd-mono text-[10px] uppercase opacity-70">VVIMP Store</span>
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="dd-display text-3xl">Exam-ready question banks</div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-bold">
                    Open store <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{ x: nearX, y: farY }}
                className="absolute bottom-24 left-10 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-[var(--dd-surface)]"
              >
                <GraduationCap className="h-9 w-9" style={{ color: "var(--dd-lime)" }} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mx-auto mt-16 max-w-7xl px-5 sm:px-8 lg:mt-20">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
            {[
              { v: stats.students, l: "Active Students" },
              { v: stats.faculty, l: "Faculty Members" },
              { v: stats.courses, l: "Courses Available" },
              { v: stats.materials, l: "Study Materials" },
            ].map((s) => (
              <div key={s.l} className="bg-[var(--dd-ink)] px-5 py-7 sm:px-8">
                <Counter value={s.v} suffix="+" className="dd-display block text-4xl text-white sm:text-5xl" />
                <div className="dd-mono mt-2 text-[11px] uppercase text-[var(--dd-mute)]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 hidden justify-center lg:flex" aria-hidden>
          <ChevronDown className="dd-scroll-cue h-6 w-6 text-white/40" />
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <section className="relative border-y border-white/10 bg-[var(--dd-ink-2)] py-5" aria-label="Highlights">
        {notices.length > 0 ? (
          <Marquee speed={Math.max(30, notices.length * 12)}>
            {notices.map((n, i) => (
              <span key={n._id || n.id || i} className="flex items-center gap-3 whitespace-nowrap text-sm text-white/85">
                <Bell className="h-4 w-4 flex-shrink-0" style={{ color: "var(--dd-lime)" }} />
                <span className="font-bold text-white">{n.title}</span>
                {n.message ? <span className="text-[var(--dd-mute)]">{n.message}</span> : null}
              </span>
            ))}
          </Marquee>
        ) : (
          <Marquee speed={36}>
            {TICKER_WORDS.map((w) => (
              <span key={w} className="dd-display flex items-center gap-12 whitespace-nowrap text-2xl text-white/80">
                {w}
                <Star className="h-4 w-4 fill-current" style={{ color: "var(--dd-lime)" }} />
              </span>
            ))}
          </Marquee>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="dd-eyebrow mb-4">Why DigiDiploma</div>
          </Reveal>
          <h2 className="dd-display max-w-4xl text-5xl text-white sm:text-7xl">
            <SplitWords text="Why Choose" /> <SplitWords text="DigiDiploma?" delay={0.15} wordClassName={() => "dd-grad-text"} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg text-[var(--dd-mute)]">
              Experience the future of education with our comprehensive digital platform designed specifically for
              diploma students.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.06 * i} className={f.span}>
                <Tilt disabled={!heavy} className="h-full p-7 sm:p-8">
                  <div
                    className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background: i % 2 === 0 ? "var(--dd-violet)" : "var(--dd-lime)",
                      color: i % 2 === 0 ? "#fff" : "var(--dd-ink)",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div className="dd-mono mb-3 text-xs text-white/35">0{i + 1}</div>
                  <h3 className="dd-display mb-3 text-2xl text-white">{f.title}</h3>
                  <p className="leading-relaxed text-[var(--dd-mute)]">{f.description}</p>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[var(--dd-ink-2)] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="dd-eyebrow mb-4">How it works</div>
          </Reveal>
          <h2 className="dd-display text-5xl text-white sm:text-6xl">
            <SplitWords text="Three taps to your notes." />
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.12 * i}>
                <div className="relative border-t border-white/15 pt-8">
                  <motion.span
                    className="absolute -top-px left-0 h-px"
                    style={{ background: "var(--dd-lime)" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2 + 0.15 * i }}
                  />
                  <div className="dd-display text-7xl text-white/10">{s.n}</div>
                  <h3 className="dd-display mt-4 text-3xl text-white">{s.title}</h3>
                  <p className="mt-3 text-[var(--dd-mute)]">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BRANCHES ================= */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal>
                <div className="dd-eyebrow mb-4">10 branches</div>
              </Reveal>
              <h2 className="dd-display max-w-3xl text-5xl text-white sm:text-7xl">
                <SplitWords text="Available Engineering Branches" />
              </h2>
            </div>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-[var(--dd-mute)]">
                Choose from our comprehensive range of diploma engineering programs designed for the modern industry.
              </p>
            </Reveal>
          </div>

          <div className="dd-snap-row -mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {ALL_BRANCHES.map((branchName, i) => {
              const config = BRANCH_CARD_CONFIG[branchName] || {
                icon: <BookOpen className="h-8 w-8" />,
                description: "Study materials for this branch.",
                subjects: ["Materials"],
                color: "blue",
              };
              return (
                <Reveal key={branchName} delay={0.05 * (i % 3)} className="w-[82vw] flex-shrink-0 snap-center sm:w-auto">
                  <BranchCard
                    title={branchName}
                    icon={config.icon}
                    description={config.description}
                    subjects={config.subjects}
                    accent={BRANCH_ACCENTS[config.color] || BRANCH_ACCENTS.blue}
                    tilt={heavy}
                    onClick={() => openBranch(branchName)}
                  />
                </Reveal>
              );
            })}
          </div>
          <p className="dd-mono mt-2 text-center text-[11px] uppercase text-white/40 sm:hidden">Swipe to see all branches →</p>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="relative border-t border-white/10 bg-[var(--dd-ink-2)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="dd-eyebrow mb-4">Student voices</div>
          </Reveal>
          <h2 className="dd-display text-5xl text-white sm:text-7xl">
            <SplitWords text="What Our Students Say" />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg text-[var(--dd-mute)]">
              Hear from students who have transformed their learning experience with DigiDiploma.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={0.1 * i}>
                <Tilt disabled={!heavy} className="flex h-full flex-col p-8">
                  <div className="mb-6 flex gap-1" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" style={{ color: "var(--dd-lime)" }} />
                    ))}
                  </div>
                  <p className="flex-1 text-xl leading-relaxed text-white">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                    <div
                      className="dd-display flex h-11 w-11 items-center justify-center rounded-full text-lg text-white"
                      style={{ background: "var(--dd-violet)" }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-sm text-[var(--dd-mute)]">{t.role}</div>
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="dd-eyebrow mb-4">Frequently Asked Questions</div>
              </Reveal>
              <h2 className="dd-display text-5xl text-white sm:text-6xl">
                <SplitWords text="Got Questions? We've Got Answers" />
              </h2>
              <Reveal delay={0.1}>
                <p className="mt-6 text-[var(--dd-mute)]">Still have questions?</p>
                <button onClick={() => navigate("/contact")} className="dd-btn dd-btn-ghost mt-4">
                  <MessageCircle className="h-5 w-5" />
                  Contact Us
                </button>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={0.04 * i} y={20}>
                  <AccordionItem value={`item-${i + 1}`} className="dd-faq-item border-b-0 px-6">
                    <AccordionTrigger className="px-0 py-5 text-left text-white hover:no-underline">
                      <span className="flex items-baseline gap-4">
                        <span className="dd-mono text-xs" style={{ color: "var(--dd-lime)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-lg font-semibold text-white">{f.q}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pl-10 text-base leading-relaxed text-[var(--dd-mute)]">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative px-3 pb-24 sm:px-6">
        <Reveal>
          <div
            className="dd-noise relative mx-auto max-w-7xl overflow-hidden rounded-[36px] px-6 py-20 text-center sm:px-12 sm:py-28"
            style={{ background: "linear-gradient(135deg, #7c5cff 0%, #3a1fb8 55%, #150a52 100%)" }}
          >
            <div className="dd-blob dd-blob-b" style={{ top: "-30%", right: "-10%" }} aria-hidden />
            <h2 className="dd-display relative mx-auto max-w-4xl text-5xl text-white sm:text-7xl">
              <SplitWords text="Ready to Transform Your Learning Experience?" />
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg text-white/75">
              Join thousands of students who have already discovered the power of digital education with DigiDiploma.
            </p>
            <div className="relative mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Magnetic disabled={!heavy}>
                <button onClick={() => navigate("/open-dashboard")} className="dd-btn dd-btn-lime w-full sm:w-auto">
                  <BookOpen className="h-5 w-5" />
                  Go to Dashboard
                </button>
              </Magnetic>
              <Magnetic disabled={!heavy}>
                <button
                  onClick={() => navigate("/contact")}
                  className="dd-btn dd-btn-outline w-full sm:w-auto"
                >
                  <Phone className="h-5 w-5" />
                  Get Support
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />

      {/* ================= WhatsApp community popup ================= */}
      <Dialog open={showWhatsAppPopup} onOpenChange={setShowWhatsAppPopup}>
        <DialogContent className="overflow-hidden rounded-3xl border border-white/10 bg-[#11111c] p-0 text-white shadow-[0_30px_120px_-30px_rgba(124,92,255,0.9)] sm:max-w-md">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">Join our Group for IMPs</DialogTitle>
            <DialogDescription className="sr-only">
              Get exam updates and important questions. Join our WhatsApp community.
            </DialogDescription>
          </DialogHeader>
          <div
            className="relative px-8 pb-7 pt-9 text-center"
            style={{ background: "linear-gradient(150deg, #7c5cff 0%, #3a1fb8 100%)" }}
          >
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-xl">
              <div className="absolute -inset-3 -z-10 rounded-full bg-[#25D366] opacity-50 blur-2xl" />
              <img
                src="https://cdn.simpleicons.org/whatsapp/FFFFFF"
                alt="WhatsApp"
                className="h-9 w-9"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="dd-mono inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] uppercase">
              Exclusive Community
            </div>
            <h3 className="dd-display mt-3 text-3xl text-white">Join our Group for IMPs</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85 sm:text-base">
              Get all exam updates and study materials with important questions.
            </p>
          </div>
          <div className="p-6 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="dd-btn dd-btn-lime h-12 flex-1"
                onClick={() => {
                  window.open(WHATSAPP_COMMUNITY_URL, "_blank");
                  setShowWhatsAppPopup(false);
                }}
              >
                Join Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="dd-btn dd-btn-outline h-12 flex-1"
                onClick={() => setShowWhatsAppPopup(false)}
              >
                Already Joined
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-white/45">No spam. Community announcements only.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BranchCard = ({
  icon,
  title,
  description,
  subjects,
  accent,
  tilt,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  subjects: string[];
  accent: string;
  tilt: boolean;
  onClick: () => void;
}) => {
  const branchImage = getBranchImage(title);

  return (
    <Tilt
      disabled={!tilt}
      className="group h-full cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={branchImage}
          alt={`${title} theme`}
          className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14] via-[#0b0b14]/40 to-transparent" />
        <div
          className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl [&_svg]:h-6 [&_svg]:w-6"
          style={{ background: accent, color: "#0b0b14" }}
        >
          {icon}
        </div>
        <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-[var(--dd-lime)] group-hover:text-[var(--dd-ink)]">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="dd-display text-2xl text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--dd-mute)]">{description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span key={subject} className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/75">
              {subject}
            </span>
          ))}
        </div>
      </div>
    </Tilt>
  );
};

export default Index;

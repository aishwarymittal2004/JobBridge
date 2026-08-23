import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search, MessagesSquare, Building2 } from "lucide-react";

const STAGES = [
  { icon: FileText, label: "Resume", detail: "Upload once — PDF or DOCX" },
  { icon: Search, label: "Signal extraction", detail: "Gemini reads skills, experience, education" },
  { icon: Building2, label: "Career pages", detail: "Live web search finds matching companies" },
  { icon: MessagesSquare, label: "Feedback loop", detail: "The community tracks what actually works" },
];

export default function Landing() {
  return (
    <div className="bg-[#F3F4F6] dark:bg-ink-900 min-h-screen text-slate-900 dark:text-mist-100 font-sans transition-colors duration-300">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-ink-600 bg-[#F3F4F6] dark:bg-ink-900 transition-colors duration-300">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-300/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
            <p className="font-sans text-xs font-bold tracking-[0.25em] text-slate-500 dark:text-mist-500 uppercase mb-6">- FREE CAREER INSIGHTS</p>
            <h1 className="max-w-4xl font-sans text-5xl lg:text-[4.5rem] font-bold leading-[1.1] text-slate-900 dark:text-mist-100 tracking-tight transition-colors duration-300">
              The best way to find your{" "}
              <span className="text-blue-600 dark:text-signal-violet">next role.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-slate-600 dark:text-mist-400 font-medium leading-relaxed transition-colors duration-300">
              JobBridge reads your resume with AI, finds the career pages worth your time,
              and shows you what response rates other candidates are actually seeing —
              before you apply.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/signup" className="bg-blue-600 dark:bg-signal-violet hover:bg-blue-700 dark:hover:bg-signal-violet/80 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] dark:shadow-glow inline-flex items-center gap-2">
                Find my roles <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/hr/signup" className="bg-transparent border border-slate-300 dark:border-ink-600 hover:border-slate-400 dark:hover:border-ink-500 hover:text-blue-700 dark:hover:text-signal-cyan text-slate-800 dark:text-mist-300 font-bold py-3.5 px-8 rounded-full transition-all inline-flex items-center">
                I'm hiring
              </Link>
            </div>

            {/* Signature element: bridge/signal-chain diagram */}
            <div className="mt-20">
              <BridgeDiagram />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-24 bg-[#F8F9FE] dark:bg-ink-900 transition-colors duration-300">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-slate-900 dark:text-mist-100 tracking-tight transition-colors duration-300">
            From resume to response, tracked end to end.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="bg-white dark:bg-ink-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 hover:-translate-y-1 transition-transform">
                <div className="bg-blue-50 dark:bg-ink-700 text-blue-600 dark:text-signal-cyan p-3 rounded-2xl h-fit w-fit mb-6">
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-mist-100">{label}</h3>
                <p className="mt-3 text-sm text-slate-500 dark:text-mist-500 font-medium leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For HR */}
        <section className="border-t border-slate-200 dark:border-ink-600 bg-white dark:bg-ink-950/50 transition-colors duration-300">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="bg-slate-900 dark:bg-ink-800 rounded-[2rem] flex flex-col items-start gap-8 p-10 sm:p-12 sm:flex-row sm:items-center sm:justify-between shadow-xl relative overflow-hidden dark:border dark:border-ink-600">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 dark:bg-signal-cyan/10 rounded-full blur-[60px]"></div>
              <div className="relative z-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400 dark:text-signal-cyan mb-3 font-bold">For recruiting teams</p>
                <h3 className="font-display text-2xl font-bold sm:text-3xl text-white dark:text-mist-100 tracking-tight">
                  Search candidates by skill, not by keyword luck.
                </h3>
                <p className="mt-4 max-w-lg text-sm sm:text-base text-slate-400 dark:text-mist-500 font-medium">
                  Filter by parsed resume data, view insights instantly, and reach out —
                  up to three focused messages per candidate.
                </p>
              </div>
              <Link to="/hr/signup" className="relative z-10 bg-blue-600 dark:bg-signal-violet hover:bg-blue-500 dark:hover:bg-signal-violet/80 text-white font-bold py-4 px-8 rounded-full transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] dark:shadow-glow hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-95 shrink-0 inline-flex items-center gap-2">
                Open HR dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function BridgeDiagram() {
  const nodes = [
    { x: 40, y: 60, label: "Resume" },
    { x: 220, y: 20, label: "Gemini AI" },
    { x: 400, y: 60, label: "Career pages" },
    { x: 580, y: 20, label: "Feedback" },
  ];
  return (
    <svg viewBox="0 0 640 100" className="h-24 w-full max-w-2xl" fill="none" aria-hidden="true">
      <line x1="40" y1="60" x2="580" y2="20" stroke="currentColor" className="text-slate-200 dark:text-[#232B3D]" strokeWidth="3" strokeLinecap="round" />
      <line
        x1="40" y1="60" x2="580" y2="20"
        stroke="currentColor" className="text-blue-600 dark:text-[#6E5BFF] animate-pulseLine" strokeWidth="3" strokeDasharray="8 12" strokeLinecap="round"
      />
      {nodes.map((n, i) => (
        <g key={n.label} className="animate-drift" style={{ animationDelay: `${i * 0.4}s` }}>
          <circle cx={n.x} cy={n.y} r="8" className="fill-white dark:fill-[#0A0E17]" stroke={i % 2 === 0 ? "currentColor" : "currentColor"} style={{ color: i % 2 === 0 ? "var(--tw-colors-blue-600, #2563eb)" : "var(--tw-colors-blue-500, #3b82f6)" }} strokeWidth="3" />
          <text x={n.x} y={n.y + 28} fontSize="12" className="fill-slate-500 dark:fill-[#8B94A8]" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="600">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

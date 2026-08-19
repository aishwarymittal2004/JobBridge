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
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-600">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
          <p className="eyebrow mb-4">Resume in. Right roles out.</p>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            The job search stops being a{" "}
            <span className="text-signal-violet">guessing game.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-mist-300 sm:text-lg">
            JobBridge reads your resume with AI, finds the career pages worth your time,
            and shows you what response rates other candidates are actually seeing —
            before you apply.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/signup" className="btn-primary">
              Find my roles <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/hr/signup" className="btn-secondary">
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
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          From resume to response, tracked end to end.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="card p-5">
              <Icon className="h-5 w-5 text-signal-cyan" strokeWidth={2} />
              <h3 className="mt-4 font-display text-sm font-semibold text-mist-100">{label}</h3>
              <p className="mt-1.5 text-sm text-mist-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For HR */}
      <section className="border-t border-ink-600 bg-ink-950/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="card flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow mb-2">For recruiting teams</p>
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                Search candidates by skill, not by keyword luck.
              </h3>
              <p className="mt-2 max-w-lg text-sm text-mist-500">
                Filter by parsed resume data, view insights instantly, and reach out —
                up to three focused messages per candidate.
              </p>
            </div>
            <Link to="/hr/signup" className="btn-primary shrink-0">
              Open HR dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
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
      <line x1="40" y1="60" x2="580" y2="20" stroke="#232B3D" strokeWidth="2" />
      <line
        x1="40" y1="60" x2="580" y2="20"
        stroke="#6E5BFF" strokeWidth="2" strokeDasharray="6 8"
        className="animate-pulseLine"
      />
      {nodes.map((n, i) => (
        <g key={n.label} className="animate-drift" style={{ animationDelay: `${i * 0.4}s` }}>
          <circle cx={n.x} cy={n.y} r="6" fill="#0A0E17" stroke={i % 2 === 0 ? "#6E5BFF" : "#22D3EE"} strokeWidth="2" />
          <text x={n.x} y={n.y + 24} fontSize="11" fill="#8B94A8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

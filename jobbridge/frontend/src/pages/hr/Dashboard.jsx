import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { useListCandidatesQuery } from "../../store/api/hrApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

export default function HRDashboard() {
  const [skill, setSkill] = useState("");
  const [jobRole, setJobRole] = useState("");
  const { data: candidates, isLoading } = useListCandidatesQuery({
    skill: skill || undefined,
    job_role: jobRole || undefined,
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="eyebrow mb-2">HR dashboard</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Candidate directory</h1>
      <p className="mt-1 text-sm text-mist-500">Filter by skill or target role, parsed straight from resumes.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <input
            className="input-field pl-10"
            placeholder="Filter by skill, e.g. React"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <input
          className="input-field"
          placeholder="Filter by target role, e.g. Backend Developer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
      </div>

      {isLoading ? (
        <LoadingState label="Searching candidates" />
      ) : !candidates?.length ? (
        <div className="mt-8">
          <EmptyState title="No candidates match" description="Try a broader skill or role filter." />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {candidates.map((c) => (
            <Link
              key={c.id}
              to={`/hr/candidates/${c.id}`}
              className="card flex items-center justify-between p-5 transition hover:border-signal-violet/40"
            >
              <div>
                <h3 className="font-display text-sm font-semibold text-mist-100">{c.name}</h3>
                <p className="mt-0.5 text-xs text-mist-500">{c.email}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-mist-500" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

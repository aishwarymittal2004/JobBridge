import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery, useSetJobPreferenceMutation } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";

const SUGGESTED_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full-Stack Developer",
  "Data Analyst", "DevOps Engineer", "Product Manager", "UX Designer",
];

export default function CandidateProfile() {
  const { data: user, isLoading } = useGetProfileQuery();
  const [setJobPreference, { isLoading: isSaving }] = useSetJobPreferenceMutation();
  const [jobRole, setJobRole] = useState("");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return <LoadingState label="Loading profile" />;

  const handleSave = async (role) => {
    const finalRole = role || jobRole;
    if (!finalRole.trim()) return;
    await setJobPreference({ job_role: finalRole }).unwrap();
    setSaved(true);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="eyebrow mb-2">Profile</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Hi {user?.name?.split(" ")[0]}, what role are you after?</h1>
      <p className="mt-1 text-sm text-mist-500">
        This steers which career pages show up in your feed. You can change it anytime.
      </p>

      <div className="card mt-8 p-6">
        <label className="label">Target job role</label>
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="e.g. Backend Developer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
          <button onClick={() => handleSave()} disabled={isSaving} className="btn-primary shrink-0">
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>

        <p className="label mt-6">Or pick a common one</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_ROLES.map((r) => (
            <button
              key={r}
              onClick={() => { setJobRole(r); handleSave(r); }}
              className="rounded-full border border-ink-500 bg-ink-900/60 px-3 py-1.5 text-xs text-mist-300 transition hover:border-signal-cyan/50 hover:text-signal-cyan"
            >
              {r}
            </button>
          ))}
        </div>

        {saved && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-ok/30 bg-ok/10 px-4 py-3">
            <p className="text-sm text-ok">Preference saved.</p>
            <button onClick={() => navigate("/feed")} className="text-sm font-semibold text-ok hover:underline">
              View feed →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

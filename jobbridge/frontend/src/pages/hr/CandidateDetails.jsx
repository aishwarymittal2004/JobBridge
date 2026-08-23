import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Send, FileText, Download } from "lucide-react";
import {
  useGetCandidateQuery,
  useGetCandidateResumeQuery,
  useGetMessagesWithCandidateQuery,
  useSendMessageMutation,
} from "../../store/api/hrApi";
import LoadingState from "../../components/LoadingState";

const MAX_MESSAGES = 3;

export default function CandidateDetails() {
  const { id } = useParams();
  const { data: candidate, isLoading: loadingCandidate } = useGetCandidateQuery(id);
  const { data: resume, isLoading: loadingResume } = useGetCandidateResumeQuery(id);
  const { data: messages, isLoading: loadingMessages } = useGetMessagesWithCandidateQuery(id);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const accessToken = useSelector((s) => s.auth.accessToken);

  const handleDownload = async () => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${baseUrl}/api/hr/candidates/${id}/resume/file`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = resume?.original_filename || "resume";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const messagesSent = messages?.length || 0;
  const remaining = MAX_MESSAGES - messagesSent;

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    if (!draft.trim()) return;
    try {
      await sendMessage({ candidate_id: id, message: draft }).unwrap();
      setDraft("");
    } catch (err) {
      setError(err?.data?.detail || "Could not send message.");
    }
  };

  if (loadingCandidate || loadingResume) return <LoadingState label="Loading candidate" />;

  const extracted = resume?.extracted_data;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow mb-2">Candidate profile</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{candidate?.name}</h1>
      <p className="mt-1 text-sm text-mist-500">{candidate?.email}</p>

      <div className="card mt-8 p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-signal-cyan" />
          <h2 className="font-display text-sm font-semibold text-mist-100">Resume insights</h2>
        </div>

        {!resume ? (
          <p className="mt-4 text-sm text-mist-500">This candidate hasn't uploaded a resume yet.</p>
        ) : (
          <>
            {extracted?.skills?.length > 0 && (
              <div className="mt-5">
                <p className="label">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {extracted.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
            )}
            {extracted?.experience?.length > 0 && (
              <div className="mt-5">
                <p className="label">Experience</p>
                <ul className="flex flex-col gap-2 text-sm text-mist-300">
                  {extracted.experience.map((e, i) => (
                    <li key={i}>{e.title} — {e.company} ({e.duration})</li>
                  ))}
                </ul>
              </div>
            )}
            {typeof extracted?.total_experience_years === "number" && (
              <p className="mt-5 text-sm text-mist-500">
                Estimated experience: <span className="text-mist-100">{extracted.total_experience_years} years</span>
              </p>
            )}
            <button
              onClick={handleDownload}
              className="mt-5 flex items-center gap-1.5 text-sm text-signal-cyan hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> {resume.original_filename}
            </button>
          </>
        )}
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-sm font-semibold text-mist-100">Messages</h2>
        <p className="mt-1 text-xs text-mist-500">{remaining} of {MAX_MESSAGES} messages remaining</p>

        {loadingMessages ? (
          <LoadingState label="Loading thread" />
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {messages?.map((m) => (
              <div key={m.id} className="rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3">
                <p className="text-sm text-mist-100">{m.message}</p>
                <p className="mt-1 font-mono text-[11px] text-mist-500">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {remaining > 0 ? (
          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <input
              className="input-field"
              placeholder="Write a short message…"
              maxLength={500}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" disabled={isSending} className="btn-primary shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-warn">You've reached the message limit for this candidate.</p>
        )}
        {error && <p className="mt-2 text-sm text-bad">{error}</p>}
      </div>
    </main>
  );
}

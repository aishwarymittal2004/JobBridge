import { useState } from "react";
import { ExternalLink, Search, MessageCircle } from "lucide-react";
import { useGetCareerFeedQuery, useAddFeedbackMutation } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

const FEEDBACK_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "got_response", label: "Got response" },
  { value: "interview_scheduled", label: "Interview scheduled" },
  { value: "rejected", label: "Rejected" },
  { value: "no_response", label: "No response" },
];

export default function CareerFeed() {
  const [search, setSearch] = useState("");
  const { data: feed, isLoading } = useGetCareerFeedQuery(search || undefined);
  const [addFeedback] = useAddFeedbackMutation();
  const [activeLinkId, setActiveLinkId] = useState(null);
  const [comment, setComment] = useState("");

  const handleFeedback = async (careerLinkId, status) => {
    await addFeedback({ career_link_id: careerLinkId, status, comment: status === "custom" ? comment : undefined }).unwrap();
    setActiveLinkId(null);
    setComment("");
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="eyebrow mb-2">Career feed</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Companies matched to you</h1>
      <p className="mt-1 text-sm text-mist-500">
        Ranked by your resume skills and target role. Track your progress as you apply.
      </p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
        <input
          className="input-field pl-10"
          placeholder="Filter by company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <LoadingState label="Fetching career pages" />
      ) : !feed?.length ? (
        <div className="mt-8">
          <EmptyState
            title="No career pages yet"
            description="Upload a resume and set a target role from your dashboard — matches will appear here."
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {feed.map((link) => (
            <div key={link.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-mist-100">{link.company_name}</h3>
                  <p className="mt-0.5 text-xs text-mist-500">{link.role}</p>
                </div>
                <a
                  href={link.career_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-2 !px-3.5"
                >
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 font-mono text-[11px] text-mist-500">
                <span>{link.applied_count} applied</span>
                <span>{link.callback_count} callbacks</span>
                <span>{link.interview_count} interviews</span>
                <span className="text-signal-cyan">{link.response_rate}% response rate</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeLinkId === link.id ? (
                  <div className="flex w-full flex-wrap gap-2">
                    {FEEDBACK_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleFeedback(link.id, opt.value)}
                        className="rounded-full border border-ink-500 px-3 py-1 text-xs text-mist-300 hover:border-signal-violet/50 hover:text-signal-violet"
                      >
                        {opt.label}
                      </button>
                    ))}
                    <input
                      className="input-field !w-auto flex-1 !py-1.5 text-xs"
                      placeholder="Add a comment (optional)…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && comment && handleFeedback(link.id, "custom")}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveLinkId(link.id)}
                    className="flex items-center gap-1.5 text-xs text-signal-cyan hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Log feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

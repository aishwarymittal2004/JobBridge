import { useState } from "react";
import { ExternalLink, Search, MessageCircle, ArrowRight } from "lucide-react";
import { useGetCareerFeedQuery, useAddFeedbackMutation } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-ink-900 text-slate-800 dark:text-mist-100 font-sans relative overflow-hidden -m-4 sm:-m-8 p-4 sm:p-8 rounded-tl-3xl transition-colors duration-300">
      {/* Decorative blurred blobs to match the landing page vibe */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/30 dark:bg-signal-violet/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-signal-cyan/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <main className="relative z-10 max-w-5xl mx-auto py-4">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-mist-500 dark:hover:text-signal-cyan transition-colors mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to dashboard
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-mist-100 tracking-tight">Career feed</h1>
        <p className="mt-2 text-slate-500 dark:text-mist-500 text-base font-medium">Live career pages matched to your role and skills.</p>

        <div className="relative mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-mist-500" />
          <input
            className="w-full bg-white dark:bg-ink-800 border border-slate-200 dark:border-ink-600 text-slate-900 dark:text-mist-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-signal-cyan/20 focus:border-blue-500 dark:focus:border-signal-cyan transition-all placeholder:text-slate-400 dark:placeholder:text-mist-500 shadow-sm"
            placeholder="Filter by company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="mt-12"><LoadingState label="Fetching career pages" /></div>
        ) : !feed?.length ? (
          <div className="mt-12 bg-white dark:bg-ink-800 rounded-[2rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 text-center">
            <EmptyState
              title="No career pages yet"
              description="Upload a resume and set a target role from your dashboard — matches will appear here."
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6">
            {feed.map((link) => (
              <div key={link.id} className="bg-white dark:bg-ink-800 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 hover:border-blue-100 dark:hover:border-signal-cyan/30 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-mist-100 group-hover:text-blue-600 dark:group-hover:text-signal-cyan transition-colors">{link.company_name}</h3>
                    <div className="mt-2 inline-flex items-center gap-2 bg-slate-50 dark:bg-ink-700 text-slate-600 dark:text-mist-300 px-3 py-1 rounded-lg text-sm font-semibold border border-slate-100 dark:border-ink-600">
                      {link.role}
                    </div>
                  </div>
                  <a
                    href={link.career_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-blue-50 dark:bg-signal-cyan/10 hover:bg-blue-600 dark:hover:bg-signal-cyan/20 text-blue-700 dark:text-signal-cyan hover:text-white dark:hover:text-signal-cyan font-bold py-3 px-6 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap"
                  >
                    Open Career Page <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 sm:gap-6 text-sm font-medium text-slate-500 dark:text-mist-500 bg-slate-50/50 dark:bg-ink-900/50 p-4 rounded-2xl border border-slate-100 dark:border-ink-700">
                  <span className="flex items-center gap-1.5"><strong className="text-slate-800 dark:text-mist-100">{link.applied_count}</strong> applied</span>
                  <span className="flex items-center gap-1.5"><strong className="text-slate-800 dark:text-mist-100">{link.callback_count}</strong> callbacks</span>
                  <span className="flex items-center gap-1.5"><strong className="text-slate-800 dark:text-mist-100">{link.interview_count}</strong> interviews</span>
                  <span className="text-blue-600 dark:text-signal-cyan flex items-center gap-1.5 bg-blue-50 dark:bg-signal-cyan/10 px-2 py-0.5 rounded-md"><strong className="text-blue-700 dark:text-signal-cyan">{link.response_rate}%</strong> response rate</span>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-ink-700">
                  {activeLinkId === link.id ? (
                    <div className="flex flex-col sm:flex-row w-full gap-3">
                      <div className="flex flex-wrap gap-2 flex-1">
                        {FEEDBACK_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleFeedback(link.id, opt.value)}
                            className="bg-white dark:bg-ink-800 border border-slate-200 dark:border-ink-600 hover:border-blue-500 dark:hover:border-signal-cyan hover:bg-blue-50 dark:hover:bg-signal-cyan/10 hover:text-blue-700 dark:hover:text-signal-cyan text-slate-600 dark:text-mist-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="bg-slate-50 dark:bg-ink-900 border border-slate-200 dark:border-ink-600 text-slate-900 dark:text-mist-100 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-signal-cyan/20 focus:border-blue-500 dark:focus:border-signal-cyan transition-all placeholder:text-slate-400 dark:placeholder:text-mist-500 w-full sm:w-64"
                          placeholder="Add a comment…"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && comment && handleFeedback(link.id, "custom")}
                        />
                        <button 
                          onClick={() => handleFeedback(link.id, "custom")}
                          disabled={!comment}
                          className="bg-slate-900 dark:bg-ink-700 hover:bg-slate-800 dark:hover:bg-ink-600 text-white dark:text-mist-100 p-2 rounded-xl transition-all shadow-sm disabled:opacity-50"
                        >
                          <ArrowRight className="w-5 h-5 text-white dark:text-mist-100" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveLinkId(link.id)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-signal-cyan hover:text-blue-700 dark:hover:text-signal-cyan/80 hover:underline"
                    >
                      <MessageCircle className="h-4 w-4" /> Add feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

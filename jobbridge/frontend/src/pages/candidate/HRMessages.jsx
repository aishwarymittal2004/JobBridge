import { Mail } from "lucide-react";
import { useGetHrMessagesQuery } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { Link } from "react-router-dom";

export default function HRMessages() {
  const { data: messages, isLoading } = useGetHrMessagesQuery();

  if (isLoading) return <LoadingState label="Loading messages" />;

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-ink-900 text-slate-800 dark:text-mist-100 font-sans relative overflow-hidden -m-4 sm:-m-8 p-4 sm:p-8 rounded-tl-3xl transition-colors duration-300">
      {/* Decorative blurred blobs to match the landing page vibe */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/30 dark:bg-signal-violet/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-signal-cyan/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto py-4">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-mist-500 dark:hover:text-signal-cyan transition-colors mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to dashboard
        </Link>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-mist-100 tracking-tight">Messages from recruiters</h1>
        <p className="mt-2 text-slate-500 dark:text-mist-500 text-base font-medium">HR teams can send up to three short messages per candidate.</p>

        {!messages?.length ? (
          <div className="mt-10 bg-white dark:bg-ink-800 rounded-[2rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 text-center">
            <EmptyState
              title="No messages yet"
              description="When a recruiter reaches out, their messages will show up here."
            />
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-5">
            {messages.map((m) => (
              <div key={m.id} className="bg-white dark:bg-ink-800 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-ink-700 hover:border-blue-100 dark:hover:border-signal-cyan/30 transition-colors flex gap-5 group">
                <div className="bg-blue-50 dark:bg-signal-cyan/10 text-blue-600 dark:text-signal-cyan p-3 rounded-2xl h-fit shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-slate-800 dark:text-mist-100 leading-relaxed">{m.message}</p>
                  <p className="mt-3 text-xs font-bold text-slate-400 dark:text-mist-500 uppercase tracking-wider">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

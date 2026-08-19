import { Mail } from "lucide-react";
import { useGetHrMessagesQuery } from "../../store/api/candidateApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

export default function HRMessages() {
  const { data: messages, isLoading } = useGetHrMessagesQuery();

  if (isLoading) return <LoadingState label="Loading messages" />;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="eyebrow mb-2">Inbox</p>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Messages from recruiters</h1>
      <p className="mt-1 text-sm text-mist-500">HR teams can send up to three short messages per candidate.</p>

      {!messages?.length ? (
        <div className="mt-8">
          <EmptyState
            title="No messages yet"
            description="When a recruiter reaches out, their messages will show up here."
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className="card flex gap-3 p-5">
              <Mail className="h-4 w-4 shrink-0 text-signal-violet" />
              <div>
                <p className="text-sm text-mist-100">{m.message}</p>
                <p className="mt-2 font-mono text-[11px] text-mist-500">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

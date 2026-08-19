const STATUS_STYLES = {
  applied: "text-signal-cyan bg-signal-cyan/10 border-signal-cyan/30",
  got_response: "text-signal-amber bg-signal-amber/10 border-signal-amber/30",
  interview_scheduled: "text-ok bg-ok/10 border-ok/30",
  rejected: "text-bad bg-bad/10 border-bad/30",
  no_response: "text-mist-500 bg-mist-500/10 border-mist-500/30",
  custom: "text-signal-violet bg-signal-violet/10 border-signal-violet/30",
};

const STATUS_LABELS = {
  applied: "Applied",
  got_response: "Got response",
  interview_scheduled: "Interview scheduled",
  rejected: "Rejected",
  no_response: "No response",
  custom: "Comment",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${STATUS_STYLES[status] || STATUS_STYLES.custom}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-mist-500">
      <span className="h-2 w-2 animate-pulseLine rounded-full bg-signal-violet" />
      <span className="h-2 w-2 animate-pulseLine rounded-full bg-signal-violet [animation-delay:0.2s]" />
      <span className="h-2 w-2 animate-pulseLine rounded-full bg-signal-violet [animation-delay:0.4s]" />
      <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

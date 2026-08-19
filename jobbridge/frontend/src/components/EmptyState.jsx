export default function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold text-mist-100">{title}</h3>
      {description && <p className="max-w-sm text-sm text-mist-500">{description}</p>}
      {action}
    </div>
  );
}

export function InfoCard({ label, children }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-[#111722] p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 font-medium">{children}</div>
    </div>
  );
}

export function InfoBox({ title, children }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-[#111722] p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm">{children}</p>
    </div>
  );
}

export function InfoRow({ label, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1">{label}</h3>
      <p className="text-sm break-all">{children}</p>
    </div>
  );
}

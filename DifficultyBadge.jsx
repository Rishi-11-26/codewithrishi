const colors = {
  Easy: "bg-emerald-500/20 text-emerald-300",
  Medium: "bg-amber-500/20 text-amber-300",
  Hard: "bg-rose-500/20 text-rose-300"
};

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
}

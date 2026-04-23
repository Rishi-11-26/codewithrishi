import { useEffect, useMemo, useState } from "react";

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function Timer({ initialMinutes = 30 }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setExpired(true);
      return undefined;
    }
    const timer = setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatted = useMemo(() => formatTime(Math.max(secondsLeft, 0)), [secondsLeft]);

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2">
      <div className="text-xs text-slate-300">Timer</div>
      <div className={`text-lg font-semibold ${expired ? "text-rose-400" : "text-cyan-300"}`}>
        {formatted}
      </div>
      {expired ? (
        <p className="text-xs text-rose-300">Time is up. You can still continue practicing.</p>
      ) : null}
    </div>
  );
}

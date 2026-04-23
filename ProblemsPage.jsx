import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import DifficultyBadge from "../components/DifficultyBadge";

const filters = ["All", "Easy", "Medium", "Hard"];
const solveFilters = ["All", "Solved", "Unsolved"];

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [solveFilter, setSolveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadProblems = async () => {
    try {
      const { data } = await api.get("/problems");
      setProblems(data);
    } catch {
      setError("Failed to load problems.");
    }
  };

  useEffect(() => {
    loadProblems();
    api.get("/submissions").then(({ data }) => setSubmissions(data));
  }, []);

  const solvedSet = new Set(
    submissions.filter((submission) => submission.status === "Accepted").map((item) => item.problemId)
  );

  const visibleProblems = problems.filter((item) => {
    const matchesFilter = filter === "All" ? true : item.difficulty === filter;
    const isSolved = solvedSet.has(item.id);
    const matchesSolveFilter =
      solveFilter === "All" ? true : solveFilter === "Solved" ? isSolved : !isSolved;
    const query = search.trim().toLowerCase();
    const matchesSearch = query
      ? item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      : true;
    return matchesFilter && matchesSolveFilter && matchesSearch;
  });
  const solvedCount = solvedSet.size;
  const acceptedSubmissions = submissions.filter((submission) => submission.status === "Accepted").length;
  const submissionRate = submissions.length
    ? ((acceptedSubmissions / submissions.length) * 100).toFixed(1)
    : "0.0";
  const acceptedDays = new Set(
    submissions
      .filter((submission) => submission.status === "Accepted")
      .map((item) => new Date(item.timestamp).toISOString().slice(0, 10))
  );

  let streak = 0;
  const cursor = new Date();
  while (true) {
    const day = cursor.toISOString().slice(0, 10);
    if (!acceptedDays.has(day)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const deleteProblem = async (id) => {
    const confirmed = window.confirm("Delete this problem?");
    if (!confirmed) return;
    await api.delete(`/problems/${id}`);
    loadProblems();
  };

  return (
    <section className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
          <div className="text-sm text-slate-400">Solved</div>
          <div className="mt-1 text-3xl font-bold text-cyan-300">
            {solvedCount} / {problems.length}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
          <div className="text-sm text-slate-400">Submission Rate</div>
          <div className="mt-1 text-3xl font-bold text-indigo-300">{submissionRate}%</div>
          <div className="text-xs text-slate-500">{submissions.length} submissions</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
          <div className="text-sm text-slate-400">Daily Streak</div>
          <div className="mt-1 text-3xl font-bold text-amber-300">{streak} days</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">Problem Set</h2>
          <input
            className="input-base max-w-xs"
            placeholder="Search problems..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="mt-3 flex gap-2">
          {filters.map((item) => (
            <button
              key={item}
              className={`btn ${
                filter === item
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {solveFilters.map((item) => (
            <button
              key={item}
              className={`btn ${
                solveFilter === item
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              onClick={() => setSolveFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-rose-300">{error}</p> : null}

      <div className="grid gap-2">
        {visibleProblems.map((problem) => (
          <article
            key={problem.id}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 shadow-lg transition hover:border-slate-700"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full border ${
                    solvedSet.has(problem.id)
                      ? "border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                      : "border-slate-600 bg-slate-900"
                  }`}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium">{problem.title}</h3>
                    <DifficultyBadge difficulty={problem.difficulty} />
                    {solvedSet.has(problem.id) ? (
                      <span
                        aria-label="Solved"
                        title="Solved"
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/20 text-xs font-bold text-emerald-300"
                      >
                        ✓
                      </span>
                    ) : null}
                  </div>
                  {problem.tags?.length ? (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {problem.tags.map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-2 text-xs sm:text-sm">
                <Link
                  to={`/problem/${problem.id}`}
                  className="btn-primary"
                >
                  Solve
                </Link>
                <button
                  className="btn-warn"
                  onClick={() => navigate(`/edit/${problem.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => deleteProblem(problem.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {visibleProblems.length === 0 ? <p className="text-slate-400">No problems found.</p> : null}
    </section>
  );
}

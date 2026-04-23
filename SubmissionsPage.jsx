import { useEffect, useState } from "react";
import api from "../lib/api";

const statusColor = {
  Accepted: "text-emerald-300",
  "Wrong Answer": "text-amber-300",
  "Runtime Error": "text-rose-300",
  "Time Limit Exceeded": "text-rose-300"
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [openSubmissionId, setOpenSubmissionId] = useState(null);

  useEffect(() => {
    api.get("/submissions").then(({ data }) => setSubmissions(data));
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold">Submission History</h2>
      <p className="text-sm text-slate-400">
        Review your past submissions with status, runtime, testcases, and code.
      </p>
      {submissions.length === 0 ? <p className="text-slate-400">No submissions yet.</p> : null}
      {submissions.length > 0 ? (
        <div className="space-y-3 md:hidden">
          {submissions.map((submission) => (
            <article key={submission.id} className="panel p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{submission.problemTitle}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(submission.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={`text-sm font-semibold ${statusColor[submission.status] || "text-slate-200"}`}>
                  {submission.status}
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-300">
                Testcases: {submission.totalCount ? `${submission.passedCount}/${submission.totalCount}` : "-"}
              </div>
              <div className="text-sm text-slate-300">Runtime: {submission.runtimeMs}ms</div>
              <button
                className="btn-muted mt-3 px-3 py-1 text-xs"
                onClick={() =>
                  setOpenSubmissionId((value) => (value === submission.id ? null : submission.id))
                }
              >
                {openSubmissionId === submission.id ? "Hide Code" : "View Code"}
              </button>
              {openSubmissionId === submission.id ? (
                <pre className="mt-2 overflow-x-auto rounded bg-slate-950 p-3 text-xs text-slate-200">
                  {submission.code}
                </pre>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
      {submissions.length > 0 ? (
        <div className="hidden overflow-hidden rounded-xl border border-slate-800 bg-slate-900 md:block">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <div>Problem</div>
            <div>Status</div>
            <div>Testcases</div>
            <div>Runtime</div>
            <div>Code</div>
          </div>
          {submissions.map((submission) => (
            <article key={submission.id} className="border-b border-slate-800/80 last:border-0">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3">
                <div>
                  <div className="font-medium">{submission.problemTitle}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(submission.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={`font-semibold ${statusColor[submission.status] || "text-slate-200"}`}>
                  {submission.status}
                </div>
                <div className="text-sm text-slate-300">
                  {submission.totalCount ? `${submission.passedCount}/${submission.totalCount}` : "-"}
                </div>
                <div className="text-sm text-slate-300">{submission.runtimeMs}ms</div>
                <button
                  className="btn-muted px-3 py-1 text-xs"
                  onClick={() =>
                    setOpenSubmissionId((value) => (value === submission.id ? null : submission.id))
                  }
                >
                  {openSubmissionId === submission.id ? "Hide" : "View"}
                </button>
              </div>
              {openSubmissionId === submission.id ? (
                <pre className="mx-4 mb-3 overflow-x-auto rounded bg-slate-950 p-3 text-xs text-slate-200">
                  {submission.code}
                </pre>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

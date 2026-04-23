import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../lib/api";
import DifficultyBadge from "../components/DifficultyBadge";
import TestCaseResults from "../components/TestCaseResults";
import Timer from "../components/Timer";

function starterTemplate() {
  return `def solve():
    pass

if __name__ == "__main__":
    solve()
`;
}

export default function SolvePage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(starterTemplate);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [mobileTab, setMobileTab] = useState("description");
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const storageKey = useMemo(() => `code_problem_${id}`, [id]);

  useEffect(() => {
    api.get(`/problems/${id}`).then(({ data }) => setProblem(data));
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCode(saved);
    } else {
      setCode(starterTemplate());
    }
  }, [id, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, code);
  }, [code, storageKey]);

  const runCode = async () => {
    const sampleInput = problem.testCases?.[0]?.input ?? "";
    setLoading(true);
    setSubmitResult(null);
    const { data } = await api.post("/run", { code, input: sampleInput });
    setRunResult(data);
    setLoading(false);
  };

  const submitCode = async () => {
    setLoading(true);
    setRunResult(null);
    const { data } = await api.post(`/submit/${id}`, { code });
    setSubmitResult(data);
    setLoading(false);
  };

  const resetCode = () => {
    const confirmed = window.confirm("Reset code to default template?");
    if (!confirmed) return;
    setCode(starterTemplate());
    setRunResult(null);
    setSubmitResult(null);
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <section className="space-y-3 lg:space-y-0">
      <div className="flex gap-2 lg:hidden">
        <button
          className={`btn flex-1 ${
            mobileTab === "description"
              ? "bg-cyan-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setMobileTab("description")}
        >
          Description
        </button>
        <button
          className={`btn flex-1 ${
            mobileTab === "editor"
              ? "bg-cyan-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setMobileTab("editor")}
        >
          Editor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.35fr]">
      <div
        className={`panel min-w-0 space-y-3 overflow-y-auto p-4 lg:h-[calc(100vh-7.5rem)] ${
          mobileTab === "editor" ? "hidden lg:block" : "block"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{problem.title}</h2>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        {problem.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`btn text-xs ${
              timerEnabled ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
            onClick={() => setTimerEnabled((value) => !value)}
          >
            {timerEnabled ? "Disable Timer" : "Use 30m Timer"}
          </button>
        </div>
        {timerEnabled ? <Timer initialMinutes={30} /> : null}
        <p className="whitespace-pre-wrap text-slate-200">{problem.description}</p>
      </div>

      <div className={`min-w-0 space-y-3 ${mobileTab === "description" ? "hidden lg:block" : "block"}`}>
        <div className="panel flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold text-slate-300">Python</span>
          <div className="flex gap-2">
            <button
              className="btn-muted"
              onClick={resetCode}
              disabled={loading}
            >
              Reset
            </button>
            <button
              className="btn-success"
              onClick={runCode}
              disabled={loading}
            >
              Run
            </button>
            <button
              className="btn-primary"
              onClick={submitCode}
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <Editor
            height="55vh"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14
            }}
          />
        </div>

        <div className="panel space-y-3 p-3">
          <h3 className="text-lg font-semibold">Result</h3>
          {runResult ? (
            <div className="rounded bg-slate-800 p-3 text-sm">
              <div>
                <span className="font-semibold">Status:</span> {runResult.status}
              </div>
              <div>
                <span className="font-semibold">Runtime:</span> {runResult.runtimeMs}ms
              </div>
              {runResult.error ? (
                <div className="mt-2 text-rose-300">{runResult.error}</div>
              ) : (
                <pre className="mt-2 whitespace-pre-wrap text-slate-200">
                  {runResult.output || "(empty output)"}
                </pre>
              )}
            </div>
          ) : null}

          <TestCaseResults submitResult={submitResult} />
        </div>
      </div>
      </div>
    </section>
  );
}

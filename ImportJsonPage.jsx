import { useState } from "react";
import api from "../lib/api";

export default function ImportJsonPage() {
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON root must be an array.");
      }
      setPreview(parsed);
      setMessage("");
    } catch (error) {
      setPreview([]);
      setMessage(`Invalid JSON: ${error.message}`);
    }
  };

  const importProblems = async () => {
    try {
      const { data } = await api.post("/problems/import", { problems: preview });
      setMessage(`${data.importedCount} problems imported successfully`);
      setPreview([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Import failed.");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Import Problems via JSON</h2>
      <a
        className="btn-muted w-fit"
        href="/example-problems.json"
        download="example-problems.json"
      >
        Download Example JSON
      </a>
      <input
        type="file"
        accept=".json,application/json"
        className="input-base"
        onChange={handleFile}
      />

      {message ? <p className="text-cyan-300">{message}</p> : null}

      {preview.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-semibold">Preview ({preview.length})</h3>
          {preview.map((problem, index) => (
            <article key={index} className="rounded bg-slate-900 p-3">
              <div className="font-medium">{problem.title}</div>
              <div className="text-sm text-slate-300">{problem.difficulty}</div>
              {problem.tags?.length ? (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="text-sm text-slate-400">
                {problem.testCases?.length || 0} test cases
              </div>
            </article>
          ))}
          <button
            className="rounded bg-cyan-600 px-4 py-2 font-semibold hover:bg-cyan-500"
            onClick={importProblems}
          >
            Import JSON
          </button>
        </div>
      ) : null}
    </section>
  );
}

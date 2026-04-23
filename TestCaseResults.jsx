export default function TestCaseResults({ submitResult }) {
  if (!submitResult) return null;

  return (
    <section className="space-y-3">
      <div className="rounded-md bg-slate-800 p-3">
        <div className="text-sm">
          <span className="font-semibold">Status: </span>
          <span
            className={
              submitResult.status === "Accepted"
                ? "text-emerald-300"
                : submitResult.status === "Wrong Answer"
                  ? "text-amber-300"
                  : "text-rose-300"
            }
          >
            {submitResult.status}
          </span>
        </div>
        <div className="text-sm text-slate-300">
          Passed {submitResult.passedCount}/{submitResult.total} | Runtime {submitResult.runtimeMs}ms
        </div>
      </div>

      {submitResult.results.map((test, index) => (
        <article key={index} className="rounded-md border border-slate-700 bg-slate-900 p-3 text-sm">
          <div className={test.passed ? "text-emerald-300" : "text-rose-300"}>
            {test.passed ? "✅ Passed" : "❌ Failed"} - Test {index + 1}
          </div>
          {!test.passed ? (
            <div className="mt-2 space-y-1 text-slate-200">
              <div>
                <span className="text-slate-400">Expected:</span> {test.expected}
              </div>
              <div>
                <span className="text-slate-400">Got:</span> {test.got || "(empty)"}
              </div>
              {test.error ? (
                <div>
                  <span className="text-slate-400">Error:</span> {test.error}
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

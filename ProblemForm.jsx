import { useEffect, useState } from "react";

const defaultProblem = {
  title: "",
  description: "",
  difficulty: "Easy",
  tags: [],
  testCases: [{ input: "", output: "" }]
};

export default function ProblemForm({ initialValue, onSubmit, submitLabel }) {
  const [problem, setProblem] = useState({
    ...(initialValue ?? defaultProblem),
    tags: initialValue?.tags ?? []
  });

  useEffect(() => {
    if (!initialValue) return;
    setProblem({ ...initialValue, tags: initialValue.tags ?? [] });
  }, [initialValue]);

  const updateField = (field, value) => {
    setProblem((prev) => ({ ...prev, [field]: value }));
  };

  const updateTestCase = (index, field, value) => {
    setProblem((prev) => ({
      ...prev,
      testCases: prev.testCases.map((test, i) =>
        i === index ? { ...test, [field]: value } : test
      )
    }));
  };

  const addTestCase = () => {
    setProblem((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "" }]
    }));
  };

  const removeTestCase = (index) => {
    setProblem((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(problem);
      }}
    >
      <input
        className="input-base"
        placeholder="Title"
        value={problem.title}
        onChange={(event) => updateField("title", event.target.value)}
        required
      />
      <textarea
        className="input-base h-36"
        placeholder="Description"
        value={problem.description}
        onChange={(event) => updateField("description", event.target.value)}
        required
      />
      <select
        className="input-base"
        value={problem.difficulty}
        onChange={(event) => updateField("difficulty", event.target.value)}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <input
        className="input-base"
        placeholder="Tags (comma separated, e.g. arrays, hash-map)"
        value={(problem.tags ?? []).join(", ")}
        onChange={(event) =>
          updateField(
            "tags",
            event.target.value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          )
        }
      />

      <div className="panel space-y-3 p-3">
        <h3 className="font-semibold">Test Cases</h3>
        {problem.testCases.map((testCase, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-2">
            <input
              className="input-base"
              placeholder={`Input #${index + 1}`}
              value={testCase.input}
              onChange={(event) => updateTestCase(index, "input", event.target.value)}
              required
            />
            <div className="flex gap-2">
              <input
                className="input-base flex-1"
                placeholder={`Output #${index + 1}`}
                value={testCase.output}
                onChange={(event) => updateTestCase(index, "output", event.target.value)}
                required
              />
              {problem.testCases.length > 1 ? (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeTestCase(index)}
                >
                  X
                </button>
              ) : null}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn-muted"
          onClick={addTestCase}
        >
          + Add Test Case
        </button>
      </div>

      <button className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

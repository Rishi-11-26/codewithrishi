import express from "express";
import cors from "cors";
import { nextProblemId, problems, submissions } from "./dataStore.js";
import { runAgainstTestCases, runWithCustomInput } from "./judge.js";

const app = express();
const PORT = 4000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS blocked."));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

function validateProblem(problem) {
  if (!problem || typeof problem !== "object") return "Problem must be an object.";
  if (!problem.title || typeof problem.title !== "string") return "Title is required.";
  if (!problem.description || typeof problem.description !== "string") {
    return "Description is required.";
  }
  if (!["Easy", "Medium", "Hard"].includes(problem.difficulty)) {
    return "Difficulty must be Easy, Medium, or Hard.";
  }
  if (problem.tags !== undefined) {
    if (!Array.isArray(problem.tags) || problem.tags.some((tag) => typeof tag !== "string")) {
      return "Tags must be an array of strings.";
    }
  }
  if (!Array.isArray(problem.testCases) || problem.testCases.length === 0) {
    return "At least one test case is required.";
  }
  for (const test of problem.testCases) {
    if (
      !test ||
      typeof test.input !== "string" ||
      typeof test.output !== "string"
    ) {
      return "Every test case must include string input and output.";
    }
  }
  return null;
}

app.get("/api/problems", (_, res) => {
  res.json(problems);
});

app.get("/api/problems/:id", (req, res) => {
  const problem = problems.find((item) => item.id === req.params.id);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found." });
  }
  return res.json(problem);
});

app.post("/api/problems", (req, res) => {
  const error = validateProblem(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const newProblem = { ...req.body, id: nextProblemId() };
  problems.push(newProblem);
  return res.status(201).json(newProblem);
});

app.put("/api/problems/:id", (req, res) => {
  const index = problems.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: "Problem not found." });
  }

  const error = validateProblem(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const updated = { ...req.body, id: req.params.id };
  problems[index] = updated;
  return res.json(updated);
});

app.delete("/api/problems/:id", (req, res) => {
  const index = problems.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: "Problem not found." });
  }
  problems.splice(index, 1);
  return res.json({ message: "Problem deleted." });
});

app.post("/api/problems/import", (req, res) => {
  const { problems: incomingProblems } = req.body;
  if (!Array.isArray(incomingProblems)) {
    return res.status(400).json({ message: "problems must be an array." });
  }

  const parsed = [];
  for (const problem of incomingProblems) {
    const error = validateProblem(problem);
    if (error) {
      return res.status(400).json({ message: error });
    }
    parsed.push({ ...problem, id: nextProblemId() });
  }

  problems.push(...parsed);
  return res.json({
    importedCount: parsed.length,
    problems: parsed
  });
});

app.post("/api/run", async (req, res) => {
  const { code, input } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ message: "Code is required." });
  }

  const result = await runWithCustomInput(code, input ?? "");
  return res.json(result);
});

app.post("/api/submit/:problemId", async (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ message: "Code is required." });
  }

  const problem = problems.find((item) => item.id === req.params.problemId);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found." });
  }

  const result = await runAgainstTestCases(code, problem.testCases);
  submissions.unshift({
    id: String(Date.now()),
    problemId: problem.id,
    problemTitle: problem.title,
    status: result.status,
    passedCount: result.passedCount,
    totalCount: result.total,
    runtimeMs: result.runtimeMs,
    timestamp: new Date().toISOString(),
    code
  });

  return res.json(result);
});

app.get("/api/submissions", (_, res) => {
  return res.json(submissions);
});

app.listen(PORT, () => {
  console.log(`CodeWithRishi backend running on http://localhost:${PORT}`);
});

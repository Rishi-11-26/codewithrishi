import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

const EXEC_TIMEOUT_MS = 2000;
const PYTHON_BIN = process.env.PYTHON_BIN || "python3";

function normalizeOutput(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function runPython(code, input) {
  return new Promise(async (resolve) => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cwr-"));
    const filePath = path.join(dir, "main.py");
    const startedAt = Date.now();

    try {
      await fs.writeFile(filePath, code, "utf8");
    } catch (error) {
      resolve({
        ok: false,
        status: "Runtime Error",
        output: "",
        error: `Could not prepare execution file: ${error.message}`,
        runtimeMs: Date.now() - startedAt
      });
      return;
    }

    const child = spawn(PYTHON_BIN, [filePath], { stdio: "pipe" });
    let stdout = "";
    let stderr = "";
    let completed = false;

    const timeout = setTimeout(() => {
      if (!completed) {
        completed = true;
        child.kill("SIGKILL");
        resolve({
          ok: false,
          status: "Time Limit Exceeded",
          output: "",
          error: "Execution exceeded 2 seconds.",
          runtimeMs: Date.now() - startedAt
        });
      }
    }, EXEC_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", async (exitCode) => {
      if (completed) {
        await fs.rm(dir, { recursive: true, force: true });
        return;
      }

      completed = true;
      clearTimeout(timeout);
      await fs.rm(dir, { recursive: true, force: true });

      if (exitCode !== 0 || stderr) {
        resolve({
          ok: false,
          status: "Runtime Error",
          output: normalizeOutput(stdout),
          error: normalizeOutput(stderr) || `Exited with code ${exitCode}`,
          runtimeMs: Date.now() - startedAt
        });
        return;
      }

      resolve({
        ok: true,
        status: "Success",
        output: normalizeOutput(stdout),
        error: "",
        runtimeMs: Date.now() - startedAt
      });
    });

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}

export async function runAgainstTestCases(code, testCases) {
  const results = [];
  let totalRuntime = 0;
  let status = "Accepted";
  let passedCount = 0;

  for (const testCase of testCases) {
    const execution = await runPython(code, testCase.input);
    totalRuntime += execution.runtimeMs;
    const expected = normalizeOutput(testCase.output);

    if (!execution.ok) {
      status = execution.status;
      results.push({
        passed: false,
        input: testCase.input,
        expected,
        got: execution.output,
        error: execution.error
      });
      continue;
    }

    const passed = execution.output === expected;
    if (passed) {
      passedCount += 1;
    } else if (status === "Accepted") {
      status = "Wrong Answer";
    }

    results.push({
      passed,
      input: testCase.input,
      expected,
      got: execution.output,
      error: ""
    });
  }

  const failedCount = testCases.length - passedCount;

  return {
    status,
    passedCount,
    failedCount,
    total: testCases.length,
    runtimeMs: totalRuntime,
    results
  };
}

export async function runWithCustomInput(code, input) {
  const execution = await runPython(code, input);
  return {
    status: execution.status,
    runtimeMs: execution.runtimeMs,
    output: execution.output,
    error: execution.error
  };
}

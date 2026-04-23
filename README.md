# CodeWithRishi

Personal coding platform inspired by a simplified LeetCode experience.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Monaco Editor
- Backend: Node.js, Express
- Code Execution: Python via `child_process`
- Storage: In-memory arrays/objects

## Project Structure

```
codewithrishi/
  backend/
    package.json
    src/
      dataStore.js
      judge.js
      server.js
  frontend/
    package.json
    index.html
    postcss.config.js
    tailwind.config.js
    vite.config.js
    src/
      App.jsx
      main.jsx
      index.css
      components/
      pages/
      lib/
```

## Run Locally

Requirements:
- Node.js 18+ and npm
- Python installed and available as `python`

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Features

- Problems list with difficulty filters (All/Easy/Medium/Hard)
- Solve page with Monaco Python editor, problem statement, timer, output panel
- `Run`, `Run with Custom Input`, `Submit`
- Backend judge:
  - compares normalized outputs (trim/whitespace/newline normalized)
  - returns per-test-case verdict, pass/fail counts, runtime
  - supports runtime error and 2-second timeout
- Add/Edit/Delete problems with dynamic test-case fields
- JSON import with preview and validation
- Submission history page
- Code persistence per problem in localStorage

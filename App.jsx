import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProblemsPage from "./pages/ProblemsPage";
import SolvePage from "./pages/SolvePage";
import AddEditProblemPage from "./pages/AddEditProblemPage";
import ImportJsonPage from "./pages/ImportJsonPage";
import SubmissionsPage from "./pages/SubmissionsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-5">
        <Routes>
          <Route path="/" element={<ProblemsPage />} />
          <Route path="/problem/:id" element={<SolvePage />} />
          <Route path="/add" element={<AddEditProblemPage />} />
          <Route path="/edit/:id" element={<AddEditProblemPage />} />
          <Route path="/import" element={<ImportJsonPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

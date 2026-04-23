import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import ProblemForm from "../components/ProblemForm";

export default function AddEditProblemPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/problems/${id}`).then(({ data }) => setInitialData(data));
  }, [id, isEdit]);

  const submit = async (problem) => {
    try {
      if (isEdit) {
        await api.put(`/problems/${id}`, problem);
        setMessage("Problem updated successfully.");
      } else {
        await api.post("/problems", problem);
        setMessage("Problem added successfully.");
      }
      setTimeout(() => navigate("/"), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save problem.");
    }
  };

  if (isEdit && !initialData) {
    return <p>Loading...</p>;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold">{isEdit ? "Edit Problem" : "Add Problem"}</h2>
      {message ? <p className="text-cyan-300">{message}</p> : null}
      <ProblemForm
        initialValue={initialData ?? undefined}
        onSubmit={submit}
        submitLabel={isEdit ? "Update Problem" : "Create Problem"}
      />
    </section>
  );
}

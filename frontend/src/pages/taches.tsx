import { getTasks } from "@/api";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import TaskCard from "@/components/Tasks/task.card";
import FormTasks from "@/components/Tasks/task.form";
import { Task } from "@/types/interface";
import { useEffect, useState } from "react";

export default function Taches() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 0) => {
    try {
      // setLoading(true);
      const { tasks: tasksData, totalPages } = await getTasks(page);
      setTasks(tasksData);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des tâches.");
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Layout title="Erreur de chargement">
        <div>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout title="Mes tâches">
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6">Liste des tâches</h2>
        <FormTasks submitLabel="Confirmer" onSuccess={() => fetchData(currentPage)} />
      </div>
      {tasks.length > 0 ? (
        <div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onSuccess={() => fetchData(currentPage)} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}  // Page précédente
              disabled={currentPage === 0}
            >
              Précédent
            </button>
            <span className="mx-2">Page {currentPage + 1} sur {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}  // Page suivante
              disabled={currentPage === totalPages - 1}
            >
              Suivant
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">Aucune tâche pour le moment.</div>
      )}
    </div>
  </Layout>
  );
}

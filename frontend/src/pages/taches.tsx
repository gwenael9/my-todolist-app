import { getTasks } from "@/api";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import PaginationTasks from "@/components/pagination.task";
import SelectTasks from "@/components/select.task";
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

  // toutes les tasks, terminées ou en cours
  const [whichTasks, setWhichTasks] = useState<string>("all");

  const fetchData = async (page = 0, whichTasks: string) => {
    try {
      const { tasks: tasksData, totalPages } = await getTasks(page, whichTasks);
      setTasks(tasksData);
      setTotalPages(totalPages);
    } catch (err) {
      setError("Erreur lors du chargement des tâches.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, whichTasks);
  }, [currentPage, whichTasks]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <Layout title="Erreur de chargement">
        <div>{error}</div>
      </Layout>
    );
  }

  // quand on change la valeur du select
  const handleSelectChange = (value: string) => {
    setWhichTasks(value);
    setCurrentPage(0);
  };

  return (
    <Layout title="Mes tâches">
      <div className="p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Liste des tâches</h2>
          <FormTasks
            submitLabel="Confirmer"
            onSuccess={() => fetchData(currentPage, whichTasks)}
          />
        </div>

        <div>
          <SelectTasks onChange={handleSelectChange} />
        </div>

        {tasks.length > 0 ? (
          <div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSuccess={() => fetchData(currentPage, whichTasks)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <PaginationTasks
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center mt-5">Aucune tâche pour le moment.</div>
        )}
      </div>
    </Layout>
  );
}

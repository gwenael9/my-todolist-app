import TaskCard from "@/components/Tasks/task.card";
import FormTasks from "@/components/Tasks/task.form";
import { getTasks } from "@/services/api";
import { Task } from "@/types/interface";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // appel de l'api
  const fetchData = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des tâches.");
      console.error(err);
      setLoading(false);
    }
  };

  // charger les tâches au 1er rendu
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (tasks.length === 0) {
    <div>Aucune tâche disponible.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Liste des tâches</h1>
      <FormTasks onSuccess={fetchData} />
      <div className="flex justify-center gap-2 mt-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onSuccess={fetchData} />
        ))}
      </div>
    </div>
  );
}

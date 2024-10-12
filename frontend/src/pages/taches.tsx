import { getTasks } from '@/api';
import Layout from '@/components/Layout/Layout';
import Loading from '@/components/Loading';
import TaskCard from '@/components/Tasks/task.card';
import FormTasks from '@/components/Tasks/task.form';
import { Task } from '@/types/interface';
import { useEffect, useState } from 'react';

export default function Taches() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  

  useEffect(() => {
    fetchData();
  }, []);

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
          <FormTasks submitLabel="Confirmer" onSuccess={fetchData} />
        </div>
        {tasks.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onSuccess={fetchData} />
            ))}
          </div>
        ) : (
          <div className="text-center">Aucune tâche pour le moment.</div>
        )}
      </div>
    </Layout>
  );
}

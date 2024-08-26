import { X } from "lucide-react";
import { Button } from "../ui/button";
import { deleteTask } from "@/api";
import { Task } from "@/types/interface";

interface TaskCardProps {
  task: Task;
  onSuccess: () => void;
}

export default function TaskCard({ task, onSuccess }: TaskCardProps) {

  // supprimer une tâche
  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    onSuccess();
  };
  
  return (
    <div className="p-2 rounded border">
      <div>{task.categorie.name}</div>
      <h2 className="font-bold">{task.title}</h2>
      <p>{task.description}</p>
      <div>
        <Button onClick={() => handleDeleteTask(task.id)}>
          <X />
        </Button>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { deleteTask } from "@/api";
import { Task } from "@/types/interface";
import { useToast } from "../ui/use-toast";

interface TaskCardProps {
  task: Task;
  onSuccess: () => void;
}

export default function TaskCard({ task, onSuccess }: TaskCardProps) {

  const { toast } = useToast();

  // supprimer une tâche
  const handleDeleteTask = async (id: number) => {
    try {
      const messageDelete = await deleteTask(id);
      onSuccess();
      toast({
        title: messageDelete,
      })
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur lors de la suppression.",
        variant: "destructive"
      })
    }
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

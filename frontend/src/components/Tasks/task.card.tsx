import { BadgeCheck, X } from "lucide-react";
import { Button } from "../ui/button";
import { deleteTask } from "@/api";
import { Task } from "@/types/interface";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormTasks from "./task.form";

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
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  // classe statique car pb interpretation si dynamique
  const categoryStyles: Record<string, { border: string; text: string }> = {
    travail: { border: "border-travail", text: "text-travail" },
    loisir: { border: "border-loisir", text: "text-loisir" },
    sport: { border: "border-sport", text: "text-sport" },
  };

  const category = task.categorie.name.toLowerCase();

  // Vérifier si la catégorie existe dans categoryStyles
  const { border, text } = categoryStyles[category] || {
    border: "border-gray-200",
    text: "text-gray-200",
  };

  return (
    <Card className={`border-4 ${border}`}>
      <CardHeader className="font-bold">
        <CardTitle className="flex justify-between min-h-12">
          {task.title.toUpperCase()}
          {!task.completed && (
            <span>
              <BadgeCheck color="green" />
            </span>
          )}
        </CardTitle>
        <CardDescription className={text}>
          {task.categorie.name}
        </CardDescription>
      </CardHeader>
      <CardContent>{task.description}</CardContent>
      <CardFooter className="flex gap-4">
        <FormTasks
          initialData={task}
          submitLabel="Modifier"
          onSuccess={onSuccess}
        />
        <Button
          variant="delete"
          size="card"
          onClick={() => handleDeleteTask(task.id)}
        >
          <X />
        </Button>
      </CardFooter>
    </Card>
  );
}

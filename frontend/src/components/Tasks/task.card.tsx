import { BadgeCheck, X } from "lucide-react";
import { Button } from "../ui/button";
import { deleteTask, updateProgressTask } from "@/api";
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
import { useState } from "react";
import { Switch } from "../ui/switch";
import { getColor, toUpOne } from "@/lib/functions";

interface TaskCardProps {
  task: Task;
  onSuccess: () => void;
  admin?: boolean;
}

export default function TaskCard({ task, onSuccess, admin }: TaskCardProps) {
  const { toast } = useToast();

  const [isCompleted, setIsCompleted] = useState<boolean>(task.completed);

  // supprimer une tâche
  const handleDeleteTask = async (id: number) => {
    try {
      const messageDelete = await deleteTask(id);
      onSuccess();
      toast({
        title: messageDelete,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: number, completed: boolean) => {
    try {
      await updateProgressTask(id, { completed });
      setIsCompleted(completed);
      toast({
        title: "Tâche modifié avec succès !",
        variant: "success",
      });
      onSuccess();
    } catch (err) {
      toast({
        title: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className={`border-4 ${
        task.completed ? "border-green-500" : "border-yellow-200"
      }`}
    >
      <CardHeader className="font-bold">
        <CardTitle className="flex justify-between min-h-12 text-y">
          {task.title.toUpperCase()}
          {task.completed && (
            <span>
              <BadgeCheck color="green" />
            </span>
          )}
        </CardTitle>
        <CardDescription
          className={`text-${getColor(task.categorie.name)}-500`}
        >
          {toUpOne(task.categorie.name)}
        </CardDescription>
      </CardHeader>
      <CardContent>{task.description}</CardContent>
      <CardFooter className="flex justify-between">
        {admin ? (
          <p>{task.user.username}</p>
        ) : (
          <Switch
            checked={isCompleted}
            onCheckedChange={(check) => updateTask(task.id, check)}
          />
        )}
        <div className="flex items-center gap-4">
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
        </div>
      </CardFooter>
    </Card>
  );
}

import { addTask, getCategories } from "@/api";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { Categorie } from "@/types/interface";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FormTaskProps {
  onSuccess: () => void;
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Le titre doit contenir au moins 2 caractères.",
    })
    .max(50, {
      message: "Le titre ne peux dépasser 50 caractères.",
    }),
  description: z.string().min(5, {
    message: "La description doit contenir au moins 5 caractères.",
  }),
});

export default function FormTasks({ onSuccess }: FormTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategorieName, setSelectedCategorieName] = useState<string | null>(null);  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const fetchDataCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setValidationErrors({});

    const result = formSchema.safeParse({ title, description });
    if (!result.success) {
      // gère les erreurs de validation spécifiques à chaque champ
      const fieldErrors = result.error.formErrors.fieldErrors;
      setValidationErrors({
        title: fieldErrors.title ? fieldErrors.title[0] : undefined,
        description: fieldErrors.description
          ? fieldErrors.description[0]
          : undefined,
      });
      setIsSubmitting(false);
      return;
    }

    if (!selectedCategorieName) {
      setError("Veuillez sélectionner une catégorie.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addTask({ title, description, categorie: { name: selectedCategorieName} });

      // si formulaire soumis, on réinitialise les champs
      setTitle("");
      setDescription("");
      setSelectedCategorieName(null);

      // nous permet de mettre à jour notre liste de tâches
      onSuccess();
    } catch (err) {
      setError("Une erreur est sourvenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="font-bold">Ajouter une tâche</h2>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div>
          <Input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            required
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.title}
            </p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1"
            required
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.description}
            </p>
          )}
        </div>
        <div>
          <Select onValueChange={(value) => setSelectedCategorieName(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((categorie) => (
                  <SelectItem key={categorie.id} value={categorie.name}>
                    {categorie.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ajout..." : "Ajouter"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

import { addTask, getCategories, updateTask } from "@/api";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { Categorie, Task } from "@/types/interface";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Pencil } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères.")
    .max(20, "Le titre ne peut dépasser 20 caractères."),
  description: z
    .string()
    .min(5, "La description doit contenir au moins 5 caractères."),
});

interface TaskFormProps {
  initialData?: Task;
  submitLabel: string;
  onSuccess: () => void;
}

export default function FormTasks({
  initialData,
  submitLabel,
  onSuccess,
}: TaskFormProps) {

  // Sois on récup les valeurs de la tâche à modifier sois vide
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [selectedCategorie, setSelectedCategorie] = useState<string>(
    initialData?.categorie.name || ""
  );
  const [selectedCategorieId, setSelectedCategorieId] = useState<number>(
    initialData?.categorie.id || 0
  );
  // toutes nos catégories
  const [categories, setCategories] = useState<Categorie[]>([]);

  // gère l'ouverture de la modal
  const [isOpen, setIsOpen] = useState(false);

  // gère les erreurs
  const [error, setError] = useState<{
    title?: string;
    description?: string;
    categorie?: string;
  }>({});

  const { toast } = useToast();

  // récup et stock nos catégories
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    // on vérifie que nos données soit valide
    const validation = formSchema.safeParse({ title, description });

    // si pas valide, on renvoie une erreur
    if (!validation.success) {
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setError({
        title: fieldErrors.title ? fieldErrors.title[0] : "",
        description: fieldErrors.description ? fieldErrors.description[0] : "",
      });
      return;
    }

    // si aucune catégorie de selectionnée, on renvoie une erreur
    if (!selectedCategorie) {
      setError((prevError) => ({
        ...prevError,
        categorie: "Veuillez sélectionner une catégorie.",
      }));
      return;
    }

    // on modifie/ajoute la tâche
    try {
      if (initialData) {
        // mise à jour de la tâche
        await updateTask(initialData.id, {
          title,
          description,
          categorie: { id: selectedCategorieId },
        });
        toast({ title: "Tâche modifiée avec succès !" });
      } else {
        // ajout de la nouvelle tâche
        await addTask({
          title,
          description,
          categorie: { name: selectedCategorie },
        });
        toast({ title: `La tâche "${title}" a été créée avec succès !` });
      }
      // si tout est bon, le refetch de nos tasks est faites (page /taches)
      onSuccess();
      // on ferme la modal
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  // a chaque fois qu'on change de categorie
  const handleCategorieChange = (name: string) => {
    // on défini son nom
    setSelectedCategorie(name);
    // on recup son id
    const selectedCat = categories.find((cat) => cat.name === name);
    if (selectedCat) {
      setSelectedCategorieId(selectedCat.id);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {initialData ? (
          <Button variant="edit" size="card">
            <Pencil size={16} />
          </Button>
        ) : (
          <Button>Ajouter une tâche</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
          <DialogDescription>
            Veuillez renseigner les informations suivantes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tâche
              </Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error.title && (
              <p className="col-span-4 text-red-500 text-sm">{error.title}</p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error.description && (
              <p className="col-span-4 text-red-500 text-sm">
                {error.description}
              </p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categorie" className="text-right">
                Catégorie
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={handleCategorieChange}
                  value={selectedCategorie}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
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
            </div>
            {error.categorie && (
              <p className="col-span-4 text-red-500 text-sm">
                {error.categorie}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="success" type="submit">
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

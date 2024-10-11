import { addCategorie, getCategories } from "@/api";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Categorie } from "@/types/interface";

const categorieSchema = z.object({
  name: z.string().min(1, "Le nom de la catégorie est requis"),
});

export default function CategorieAdmin() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Categorie[]>([]);

  //   ajouter une catégorie
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = categorieSchema.safeParse({ name });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError(null);

    try {
      await addCategorie({ name });
      toast({
        title: "Catégorie ajoutée",
        description: `La catégorie "${name}" a été ajoutée avec succès.`,
      });
      setName("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de la catégorie. Réessayez.",
        variant: "destructive",
      });
    }
  };

  const fetchDataCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError("Erreur lors du chargement des catégories.");
    }
  };

  useEffect(() => {
    fetchDataCategories();
  }, []);

  return (
    <Layout title="Configuration - Catégorie">
      <div className="flex justify-center gap-4 mt-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-[500px] border p-4 rounded"
        >
          <h2 className="font-semibold">Ajouter une catégorie</h2>
          <div className="flex mt-4 items-center gap-4">
            <Label htmlFor="categorie">Nom</Label>
            <Input
              id="categorie"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <Button type="submit" className="mt-4">
            Confirmez
          </Button>
        </form>
        <ul>
          {categories.map((categorie) => (
            <li key={categorie.id}>{categorie.name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

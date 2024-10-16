import apiClient from "./apiClient";

// voir les catégories
export const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

// ajouter une categorie
export const addCategorie = async (categorieData: { name: string }) => {
  const response = await apiClient.post("/categories", categorieData);
  return response.data;
};

// supprimer une catégorie
export const deleteCategorie = async (categorieId: number) => {
  try {
    const response = await apiClient.delete(`/categories/${categorieId}`);
    return response.data;
  } catch (err) {
    console.error("Erreur lors de la suppression de cette catégorie.");
    throw err;
  }
};

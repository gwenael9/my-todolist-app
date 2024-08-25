export interface Task {
  id: number;
  title: string;
  description: string;
  categorie: Categorie;
  completed: boolean;
}

export interface Categorie {
  id: number;
  name: string;
}
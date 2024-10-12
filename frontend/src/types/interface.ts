export interface Task {
  id: number;
  title: string;
  description: string;
  categorie: Categorie;
  completed: boolean;
  user: User;
}

export interface Categorie {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export enum Role {
  USER, ADMIN
}
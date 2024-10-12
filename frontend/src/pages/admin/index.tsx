import { getAllUsers, getCategories, getTasks } from "@/api";
import UserCard from "@/components/Admin/user.card";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import TaskCard from "@/components/Tasks/task.card";
import { Button } from "@/components/ui/button";
import { Categorie, Task, User } from "@/types/interface";
import { use, useEffect, useState } from "react";

export default function Admin() {
  const tables = ["catégories", "utilisateurs", "tâches"];

  const [tableData, setTableData] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableSelection, setTableSelection] = useState("utilisateurs");

  const fetchDataTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTableData(tasksData);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des tâches.");
      console.error(err);
      setLoading(false);
    }
  };

  const fetchDataUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
      console.error(err);
      setLoading(false);
    }
  };

  const fetchDataCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des catégories.");
      console.error(err);
      setLoading(false);
    }
  };

  const handleSeeTable = async (name: string) => {
    setLoading(true);
    setTableSelection(name);
    setError(null);

    if (name == "tâches") {
      fetchDataTasks();
    } else if (name == "utilisateurs") {
      fetchDataUsers();
    } else if (name == "catégories") {
      fetchDataCategories();
    }
  };

  //   par défaut on affiche les utilisateurs
  useEffect(() => {
    fetchDataUsers();
  }, []);

  return (
    <Layout title="Admin">
      <div className="px-4 py-2">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Gestion de nos données</h1>
          <div className="flex gap-4">
            {tables.map((table) => (
                <Button key={table} variant="admin" onClick={() => handleSeeTable(table)}>
                  {table}
                </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {tableSelection === "tâches"
            ? tableData.map((data) => (
                <TaskCard
                  key={data.id}
                  task={data}
                  onSuccess={fetchDataTasks}
                  admin={true}
                />
              ))
            : tableSelection === "utilisateurs"
            ? users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSuccess={fetchDataUsers}
                />
              ))
            : tableSelection === "catégories"
            ? categories.map((categorie) => (
                <h2 key={categorie.id}>{categorie.name}</h2>
              ))
            : null}
        </div>
      </div>
    </Layout>
  );
}

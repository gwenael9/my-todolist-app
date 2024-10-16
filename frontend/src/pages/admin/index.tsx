import { getAllUsers, getCategories } from "@/api";
import TableAdmin from "@/components/Admin/admin.table";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Categorie, User } from "@/types/interface";
import { useEffect, useState } from "react";

export type typeAdmin = "catégories" | "utilisateurs";

export default function Admin() {
  const tables: typeAdmin[] = ["catégories", "utilisateurs"];

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableSelection, setTableSelection] =
    useState<typeAdmin>("utilisateurs");

  const fetchDataUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError("Erreur lors du chargement des catégories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeTable = async (name: typeAdmin) => {
    setTableSelection(name);
    if (name == "utilisateurs") {
      fetchDataUsers();
    } else if (name == "catégories") {
      fetchDataCategories();
    }
  };

  // par défaut on affiche les utilisateurs
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
              <Button
                key={table}
                variant="admin"
                onClick={() => handleSeeTable(table)}
              >
                {table}
              </Button>
            ))}
          </div>
        </div>

        {loading && <Loading />}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-center">
          <TableAdmin
            data={tableSelection === "catégories" ? categories : users}
            type={tableSelection}
            onSuccess={() => handleSeeTable(tableSelection)}
          />
        </div>
      </div>
    </Layout>
  );
}

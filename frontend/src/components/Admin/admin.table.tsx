import { Categorie, User } from "@/types/interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { deleteCategorie, deleteUser, getUser } from "@/api";
import { UserRound, X } from "lucide-react";
import { Button } from "../ui/button";
import { typeAdmin } from "@/pages/admin";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";

interface TableAdminProps {
  data: Categorie[] | User[];
  type: typeAdmin;
  onSuccess: () => void;
}

export default function TableAdmin({ data, type, onSuccess }: TableAdminProps) {
  const { toast } = useToast();
  const [infoUserConnecte, setInfoUserConnecte] = useState<User | null>(null);

  // Fetch the connected user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setInfoUserConnecte(userData);
      } catch {
        setInfoUserConnecte(null);
      }
    };
    fetchUser();
  }, []);

  // Handle deletion based on the type of data (user or category)
  const handleDelete = async (id: number) => {
    try {
      const message =
        type === "utilisateurs"
          ? await deleteUser(id)
          : await deleteCategorie(id);

      onSuccess();
      toast({ title: message, variant: "success" });
    } catch {
      toast({
        title: "Erreur lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  // Define the table headers based on the data type
  const headers =
    type === "utilisateurs"
      ? ["ID", "Nom d'utilisateur", "Rôle", "Action"]
      : ["ID", "Catégorie", "Action"];

  return (
    <Table className="max-w-[1200px]">
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {type === "utilisateurs" &&
                  item.id === infoUserConnecte?.id && (
                    <UserRound size={16} className="mr-2" />
                  )}
                {"username" in item ? item.username : item.name}
              </div>
            </TableCell>
            {type === "utilisateurs" && (
              <TableCell>{(item as User).role}</TableCell>
            )}
            <TableCell>
              <Button onClick={() => handleDelete(item.id)} variant="delete">
                <X />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

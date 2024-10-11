import { Role, User } from "@/types/interface";
import { get } from "http";
import { Button } from "../ui/button";
import { UserRound, X } from "lucide-react";
import { deleteUser, getUser } from "@/api";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";

interface UserCardProps {
  user: User;
  onSuccess: () => void;
}

export default function UserCard({ user, onSuccess }: UserCardProps) {
  const { toast } = useToast();
  const [infoUserConnecte, setInfoUserConnecte] = useState<User | null>(null);

  const getColor = (item: string) => {
    if (item === "ADMIN") {
      return "border-red-500";
    } else {
      return "border-yellow-500";
    }
  };

  // supprimer un utilisateur
  const handleDeleteUser = async () => {
    try {
      const messageDelete = await deleteUser(user.id);
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

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setInfoUserConnecte(userData);
    } catch (err) {
      console.log("User not authenticated", err);
      setInfoUserConnecte(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className={`flex gap-3 border-2 rounded p-2 ${getColor(user.role)} min-w-36`}>
      <div>
        <div className="flex items-center">
          {user.id === infoUserConnecte?.id && (
            <UserRound size={16} className="mr-2" />
          )}
          <h2 className="uppercase font-semibold">{user.username}</h2>
        </div>
        <p>Rôle : {user.role}</p>
      </div>
      {user.id !== infoUserConnecte?.id && (
        <Button variant="delete" size="card" onClick={handleDeleteUser}>
          <X />
        </Button>
      )}
    </div>
  );
}

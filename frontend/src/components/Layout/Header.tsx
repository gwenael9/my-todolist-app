import { getUser, logout } from "@/api";
import { User } from "@/types/interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (err) {
      console.log("User not authenticated", err);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/connexion");
      toast({
        title: "Aurevoir !",
      })
    } catch (err) {
      console.log("Error during logout", err);
      toast({
        title: "Erreur lors de la déconnexion. Veuillez Réessayer.",
        variant: "destructive"
      })
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex gap-4 uppercase font-bold justify-between items-center h-20 border-b px-4">
      <Link href="/">Accueil</Link>
      {user ? (
        <>
          <span>Bienvenue, {user.username}</span>
          <button onClick={handleLogout}>Déconnexion</button>
        </>
      ) : (
        <Link href="/connexion">Connexion</Link>
      )}
    </div>
  );
}

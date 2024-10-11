import { login } from "@/api";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import Loading from "../Loading";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      router.push("/taches");
      setLoading(false);
      toast({
        title: `Bienvenue ${username} !`,
        variant: "success"
      });
    } catch (err) {
      setLoading(false);
      toast({
        title: "Une erreur est sourvenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="font-bold">Connexion</h2>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1"
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
            required
          />
        </div>

        <Button variant="success" type="submit">
          Connexion
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

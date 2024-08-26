import LoginForm from "@/components/Auth/login.form";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { logout } from "@/api";

export default function Connexion() {

    const handleLogout = () => {
        logout();
    }
  return (
    <Layout title="Connexion">
      <LoginForm />
      <Button onClick={handleLogout}>Déconnexion</Button>
    </Layout>
  );
}

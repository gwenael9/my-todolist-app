import Link from "next/link";

export function Header() {
  return (
    <div className="w-full h-20 border-b flex justify-center items-center">
      <div className="flex gap-4 uppercase font-bold">
        <Link href="/">Accueil</Link>
        <Link href="/connexion">Connexion</Link>
      </div>
    </div>
  );
}

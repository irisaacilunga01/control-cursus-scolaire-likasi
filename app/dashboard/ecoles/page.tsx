// app/notifications/page.tsx
import { getEcoles } from "@/app/actions/ecoles";
import { EcoleListClient } from "./ecoles-list-client"; // Importez le nouveau composant client
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    if (data.user.role === "ecole") {
      return redirect("/dashbord");
    }
  } else {
    redirect("/auth/login");
  }
  const { data: ecoles, success } = await getEcoles();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Ecoles</h2>
        <p className="text-red-500">
          Impossible de charger les données des écoles.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des écoles</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <EcoleListClient initialEcoles={ecoles || []} />
    </div>
  );
}

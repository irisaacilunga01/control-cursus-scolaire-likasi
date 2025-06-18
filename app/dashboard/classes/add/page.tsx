// app/classe/add/page.tsx
import { getEcoles } from "@/app/actions/ecoles";
import { getOptions } from "@/app/actions/options";
import { ClasseForm } from "@/components/classe-form"; // Assurez-vous que ce chemin est correct
import { createClient } from "@/lib/supabase/server";

export default async function AddClassePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  let userRole = "";
  if (data?.user) {
    userRole = data?.user.user_metadata.role;
  }
  const ecoleId = data?.user?.user_metadata?.ecole_id as number;

  // Récupérer la liste des options pour le sélecteur dans le formulaire
  const {
    data: options,

    success: optionsSuccess,
  } = await getOptions();

  if (!optionsSuccess || !options) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle Classe</h2>
        <p className="text-red-500">
          Impossible de charger la liste des options pour la sélection.
        </p>
      </div>
    );
  }
  const {
    data: ecoles,

    success: ecolesSuccess,
  } = await getEcoles();

  if (!ecolesSuccess || !ecoles) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle Option</h2>
        <p className="text-red-500">
          Impossible de charger la liste des elèves pour la sélection.
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle Classe</h2>
      <ClasseForm
        options={options}
        ecoles={ecoles}
        role={userRole}
        ecoleId={ecoleId}
      />
      {/* Passe la liste des options au formulaire */}
    </div>
  );
}

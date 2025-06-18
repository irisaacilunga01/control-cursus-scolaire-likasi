// app/inscription/page.tsx
import { getDossiers } from "@/app/actions/dossiers";
import { DossierListClient } from "./dossier-list-client"; // Importez le nouveau composant client

export default async function InscriptionPage() {
  // Récupération initiale des données côté serveur avec toutes les infos liées
  const { data: dossiers, success } = await getDossiers();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des dossiers</h2>
        <p className="text-red-500">
          Impossible de charger les données des dossiers.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Dossiers</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <DossierListClient initialDossiers={dossiers || []} />
    </div>
  );
}

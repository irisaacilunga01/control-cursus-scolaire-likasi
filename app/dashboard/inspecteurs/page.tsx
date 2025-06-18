import { getInspecteurs } from "../../actions/inspecteurs";
import { InspecteurListClient } from "./inspecteur-list-client";

export default async function InscriptionsPage() {
  // Récupération initiale des données côté serveur
  const { data: inpecteurs, success } = await getInspecteurs();

  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Parents</h2>
        <p className="text-red-500">
          Impossible de charger les données des parents.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Inspecteurs</h2>
      </div>
      {/* Passe les données initiales au composant client pour la gestion du temps réel */}
      <InspecteurListClient initialInspecteur={inpecteurs || []} />
    </div>
  );
}

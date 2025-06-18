import { getPaiements } from "@/app/actions/paiement";
import { PaiementListClient } from "./paiement-list-client";
export default async function PaiementPage() {
  const { data: paiements, success } = await getPaiements();
  if (!success) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Liste des Paiements</h2>
        <p className="text-red-500">
          Impossible de charger les données des paiements.
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  px-4">Liste des Paiements</h2>
      </div>
      <PaiementListClient initialPaiements={paiements || []} />
    </div>
  );
}

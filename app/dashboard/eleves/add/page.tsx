import { EleveForm } from "@/components/eleve-form"; // Assurez-vous que ce chemin est correct

export default async function AddElevePage() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel Élève</h2>
      <EleveForm />
      {/* Passe la liste des parents au formulaire */}
    </div>
  );
}

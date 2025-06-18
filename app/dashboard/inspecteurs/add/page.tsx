import { InspecteurForm } from "@/components/inspecteur-form";

export default function AddParentPage() {
  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel inspecteur</h2>
      <InspecteurForm />
    </div>
  );
}

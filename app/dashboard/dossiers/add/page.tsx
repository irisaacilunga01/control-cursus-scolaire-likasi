import { getEleves } from "@/app/actions/eleves";
import { getInspecteurs } from "@/app/actions/inspecteurs";
import { DossierForm } from "@/components/dossier-form";

export default async function AddInscriptionPage() {
  const { data: eleves, success: elevesSuccess } = await getEleves();
  const { data: inspecteurs, success: inspecteursSuccess } =
    await getInspecteurs();
  if (!elevesSuccess || !eleves) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel elève</h2>
        <p className="text-red-500">Impossible de charger les élèves.</p>
      </div>
    );
  }

  if (!inspecteursSuccess || !inspecteurs) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">
          Ajouter un nouvel Inspecteur
        </h2>
        <p className="text-red-500">Impossible de charger les classes.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un dossier</h2>
      <DossierForm eleves={eleves} inspecteurs={inspecteurs} />
    </div>
  );
}

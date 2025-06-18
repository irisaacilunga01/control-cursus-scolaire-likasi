// app/classe/[id]/edit/page.tsx
import { getDossierById } from "@/app/actions/dossiers";
import { getEleves } from "@/app/actions/eleves";
import { getInspecteurs } from "@/app/actions/inspecteurs";
import { DossierForm } from "@/components/dossier-form";
import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditDossierPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const iddossier = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(iddossier)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  // Récupérer la classe spécifique
  const { data: dossier, success } = await getDossierById(iddossier);

  if (!success || !dossier) {
    notFound(); // Affiche la page 404 si la classe n'existe pas
  }
  const { data: eleves, success: elevesSuccess } = await getEleves();
  const { data: inspecteurs, success: inspecteursSuccess } =
    await getInspecteurs();

  if (!elevesSuccess || !eleves) {
    return (
      <div className="container mx-auto pt-4">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouvelle elève</h2>
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
      <h2 className="text-2xl font-bold mb-6">Éditer la Classe</h2>
      <DossierForm
        initialData={dossier}
        eleves={eleves}
        inspecteurs={inspecteurs}
      />
    </div>
  );
}

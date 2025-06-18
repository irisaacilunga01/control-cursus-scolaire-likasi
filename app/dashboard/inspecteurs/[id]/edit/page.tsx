// app/parents/[id]/edit/page.tsx
import { getInspecteurById } from "@/app/actions/inspecteurs";
import { InspecteurForm } from "@/components/inspecteur-form"; // Assurez-vous que ce chemin est correct
import { notFound } from "next/navigation"; // Import notFound pour gérer les cas où le parent n'existe pas
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditParentPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const idinspecteur = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idinspecteur)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  const { data: inspecteur, success } = await getInspecteurById(idinspecteur);

  if (!success || !inspecteur) {
    notFound(); // Affiche la page 404 si le parent n'existe pas
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;inspecteur</h2>
      {/* Passe les données du parent existant au formulaire */}
      <InspecteurForm initialData={inspecteur} />
    </div>
  );
}

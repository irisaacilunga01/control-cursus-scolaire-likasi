// app/options/[id]/edit/page.tsx
import { getEcoleById } from "@/app/actions/ecoles";
import { EcoleForm } from "@/components/ecoles-form";
import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditEcolePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const idecole = parseInt(params.id, 10); // Convertir l'ID de chaîne en nombre

  if (isNaN(idecole)) {
    notFound(); // Si l'ID n'est pas un nombre valide, affiche une page 404
  }

  const { data: ecole, success } = await getEcoleById(idecole);

  if (!success || !ecole) {
    notFound(); // Affiche la page 404 si l'ecole n'existe pas
  }

  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Éditer l&apos;école</h2>
      {/* Passe les données de l'ecole existante au formulaire */}
      <EcoleForm initialData={ecole} />
    </div>
  );
}

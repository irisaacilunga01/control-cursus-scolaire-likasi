// app/api/inspecteurs/[matricule]/route.ts
import { createClient } from "@/lib/supabase/server";
import { Inspecteur } from "@/type"; // Assurez-vous d'importer le type Inspecteur
import { NextResponse } from "next/server";

// Définir les types pour la réponse de l'API
type InspecteurResponse = {
  success: boolean;
  data?: Inspecteur;
  error?: string;
};

/**
 * Gère la requête GET pour récupérer les informations d'un inspecteur par son matricule.
 * @param request L'objet de requête Next.js.
 * @param params Les paramètres de l'URL, contenant le matricule de l'inspecteur.
 * @returns Une réponse JSON contenant les informations de l'inspecteur ou une erreur.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ matricule: string }> }
): Promise<NextResponse<InspecteurResponse>> {
  const { matricule } = await params;
  const supabase = await createClient();

  if (!matricule) {
    return NextResponse.json(
      { success: false, error: "Le matricule de l'inspecteur est manquant." },
      { status: 400 }
    );
  }

  try {
    const { data: inspecteur, error } = await supabase
      .from("inspecteurs")
      .select("*")
      .eq("matricule", matricule)
      .single();

    if (error || !inspecteur) {
      if (error?.code === "PGRST116") {
        // Pas de lignes trouvées
        return NextResponse.json(
          {
            success: false,
            error: `Inspecteur non trouvé pour le matricule : ${matricule}`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `Erreur lors de la récupération de l'inspecteur: ${
            error?.message || "Inconnue"
          }`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: inspecteur },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erreur API /api/inspecteurs/matricule:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erreur serveur interne: ${error.message || "Inconnue"}`,
      },
      { status: 500 }
    );
  }
}

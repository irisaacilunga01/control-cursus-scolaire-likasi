// app/api/ecoles/[codeecole]/route.ts
import { createClient } from "@/lib/supabase/server";
import { Ecole } from "@/type"; // Assurez-vous d'importer le type Ecole
import { NextResponse } from "next/server";

// Définir les types pour la réponse de l'API
type EcoleStatsResponse = {
  success: boolean;
  data?: Ecole & {
    totalEleves?: number;
    totalClasses?: number;
    totalOptions?: number; // Nombre d'options uniques rattachées aux classes de cette école
  };
  error?: string;
};

/**
 * Gère la requête GET pour récupérer les informations d'une école et ses statistiques.
 * @param request L'objet de requête Next.js.
 * @param params Les paramètres de l'URL, contenant le code de l'école.
 * @returns Une réponse JSON contenant les informations de l'école et ses statistiques ou une erreur.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ codeecole: string }> }
): Promise<NextResponse<EcoleStatsResponse>> {
  const { codeecole } = await params;
  const supabase = await createClient();

  if (!codeecole) {
    return NextResponse.json(
      { success: false, error: "Le code de l'école est manquant." },
      { status: 400 }
    );
  }

  try {
    // 1. Récupérer les informations de l'école
    const { data: ecole, error: ecoleError } = await supabase
      .from("ecoles")
      .select("*")
      .eq("codeecole", codeecole)
      .single();
    if (ecoleError || !ecole) {
      if (ecoleError?.code === "PGRST116") {
        // Pas de lignes trouvées
        return NextResponse.json(
          {
            success: false,
            error: `École non trouvée pour le code : ${codeecole}`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `Erreur lors de la récupération de l'école: ${
            ecoleError?.message || "Inconnue"
          }`,
        },
        { status: 500 }
      );
    }

    // 2. Compter le nombre de classes pour cette école
    const { count: totalClasses, error: classesCountError } = await supabase
      .from("classes")
      .select("idclasse", { count: "exact", head: true })
      .eq("idecole", ecole.idecole);

    if (classesCountError) {
      console.error("Erreur lors du comptage des classes:", classesCountError);
      // Ne pas bloquer, utiliser 0 si erreur
    }

    // 3. Compter le nombre d'élèves associés aux classes de cette école
    // D'abord, récupérer les IDs des classes de cette école
    const { data: classIds, error: classIdsError } = await supabase
      .from("classes")
      .select("idclasse")
      .eq("idecole", ecole.idecole);

    let totalEleves = 0;
    if (classIdsError) {
      console.error(
        "Erreur lors de la récupération des IDs de classes:",
        classIdsError
      );
    } else if (classIds && classIds.length > 0) {
      const { count: elevesCount, error: elevesCountError } = await supabase
        .from("eleves")
        .select("ideleve", { count: "exact", head: true })
        .in(
          "idclasse",
          classIds.map((c) => c.idclasse)
        ); // Supposons que eleves a un idclasse

      if (elevesCountError) {
        console.error("Erreur lors du comptage des élèves:", elevesCountError);
      } else {
        totalEleves = elevesCount || 0;
      }
    }

    // 4. Compter le nombre d'options uniques rattachées aux classes de cette école
    const { data: optionsData, error: optionsError } = await supabase
      .from("classes")
      .select("idoption")
      .eq("idecole", ecole.idecole);

    let totalOptions = 0;
    if (optionsError) {
      console.error(
        "Erreur lors de la récupération des options des classes:",
        optionsError
      );
    } else if (optionsData) {
      const uniqueOptionIds = new Set(
        optionsData.map((c) => c.idoption).filter((id) => id !== null)
      );
      totalOptions = uniqueOptionIds.size;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...ecole,
          totalEleves: totalEleves || 0,
          totalClasses: totalClasses || 0,
          totalOptions: totalOptions || 0,
        },
      },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erreur API /api/ecoles/codeecole:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erreur serveur interne: ${error.message || "Inconnue"}`,
      },
      { status: 500 }
    );
  }
}

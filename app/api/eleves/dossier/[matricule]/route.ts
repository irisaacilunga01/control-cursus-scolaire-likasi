// app/api/eleves/dossier/[matricule]/route.ts
import { createClient } from "@/lib/supabase/server"; // Assurez-vous d'utiliser le client Supabase côté serveur
import {
  Annee_scolaire,
  Classe,
  Dossier,
  Ecole,
  Eleve,
  Inscription,
  Inspecteur,
  Option,
} from "@/type"; // Importez tous les types nécessaires
import { NextResponse } from "next/server";

// Définir les types pour la réponse de l'API
type EleveDossierResponse = {
  success: boolean;
  data?: {
    dossier: Dossier;
    eleve?: Eleve;
    inspecteur?: Inspecteur;
    inscriptions: (Inscription & {
      classe?: Classe & { option?: Option; ecole?: Ecole };
      anneescolaire?: Annee_scolaire;
    })[];
  };
  error?: string;
};

/**
 * Gère la requête GET pour récupérer toutes les informations d'un élève via son matricule de dossier.
 * @param request L'objet de requête Next.js.
 * @param params Les paramètres de l'URL, contenant le matricule du dossier.
 * @returns Une réponse JSON contenant les informations de l'élève ou une erreur.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ matricule: string }> }
): Promise<NextResponse<EleveDossierResponse>> {
  const { matricule } = await params;
  const supabase = await createClient();

  if (!matricule) {
    return NextResponse.json(
      { success: false, error: "Le matricule du dossier est manquant." },
      { status: 400 }
    );
  }

  try {
    // 1. Récupérer le dossier par matricule
    const { data: dossier, error: dossierError } = await supabase
      .from("dossiers")
      .select("*")
      .eq("matricule", matricule)
      .single();

    if (dossierError || !dossier) {
      if (dossierError?.code === "PGRST116") {
        // Pas de lignes trouvées
        return NextResponse.json(
          {
            success: false,
            error: `Dossier non trouvé pour le matricule : ${matricule}`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `Erreur lors de la récupération du dossier: ${
            dossierError?.message || "Inconnue"
          }`,
        },
        { status: 500 }
      );
    }

    // 2. Récupérer les informations de l'élève (si ideleve est présent)
    let eleve: Eleve | undefined;
    if (dossier.ideleve) {
      const { data: eleveData, error: eleveError } = await supabase
        .from("eleves")
        .select("*")
        .eq("ideleve", dossier.ideleve)
        .single();
      if (eleveError && eleveError.code !== "PGRST116") {
        console.error("Erreur lors de la récupération de l'élève:", eleveError);
        // Ne pas bloquer la réponse, mais enregistrer l'erreur
      } else if (eleveData) {
        eleve = eleveData;
      }
    }

    // 3. Récupérer les informations de l'inspecteur (si idinspecteur est présent)
    let inspecteur: Inspecteur | undefined;
    if (dossier.idinspecteur) {
      const { data: inspecteurData, error: inspecteurError } = await supabase
        .from("inspecteurs")
        .select("*")
        .eq("idinspecteur", dossier.idinspecteur)
        .single();
      if (inspecteurError && inspecteurError.code !== "PGRST116") {
        console.error(
          "Erreur lors de la récupération de l'inspecteur:",
          inspecteurError
        );
      } else if (inspecteurData) {
        inspecteur = inspecteurData;
      }
    }

    // 4. Récupérer toutes les inscriptions liées à cet élève, avec les détails de classe, option, école et année scolaire
    let inscriptions: (Inscription & {
      classes?: Classe & { options?: Option; ecoles?: Ecole };
      annee_scolaires?: Annee_scolaire;
    })[] = [];
    if (dossier.ideleve) {
      const { data: inscriptionsData, error: inscriptionsError } =
        await supabase
          .from("inscriptions")
          .select(
            `
          *,
          classes(*, options(*), ecoles(*)),
          annee_scolaires(*)
        `
          )
          .eq("ideleve", dossier.ideleve);

      if (inscriptionsError && inscriptionsError.code !== "PGRST116") {
        console.error(
          "Erreur lors de la récupération des inscriptions:",
          inscriptionsError
        );
      } else if (inscriptionsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inscriptions = inscriptionsData.map((insc: any) => ({
          ...insc,
          classe: insc.classes, // Renomme 'classes' en 'classe' pour correspondre au type
          anneescolaire: insc.annee_scolaires, // Renomme 'annee_scolaires' en 'anneescolaire'
          // Supprime les clés originales si nécessaire pour éviter la duplication
          classes: undefined,
          annee_scolaires: undefined,
        }));
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          dossier,
          eleve,
          inspecteur,
          inscriptions,
        },
      },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erreur API /api/eleves/dossier/matricule:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erreur serveur interne: ${error.message || "Inconnue"}`,
      },
      { status: 500 }
    );
  }
}

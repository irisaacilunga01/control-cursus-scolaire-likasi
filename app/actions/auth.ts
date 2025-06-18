// actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Vérifie si un e-mail est associé à une école existante et récupère son ID.
 * Cette fonction est utilisée pour l'inscription des préfets/administrateurs d'école.
 * @param email L'e-mail à vérifier.
 * @returns {idecole: number | null, success: boolean, error?: string} L'ID de l'école si trouvée, ou null avec succès/erreur.
 */
export async function checkEcoleEmailAndGetId(
  email: string
): Promise<{ idecole?: number | null; success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Recherche de l'e-mail dans le champ 'email' de la table 'ecoles'
    const { data, error } = await supabase
      .from("ecoles") // Cible la table 'ecoles'
      .select("idecole") // Sélectionne l'ID de l'école
      .eq("email", email) // Vérifie l'égalité avec l'email fourni
      .single(); // S'attend à un seul enregistrement

    if (error) {
      // Si aucune ligne n'est trouvée, Supabase renvoie une erreur avec code 'PGRST116'
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Cet e-mail n'est pas associé à une école enregistrée.",
        };
      }
      return {
        success: false,
        error:
          "Erreur lors de la vérification de l'e-mail de l'école : " +
          error.message,
      };
    }

    // Si des données sont retournées, l'e-mail existe pour une école
    return { idecole: data.idecole, success: true };
  } catch (err) {
    console.error(
      "Exception lors de la vérification de l'e-mail de l'école :",
      err
    );
    return {
      success: false,
      error:
        "Une erreur inattendue est survenue lors de la vérification de l'e-mail.",
    };
  }
}

// Note: Vous devrez peut-être ajouter d'autres fonctions liées à l'authentification ici à l'avenir.

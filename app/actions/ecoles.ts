// actions/ecoles.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { revalidate } from "@/lib/nextjs/revalidaPath"; // Assurez-vous que ce chemin est correct
import { createClient } from "@/lib/supabase/server";
import { Ecole } from "@/type"; // Importez le type Ecole

/**
 * Récupère toutes les écoles de la base de données.
 * @returns Une liste d'écoles, ou une erreur.
 */
export async function getEcoles(): Promise<{
  data?: Ecole[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ecoles") // Nom de la nouvelle table
      .select("*")
      .order("nomecole", { ascending: true }); // Tri par nom d'école

    if (error) {
      return {
        error: "Erreur lors de la récupération des écoles : " + error?.message,
        success: false,
      };
    }
    return { data: data as Ecole[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des écoles : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une école spécifique par son ID.
 * @param idecole L'ID de l'école à récupérer.
 * @returns L'école trouvée, ou une erreur.
 */
export async function getEcoleById(
  idecole: number
): Promise<{ data?: Ecole; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ecoles") // Nom de la nouvelle table
      .select("*")
      .eq("idecole", idecole)
      .single(); // S'attend à un seul enregistrement

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "École non trouvée.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération de l'école : " + error?.message,
        success: false,
      };
    }

    return { data: data as Ecole, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'école : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle école à la base de données.
 * @param newEcole Les données de la nouvelle école à ajouter (sans l'idecole).
 * @returns L'école ajoutée avec son id, ou une erreur.
 */
export async function addEcole(
  newEcole: Omit<Ecole, "idecole">
): Promise<{ data?: Ecole; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ecoles") // Nom de la nouvelle table
      .insert(newEcole)
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de l'ajout de l'école : " + error?.message,
        success: false,
      };
    }
    revalidate(); // Revalider les chemins pertinents
    return { data: data as Ecole, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'école : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une école existante dans la base de données.
 * @param idecole L'ID de l'école à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cette école.
 * @returns L'école mise à jour, ou une erreur.
 */
export async function updateEcole(
  idecole: number,
  updatedFields: Partial<Omit<Ecole, "idecole">>
): Promise<{ data?: Ecole; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ecoles") // Nom de la nouvelle table
      .update(updatedFields)
      .eq("idecole", idecole)
      .select()
      .single();

    if (error) {
      return {
        error: "Erreur lors de la mise à jour de l'école : " + error?.message,
        success: false,
      };
    }
    revalidate(); // Revalider les chemins pertinents
    return { data: data as Ecole, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de l'école : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une école de la base de données.
 * @param idecole L'ID de l'école à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteEcole(
  idecole: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("ecoles") // Nom de la nouvelle table
      .delete()
      .eq("idecole", idecole);

    if (error) {
      return {
        success: false,
        error: "Erreur lors de la suppression de l'école : " + error?.message,
      };
    }
    revalidate(); // Revalider les chemins pertinents
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'école : " + err,
    };
  }
}

// actions/anneescolaire.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { createClient } from "@/lib/supabase/server";
import { Annee_scolaire } from "@/type"; // Assurez-vous que Annee_scolaire est importé (notez l'underscore)
import { revalidatePath } from "next/cache";

/**
 * Récupère toutes les années scolaires de la base de données.
 * @returns Une liste d'années scolaires, ou une erreur.
 */
export async function getAnneescolaires(): Promise<{
  data?: Annee_scolaire[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("annee_scolaires") // Nom de la table mis à jour (au pluriel, avec underscore)
      .select("*")
      .order("datedebut", { ascending: false }); // Tri par date de début descendante pour les plus récentes

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des années scolaires : " +
          error?.message,
        success: false,
      };
    }
    return { data: data as Annee_scolaire[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des années scolaires : " + err,
      success: false,
    };
  }
}

/**
 * Récupère une année scolaire spécifique par son ID.
 * @param idannee L'ID de l'année scolaire à récupérer.
 * @returns L'année scolaire trouvée, ou une erreur.
 */
export async function getAnneescolaireById(
  idannee: number // Type de la colonne dans la DB
): Promise<{ data?: Annee_scolaire; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("annee_scolaires") // Nom de la table mis à jour
      .select("*")
      .eq("idannee", idannee)
      .single(); // S'attend à un seul enregistrement

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Année scolaire non trouvée.",
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération de l'année scolaire : " +
          error?.message,
        success: false,
      };
    }

    return { data: data as Annee_scolaire, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'année scolaire : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute une nouvelle année scolaire à la base de données.
 * @param newAnneeScolaire Les données de la nouvelle année scolaire à ajouter (sans l'idannee).
 * @returns L'année scolaire ajoutée avec son id, ou une erreur.
 */
export async function addAnneescolaire(
  newAnneeScolaire: Omit<Annee_scolaire, "idannee">
): Promise<{ data?: Annee_scolaire; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("annee_scolaires") // Nom de la table mis à jour
      .insert(newAnneeScolaire)
      .select() // Retourne les données insérées, y compris l'id généré
      .single(); // S'attend à un seul enregistrement retourné

    if (error) {
      return {
        error: "Erreur lors de l'ajout de l'année scolaire : " + error?.message,
        success: false,
      };
    }
    revalidatePath("/dashboard/annee-scolaires"); // Revalider le chemin correct
    return { data: data as Annee_scolaire, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'année scolaire : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour une année scolaire existante dans la base de données.
 * @param idannee L'ID de l'année scolaire à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cette année scolaire.
 * @returns L'année scolaire mise à jour, ou une erreur.
 */
export async function updateAnneescolaire(
  idannee: number,
  updatedFields: Partial<Omit<Annee_scolaire, "idannee">>
): Promise<{ data?: Annee_scolaire; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("annee_scolaires") // Nom de la table mis à jour
      .update(updatedFields)
      .eq("idannee", idannee) // Condition de mise à jour basée sur l'ID
      .select()
      .single();

    if (error) {
      return {
        error:
          "Erreur lors de la mise à jour de l'année scolaire : " +
          error?.message,
        success: false,
      };
    }
    revalidatePath("/dashboard/annee-scolaires"); // Revalider le chemin correct
    return { data: data as Annee_scolaire, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de l'année scolaire : " + err,
      success: false,
    };
  }
}

/**
 * Supprime une année scolaire de la base de données.
 * @param idannee L'ID de l'année scolaire à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteAnneescolaire(
  idannee: number
): Promise<{ error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("annee_scolaires") // Nom de la table mis à jour
      .delete()
      .eq("idannee", idannee); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression de l'année scolaire : " +
          error?.message,
      };
    }
    revalidatePath("/dashboard/annee-scolaires"); // Revalider le chemin correct
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'année scolaire : " + err,
    };
  }
}

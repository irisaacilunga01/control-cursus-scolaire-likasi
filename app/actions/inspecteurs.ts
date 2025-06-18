// actions/inspecteurs.ts
"use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

import { createClient } from "@/lib/supabase/server";
import { Inspecteur } from "@/type"; // Importez le type Inspecteur
import { Buffer } from "buffer"; // Import de Buffer pour la gestion des fichiers
import { v2 as cloudinary } from "cloudinary"; // Importe le SDK Cloudinary
import { revalidatePath } from "next/cache";

// Configure Cloudinary avec vos identifiants
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Utiliser HTTPS
});

/**
 * Fonction utilitaire pour supprimer une image de Cloudinary.
 * @param publicId L'ID public de l'image sur Cloudinary.
 */
async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(
        `Cloudinary n'a pas pu supprimer l'image: ${result.result}`
      );
    }
  } catch (err) {
    console.error("Erreur lors de la suppression d'image sur Cloudinary:", err);
    throw err; // Propage l'erreur
  }
}

/**
 * Extrait l'ID public d'une URL Cloudinary.
 * @param url L'URL complète de l'image Cloudinary.
 * @returns L'ID public de l'image.
 */
function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  // Regex pour capturer l'ID public (y compris les dossiers)
  const regex = /\/v\d+\/(.+?)\.\w{3,4}$/;
  const match = url.match(regex);
  if (match && match[1]) {
    // S'assurer de ne pas inclure "image/upload/" ou "video/upload/" au début
    const parts = match[1].split("/");
    // Chercher la partie après les transformations et 'v'
    const startIndex = parts.findIndex((part) => part.match(/^v\d+$/));
    if (startIndex !== -1 && startIndex + 1 < parts.length) {
      return parts.slice(startIndex + 1).join("/");
    }
    return match[1]; // Retourne juste le match si la structure est simple
  }
  return null; // Retourne null si l'ID public n'est pas trouvé
}

/**
 * Récupère tous les inspecteurs de la base de données.
 * @returns Une liste d'inspecteurs, ou une erreur.
 */
export async function getInspecteurs(): Promise<{
  data?: Inspecteur[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inspecteurs") // Nom de la table mis à jour
      .select("*")
      .order("idinspecteur", { ascending: true }); // Tri par ID pour un affichage cohérent

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des inspecteurs : " + error?.message,
        success: false,
      };
    }

    return { data: data as Inspecteur[], success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des inspecteurs : " + err,
      success: false,
    };
  }
}

/**
 * Récupère un inspecteur spécifique par son ID.
 * @param idinspecteur L'ID de l'inspecteur à récupérer.
 * @returns L'inspecteur trouvé, ou une erreur.
 */
export async function getInspecteurById(
  idinspecteur: number
): Promise<{ data?: Inspecteur; error?: string; success: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inspecteurs") // Nom de la table mis à jour
      .select("*")
      .eq("idinspecteur", idinspecteur)
      .single(); // S'attend à un seul enregistrement

    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Inspecteur non trouvé.",
          success: false,
        };
      }
      return {
        error:
          "Erreur lors de la récupération de l'inspecteur : " + error?.message,
        success: false,
      };
    }

    return { data: data as Inspecteur, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la récupération de l'inspecteur : " + err,
      success: false,
    };
  }
}

/**
 * Ajoute un nouvel inspecteur à la base de données et gère l'upload de la photo vers Cloudinary.
 * @param newInspecteurData Les données du nouvel inspecteur (sans l'idinspecteur et la photo).
 * @param photoFile Optionnel: Le fichier image à uploader.
 * @returns L'inspecteur ajouté avec son id et l'URL de la photo, ou une erreur.
 */
export async function addInspecteur(
  newInspecteurData: Omit<Inspecteur, "idinspecteur" | "photo">,
  photoFile?: File
): Promise<{ data?: Inspecteur; error?: string; success: boolean }> {
  let photoUrl: string | null = null;
  let publicId: string | null = null; // Pour stocker l'ID public de Cloudinary

  if (photoFile) {
    try {
      // Convertit le fichier en buffer pour l'upload vers Cloudinary
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload l'image vers Cloudinary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "inspecteurs", // Dossier dans Cloudinary où stocker les images
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        photoUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
      } else {
        throw new Error("Cloudinary n'a pas retourné d'URL sécurisée.");
      }
    } catch (uploadError) {
      console.error(
        "Erreur lors de l'upload de la photo vers Cloudinary:",
        uploadError
      );
      return {
        error: `Échec de l'upload de la photo: ${
          uploadError instanceof Error
            ? uploadError.message
            : String(uploadError)
        }`,
        success: false,
      };
    }
  }

  try {
    // Insère les données de l'inspecteur dans Supabase, y compris l'URL de la photo
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inspecteurs") // Nom de la table mis à jour
      .insert({ ...newInspecteurData, photo: photoUrl }) // photoUrl est maintenant l'URL Cloudinary
      .select()
      .single();

    if (error) {
      // Si l'insertion échoue après un upload réussi, tente de supprimer l'image de Cloudinary
      if (publicId) {
        await deleteImageFromCloudinary(publicId);
      }
      return {
        error:
          "Erreur lors de l'ajout de l'inspecteur dans la BD : " +
          error?.message, // Ajout .message
        success: false,
      };
    }
    revalidatePath("/dashboard/inspecteurs"); // Revalider le chemin des inspecteurs
    return { data: data as Inspecteur, success: true };
  } catch (err) {
    return {
      error: "Exception lors de l'ajout de l'inspecteur : " + err,
      success: false,
    };
  }
}

/**
 * Met à jour un inspecteur existant et gère le remplacement/suppression de la photo sur Cloudinary.
 * @param idinspecteur L'ID de l'inspecteur à mettre à jour.
 * @param updatedFields Les champs à mettre à jour pour cet inspecteur (sans 'photo' si un nouveau fichier est fourni).
 * @param newPhotoFile Optionnel: Le nouveau fichier image à uploader (remplacera l'ancienne photo).
 * @param deleteExistingPhoto Indique si la photo existante doit être supprimée sans en ajouter une nouvelle.
 * @returns L'inspecteur mis à jour, ou une erreur.
 */
export async function updateInspecteur(
  idinspecteur: number,
  updatedFields: Partial<Omit<Inspecteur, "idinspecteur" | "photo">>,
  newPhotoFile?: File,
  deleteExistingPhoto: boolean = false
): Promise<{ data?: Inspecteur; error?: string; success: boolean }> {
  let photoUrlUpdate: string | null | undefined = undefined; // undefined: pas de changement, null: supprimer la photo
  let newPublicId: string | null = null;
  const supabase = await createClient();

  // Récupère l'inspecteur existant pour connaître l'ancienne URL de photo
  const { data: existingInspecteur, error: fetchError } = await supabase
    .from("inspecteurs") // Nom de la table mis à jour
    .select("photo")
    .eq("idinspecteur", idinspecteur)
    .single();

  if (fetchError || !existingInspecteur) {
    console.error(
      "Erreur lors de la récupération de l'inspecteur existant:",
      fetchError
    );
    return {
      error: "Inspecteur non trouvé ou erreur de récupération.",
      success: false,
    };
  }

  const oldPhotoUrl = existingInspecteur.photo;
  const oldPublicId = oldPhotoUrl
    ? extractPublicIdFromCloudinaryUrl(oldPhotoUrl)
    : null;

  if (newPhotoFile) {
    // Upload de la nouvelle photo vers Cloudinary
    try {
      const arrayBuffer = await newPhotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "inspecteurs",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          )
          .end(buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        photoUrlUpdate = uploadResult.secure_url;
        newPublicId = uploadResult.public_id;

        // Supprime l'ancienne photo de Cloudinary si elle existe
        if (oldPublicId) {
          await deleteImageFromCloudinary(oldPublicId);
        }
      } else {
        throw new Error(
          "Cloudinary n'a pas retourné d'URL sécurisée pour la nouvelle photo."
        );
      }
    } catch (uploadError) {
      console.error(
        "Erreur lors de l'upload de la nouvelle photo:",
        uploadError
      );
      return {
        error: `Échec de l'upload de la nouvelle photo: ${
          uploadError instanceof Error
            ? uploadError.message
            : String(uploadError)
        }`,
        success: false,
      };
    }
  } else if (deleteExistingPhoto) {
    // Demande de suppression de la photo existante sans remplacement
    if (oldPublicId) {
      try {
        await deleteImageFromCloudinary(oldPublicId);
        photoUrlUpdate = null; // Définir le champ photo à NULL dans la BD
      } catch (deleteError) {
        return {
          error: `Échec de la suppression de la photo existante: ${
            deleteError instanceof Error
              ? deleteError.message
              : String(deleteError)
          }`,
          success: false,
        };
      }
    } else {
      photoUrlUpdate = null;
    }
  }

  // Crée l'objet de mise à jour final pour Supabase
  const fieldsToUpdate: Partial<Inspecteur> = { ...updatedFields };
  if (photoUrlUpdate !== undefined) {
    // Seulement si la photo a été modifiée ou supprimée (null)
    fieldsToUpdate.photo = photoUrlUpdate!;
  }

  try {
    const { data, error } = await supabase
      .from("inspecteurs") // Nom de la table mis à jour
      .update(fieldsToUpdate)
      .eq("idinspecteur", idinspecteur)
      .select()
      .single();

    if (error) {
      // Si la mise à jour échoue et une nouvelle photo a été uploadée, tente de la supprimer de Cloudinary
      if (newPhotoFile && newPublicId) {
        await deleteImageFromCloudinary(newPublicId);
      }
      return {
        error:
          "Erreur lors de la mise à jour de l'inspecteur dans la BD : " +
          error?.message, // Ajout .message
        success: false,
      };
    }
    revalidatePath("/dashboard/inspecteurs"); // Revalider le chemin des inspecteurs
    return { data: data as Inspecteur, success: true };
  } catch (err) {
    return {
      error: "Exception lors de la mise à jour de l'inspecteur : " + err,
      success: false,
    };
  }
}

/**
 * Supprime un inspecteur de la base de données et sa photo associée sur Cloudinary.
 * @param idinspecteur L'ID de l'inspecteur à supprimer.
 * @returns Un succès (pas de données retournées), ou une erreur.
 */
export async function deleteInspecteur(
  idinspecteur: number
): Promise<{ error?: string; success: boolean }> {
  let publicIdToDelete: string | null = null;

  // Récupère d'abord l'URL de la photo de l'inspecteur
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("inspecteurs") // Nom de la table mis à jour
      .select("photo")
      .eq("idinspecteur", idinspecteur)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(
        "Erreur lors de la récupération de la photo de l'inspecteur pour suppression:",
        error
      );
    } else if (data && data.photo) {
      publicIdToDelete = extractPublicIdFromCloudinaryUrl(data.photo);
    }
  } catch (err) {
    console.error(
      "Exception lors de la récupération de la photo de l'inspecteur:",
      err
    );
  }

  try {
    // Supprime l'enregistrement de l'inspecteur dans la base de données
    const { error } = await supabase
      .from("inspecteurs") // Nom de la table mis à jour
      .delete()
      .eq("idinspecteur", idinspecteur); // Condition de suppression basée sur l'ID

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression de l'inspecteur dans la BD : " +
          error?.message,
      };
    }

    // Supprime la photo de Cloudinary après la suppression réussie de l'enregistrement
    if (publicIdToDelete) {
      try {
        await deleteImageFromCloudinary(publicIdToDelete);
      } catch (photoDeleteError) {
        console.warn(
          `Avertissement: La photo avec Public ID ${publicIdToDelete} n'a pas pu être supprimée de Cloudinary après la suppression de l'inspecteur:`,
          photoDeleteError
        );
      }
    }
    revalidatePath("/dashboard/inspecteurs"); // Revalider le chemin des inspecteurs
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression de l'inspecteur : " + err,
    };
  }
}

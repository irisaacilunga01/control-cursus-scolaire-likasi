// // actions/dossiers.ts
// "use server"; // Indique que ce fichier contient des Server Actions ou des Server Components

// import { createClient } from "@/lib/supabase/server";
// import { Dossier, Eleve, Inspecteur } from "@/type"; // Importez les types nécessaires
// import { Buffer } from "buffer"; // Import de Buffer pour la gestion des fichiers
// import { v2 as cloudinary } from "cloudinary"; // Importe le SDK Cloudinary
// import { revalidatePath } from "next/cache";

// // Configure Cloudinary avec vos identifiants
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true, // Utiliser HTTPS
// });

// /**
//  * Fonction utilitaire pour supprimer une image de Cloudinary.
//  * @param publicId L'ID public de l'image sur Cloudinary.
//  */
// async function deleteImageFromCloudinary(publicId: string): Promise<void> {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     if (result.result !== "ok" && result.result !== "not found") {
//       throw new Error(
//         `Cloudinary n'a pas pu supprimer l'image: ${result.result}`
//       );
//     }
//   } catch (err) {
//     console.error("Erreur lors de la suppression d'image sur Cloudinary:", err);
//     throw err; // Propage l'erreur
//   }
// }

// /**
//  * Extrait l'ID public d'une URL Cloudinary.
//  * @param url L'URL complète de l'image Cloudinary.
//  * @returns L'ID public de l'image.
//  */
// function extractPublicIdFromCloudinaryUrl(url: string): string | null {
//   const regex = /\/v\d+\/(.+?)\.\w{3,4}$/;
//   const match = url.match(regex);
//   if (match && match[1]) {
//     const parts = match[1].split("/");
//     const startIndex = parts.findIndex((part) => part.match(/^v\d+$/));
//     if (startIndex !== -1 && startIndex + 1 < parts.length) {
//       return parts.slice(startIndex + 1).join("/");
//     }
//     return match[1];
//   }
//   return null;
// }

// /**
//  * Type pour les fichiers de bulletin/certificat qui seront uploadés.
//  */
// type BulletinFiles = {
//   bulletin5emeprimaireFile?: File;
//   bulletin6emeprimaireFile?: File;
//   certificatFile?: File;
//   bulletin1ereFile?: File;
//   bulletin2emeFile?: File;
//   bulletin3emeFile?: File;
//   bulletin4emeFile?: File;
//   bulletin5emeFile?: File;
// };

// /**
//  * Type pour les drapeaux de suppression de bulletin/certificat.
//  */
// type DeleteBulletinFlags = {
//   deleteBulletin5emeprimaire?: boolean;
//   deleteBulletin6emeprimaire?: boolean;
//   deleteCertificat?: boolean;
//   deleteBulletin1ere?: boolean;
//   deleteBulletin2eme?: boolean;
//   deleteBulletin3eme?: boolean;
//   deleteBulletin4eme?: boolean;
//   deleteBulletin5eme?: boolean;
// };

// /**
//  * Gère l'upload d'un fichier image vers Cloudinary.
//  * @param file Le fichier à uploader.
//  * @param folder Le dossier Cloudinary.
//  * @returns L'URL sécurisée et l'ID public de l'image.
//  */
// async function uploadImageToCloudinary(
//   file: File,
//   folder: string
// ): Promise<{ secure_url: string; public_id: string }> {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const uploadResult = await new Promise<any>((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: folder,
//           resource_type: "image",
//         },
//         (error, result) => {
//           if (error) reject(error);
//           resolve(result);
//         }
//       )
//       .end(buffer);
//   });

//   if (uploadResult && uploadResult.secure_url && uploadResult.public_id) {
//     return {
//       secure_url: uploadResult.secure_url,
//       public_id: uploadResult.public_id,
//     };
//   } else {
//     throw new Error(
//       "Cloudinary n'a pas retourné d'URL sécurisée ou d'ID public."
//     );
//   }
// }

// /**
//  * Récupère tous les dossiers de la base de données.
//  * Inclut les informations de l'élève et de l'inspecteur pour l'affichage.
//  * @returns Une liste de dossiers avec les détails liés, ou une erreur.
//  */
// export async function getDossiers(): Promise<{
//   data?: (Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur })[];
//   error?: string;
//   success: boolean;
// }> {
//   try {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .from("dossiers")
//       .select("*, eleves(*), inspecteurs(*)") // Jointure avec les tables eleve et inspecteur
//       .order("iddossier", { ascending: true });

//     if (error) {
//       return {
//         error:
//           "Erreur lors de la récupération des dossiers : " + error?.message,
//         success: false,
//       };
//     }

//     return {
//       data: data as (Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur })[],
//       success: true,
//     };
//   } catch (err) {
//     return {
//       error: "Exception lors de la récupération des dossiers : " + err,
//       success: false,
//     };
//   }
// }

// /**
//  * Récupère un dossier spécifique par son ID.
//  * Inclut les informations de l'élève et de l'inspecteur associées.
//  * @param iddossier L'ID du dossier à récupérer.
//  * @returns Le dossier trouvé avec les relations, ou une erreur.
//  */
// export async function getDossierById(iddossier: number): Promise<{
//   data?: Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur };
//   error?: string;
//   success: boolean;
// }> {
//   try {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .from("dossiers")
//       .select("*, eleves(*), inspecteurs(*)")
//       .eq("iddossier", iddossier)
//       .single();

//     if (error) {
//       if (error.code === "PGRST116") {
//         return {
//           error: "Dossier non trouvé.",
//           success: false,
//         };
//       }
//       return {
//         error: "Erreur lors de la récupération du dossier : " + error?.message,
//         success: false,
//       };
//     }

//     return {
//       data: data as Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur },
//       success: true,
//     };
//   } catch (err) {
//     return {
//       error: "Exception lors de la récupération du dossier : " + err,
//       success: false,
//     };
//   }
// }

// /**
//  * Ajoute un nouveau dossier à la base de données et gère l'upload des bulletins/certificats.
//  * @param newDossierData Les données du nouveau dossier (sans iddossier).
//  * @param files Les fichiers de bulletins/certificats à uploader.
//  * @returns Le dossier ajouté avec son ID et les URLs des fichiers, ou une erreur.
//  */
// export async function addDossier(
//   newDossierData: Omit<
//     Dossier,
//     | "iddossier"
//     | "bulletin5emeprimaire"
//     | "bulletin6emeprimaire"
//     | "certificat"
//     | "bulletin1ere"
//     | "bulletin2eme"
//     | "bulletin3eme"
//     | "bulletin4eme"
//     | "bulletin5eme"
//   >,
//   files: BulletinFiles
// ): Promise<{ data?: Dossier; error?: string; success: boolean }> {
//   const supabase = await createClient();
//   const dossierToInsert: Partial<Dossier> = { ...newDossierData };
//   const uploadedPublicIds: string[] = []; // Pour nettoyer en cas d'erreur

//   try {
//     // Liste des champs de fichiers et leurs noms correspondants dans la base de données
//     const fileFields: Array<{
//       fileKey: keyof BulletinFiles;
//       dbKey: keyof Dossier;
//       folder: string;
//     }> = [
//       {
//         fileKey: "bulletin5emeprimaireFile",
//         dbKey: "bulletin5emeprimaire",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin6emeprimaireFile",
//         dbKey: "bulletin6emeprimaire",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "certificatFile",
//         dbKey: "certificat",
//         folder: "dossiers/certificats",
//       },
//       {
//         fileKey: "bulletin1ereFile",
//         dbKey: "bulletin1ere",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin2emeFile",
//         dbKey: "bulletin2eme",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin3emeFile",
//         dbKey: "bulletin3eme",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin4emeFile",
//         dbKey: "bulletin4eme",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin5emeFile",
//         dbKey: "bulletin5eme",
//         folder: "dossiers/bulletins",
//       },
//     ];

//     for (const { fileKey, dbKey, folder } of fileFields) {
//       const file = files[fileKey];
//       if (file) {
//         try {
//           const { secure_url, public_id } = await uploadImageToCloudinary(
//             file,
//             folder
//           );
//           dossierToInsert[dbKey] = secure_url;
//           uploadedPublicIds.push(public_id);
//         } catch (uploadError) {
//           console.error(
//             `Erreur lors de l'upload du fichier ${String(fileKey)}:`,
//             uploadError
//           );
//           // Si un upload échoue, supprimez les précédents uploads réussis
//           for (const publicId of uploadedPublicIds) {
//             await deleteImageFromCloudinary(publicId);
//           }
//           return {
//             error: `Échec de l'upload pour ${String(fileKey)}: ${
//               uploadError instanceof Error
//                 ? uploadError.message
//                 : String(uploadError)
//             }`,
//             success: false,
//           };
//         }
//       }
//     }

//     // Insertion du dossier dans Supabase
//     const { data, error } = await supabase
//       .from("dossiers")
//       .insert(dossierToInsert)
//       .select()
//       .single();

//     if (error) {
//       // Si l'insertion BD échoue, supprime les images uploadées
//       for (const publicId of uploadedPublicIds) {
//         await deleteImageFromCloudinary(publicId);
//       }
//       return {
//         error:
//           "Erreur lors de l'ajout du dossier dans la BD : " + error?.message,
//         success: false,
//       };
//     }
//     revalidatePath("/dashboard/dossiers");
//     return { data: data as Dossier, success: true };
//   } catch (err) {
//     // Gérer les exceptions inattendues
//     for (const publicId of uploadedPublicIds) {
//       await deleteImageFromCloudinary(publicId);
//     }
//     return {
//       error: "Exception lors de l'ajout du dossier : " + err,
//       success: false,
//     };
//   }
// }

// /**
//  * Met à jour un dossier existant et gère le remplacement/suppression des fichiers de bulletins/certificats.
//  * @param iddossier L'ID du dossier à mettre à jour.
//  * @param updatedFields Les champs à mettre à jour pour ce dossier.
//  * @param newFiles Les nouveaux fichiers de bulletins/certificats à uploader (remplaceront les anciens).
//  * @param deleteFlags Les drapeaux indiquant quels fichiers existants doivent être supprimés.
//  * @returns Le dossier mis à jour, ou une erreur.
//  */
// export async function updateDossier(
//   iddossier: number,
//   updatedFields: Partial<
//     Omit<
//       Dossier,
//       | "iddossier"
//       | "bulletin5emeprimaire"
//       | "bulletin6emeprimaire"
//       | "certificat"
//       | "bulletin1ere"
//       | "bulletin2eme"
//       | "bulletin3eme"
//       | "bulletin4eme"
//       | "bulletin5eme"
//     >
//   >,
//   newFiles: BulletinFiles,
//   deleteFlags: DeleteBulletinFlags
// ): Promise<{ data?: Dossier; error?: string; success: boolean }> {
//   const supabase = await createClient();
//   const dossierToUpdate: Partial<Dossier> = { ...updatedFields };
//   const newlyUploadedPublicIds: string[] = []; // Pour nettoyer en cas d'échec de la mise à jour BD

//   try {
//     // Récupérer le dossier existant pour obtenir les URLs des anciens fichiers
//     const { data: existingDossier, error: fetchError } = await supabase
//       .from("dossiers")
//       .select(
//         "bulletin5emeprimaire, bulletin6emeprimaire, certificat, bulletin1ere, bulletin2eme, bulletin3eme, bulletin4eme, bulletin5eme"
//       )
//       .eq("iddossier", iddossier)
//       .single();

//     if (fetchError || !existingDossier) {
//       return {
//         error: "Dossier non trouvé ou erreur de récupération.",
//         success: false,
//       };
//     }

//     const fileFields: Array<{
//       fileKey: keyof BulletinFiles;
//       dbKey: keyof Dossier;
//       deleteKey: keyof DeleteBulletinFlags;
//       folder: string;
//     }> = [
//       {
//         fileKey: "bulletin5emeprimaireFile",
//         dbKey: "bulletin5emeprimaire",
//         deleteKey: "deleteBulletin5emeprimaire",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin6emeprimaireFile",
//         dbKey: "bulletin6emeprimaire",
//         deleteKey: "deleteBulletin6emeprimaire",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "certificatFile",
//         dbKey: "certificat",
//         deleteKey: "deleteCertificat",
//         folder: "dossiers/certificats",
//       },
//       {
//         fileKey: "bulletin1ereFile",
//         dbKey: "bulletin1ere",
//         deleteKey: "deleteBulletin1ere",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin2emeFile",
//         dbKey: "bulletin2eme",
//         deleteKey: "deleteBulletin2eme",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin3emeFile",
//         dbKey: "bulletin3eme",
//         deleteKey: "deleteBulletin3eme",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin4emeFile",
//         dbKey: "bulletin4eme",
//         deleteKey: "deleteBulletin4eme",
//         folder: "dossiers/bulletins",
//       },
//       {
//         fileKey: "bulletin5emeFile",
//         dbKey: "bulletin5eme",
//         deleteKey: "deleteBulletin5eme",
//         folder: "dossiers/bulletins",
//       },
//     ];

//     for (const { fileKey, dbKey, deleteKey, folder } of fileFields) {
//       const newFile = newFiles[fileKey];
//       const deleteFlag = deleteFlags[deleteKey];
//       const oldUrl = existingDossier[dbKey];
//       const oldPublicId = oldUrl
//         ? extractPublicIdFromCloudinaryUrl(oldUrl as string)
//         : null;

//       if (newFile) {
//         // Upload le nouveau fichier
//         try {
//           const { secure_url, public_id } = await uploadImageToCloudinary(
//             newFile,
//             folder
//           );
//           dossierToUpdate[dbKey] = secure_url;
//           newlyUploadedPublicIds.push(public_id);
//           // Supprime l'ancien fichier si un nouveau est uploadé
//           if (oldPublicId) {
//             await deleteImageFromCloudinary(oldPublicId);
//           }
//         } catch (uploadError) {
//           console.error(
//             `Erreur lors de l'upload du fichier ${String(fileKey)}:`,
//             uploadError
//           );
//           // Nettoyer les uploads précédents en cas d'erreur
//           for (const publicId of newlyUploadedPublicIds) {
//             await deleteImageFromCloudinary(publicId);
//           }
//           return {
//             error: `Échec de l'upload pour ${String(fileKey)}: ${
//               uploadError instanceof Error
//                 ? uploadError.message
//                 : String(uploadError)
//             }`,
//             success: false,
//           };
//         }
//       } else if (deleteFlag) {
//         // Supprimer le fichier existant si demandé
//         if (oldPublicId) {
//           try {
//             await deleteImageFromCloudinary(oldPublicId);
//             dossierToUpdate[dbKey] = null; // Définir le champ à NULL dans la BD
//           } catch (deleteError) {
//             return {
//               error: `Échec de la suppression du fichier existant ${String(
//                 dbKey
//               )}: ${
//                 deleteError instanceof Error
//                   ? deleteError.message
//                   : String(deleteError)
//               }`,
//               success: false,
//             };
//           }
//         } else {
//           dossierToUpdate[dbKey] = null; // Il n'y avait pas de fichier, mais l'utilisateur a coché la suppression
//         }
//       }
//     }

//     // Mise à jour du dossier dans Supabase
//     const { data, error } = await supabase
//       .from("dossiers")
//       .update(dossierToUpdate)
//       .eq("iddossier", iddossier)
//       .select()
//       .single();

//     if (error) {
//       // Si la mise à jour BD échoue, supprime les images fraîchement uploadées
//       for (const publicId of newlyUploadedPublicIds) {
//         await deleteImageFromCloudinary(publicId);
//       }
//       return {
//         error:
//           "Erreur lors de la mise à jour du dossier dans la BD : " +
//           error?.message,
//         success: false,
//       };
//     }
//     revalidatePath("/dashboard/dossiers");
//     return { data: data as Dossier, success: true };
//   } catch (err) {
//     // Gérer les exceptions inattendues
//     for (const publicId of newlyUploadedPublicIds) {
//       await deleteImageFromCloudinary(publicId);
//     }
//     return {
//       error: "Exception lors de la mise à jour du dossier : " + err,
//       success: false,
//     };
//   }
// }

// /**
//  * Supprime un dossier de la base de données et tous ses fichiers associés sur Cloudinary.
//  * @param iddossier L'ID du dossier à supprimer.
//  * @returns Un succès (pas de données retournées), ou une erreur.
//  */
// export async function deleteDossier(
//   iddossier: number
// ): Promise<{ error?: string; success: boolean }> {
//   const supabase = await createClient();
//   let publicIdsToDelete: string[] = [];

//   // 1. Récupérer les URLs de tous les fichiers du dossier avant la suppression
//   try {
//     const { data, error } = await supabase
//       .from("dossiers")
//       .select(
//         "bulletin5emeprimaire, bulletin6emeprimaire, certificat, bulletin1ere, bulletin2eme, bulletin3eme, bulletin4eme, bulletin5eme"
//       )
//       .eq("iddossier", iddossier)
//       .single();

//     if (error && error.code !== "PGRST116") {
//       console.error(
//         "Erreur lors de la récupération des URLs des fichiers du dossier pour suppression:",
//         error
//       );
//     } else if (data) {
//       const fileUrls = [
//         data.bulletin5emeprimaire,
//         data.bulletin6emeprimaire,
//         data.certificat,
//         data.bulletin1ere,
//         data.bulletin2eme,
//         data.bulletin3eme,
//         data.bulletin4eme,
//         data.bulletin5eme,
//       ];
//       publicIdsToDelete = fileUrls
//         .filter((url): url is string => typeof url === "string" && url !== null) // Filter out null/undefined values
//         .map((url) => extractPublicIdFromCloudinaryUrl(url))
//         .filter((publicId): publicId is string => publicId !== null);
//     }
//   } catch (err) {
//     console.error(
//       "Exception lors de la récupération des URLs des fichiers du dossier:",
//       err
//     );
//   }

//   // 2. Supprimer l'enregistrement du dossier dans la base de données
//   try {
//     const { error } = await supabase
//       .from("dossiers")
//       .delete()
//       .eq("iddossier", iddossier);

//     if (error) {
//       return {
//         success: false,
//         error:
//           "Erreur lors de la suppression du dossier dans la BD : " +
//           error?.message,
//       };
//     }

//     // 3. Supprimer les fichiers de Cloudinary après la suppression réussie de l'enregistrement
//     for (const publicId of publicIdsToDelete) {
//       try {
//         await deleteImageFromCloudinary(publicId);
//       } catch (fileDeleteError) {
//         console.warn(
//           `Avertissement: Le fichier avec Public ID ${publicId} n'a pas pu être supprimé de Cloudinary après la suppression du dossier:`,
//           fileDeleteError
//         );
//       }
//     }
//     revalidatePath("/dashboard/dossiers");
//     return { success: true };
//   } catch (err) {
//     return {
//       success: false,
//       error: "Exception lors de la suppression du dossier : " + err,
//     };
//   }
// }

// /**
//  * Récupère le nombre total de dossiers.
//  * @returns Le nombre total de dossiers.
//  */
// export async function getTotalDossiers(): Promise<{
//   count?: number;
//   error?: string;
//   success: boolean;
// }> {
//   try {
//     const supabase = await createClient();
//     const { count, error } = await supabase
//       .from("dossiers")
//       .select("*", { count: "exact", head: true });

//     if (error) {
//       return {
//         error: "Erreur lors du comptage des dossiers : " + error?.message,
//         success: false,
//       };
//     }

//     return { count: count || 0, success: true };
//   } catch (err) {
//     return {
//       error: "Exception lors du comptage des dossiers : " + err,
//       success: false,
//     };
//   }
// }
// actions/dossiers.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { Dossier, Eleve, Inspecteur } from "@/type"; // Importez les types nécessaires
import { Buffer } from "buffer";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
    throw err;
  }
}

function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  const regex = /\/v\d+\/(.+?)\.\w{3,4}$/;
  const match = url.match(regex);
  if (match && match[1]) {
    const parts = match[1].split("/");
    const startIndex = parts.findIndex((part) => part.match(/^v\d+$/));
    if (startIndex !== -1 && startIndex + 1 < parts.length) {
      return parts.slice(startIndex + 1).join("/");
    }
    return match[1];
  }
  return null;
}

export type BulletinFiles = {
  bulletin5emeprimaireFile?: File;
  bulletin6emeprimaireFile?: File;
  certificatFile?: File;
  bulletin1ereFile?: File;
  bulletin2emeFile?: File;
  bulletin3emeFile?: File;
  bulletin4emeFile?: File;
  bulletin5emeFile?: File;
};

export type DeleteBulletinFlags = {
  deleteBulletin5emeprimaire?: boolean;
  deleteBulletin6emeprimaire?: boolean;
  deleteCertificat?: boolean;
  deleteBulletin1ere?: boolean;
  deleteBulletin2eme?: boolean;
  deleteBulletin3eme?: boolean;
  deleteBulletin4eme?: boolean;
  deleteBulletin5eme?: boolean;
};

// Nouveau type pour les clés des champs d'images dans le dossier
type DossierImageFields =
  | "bulletin5emeprimaire"
  | "bulletin6emeprimaire"
  | "certificat"
  | "bulletin1ere"
  | "bulletin2eme"
  | "bulletin3eme"
  | "bulletin4eme"
  | "bulletin5eme";

async function uploadImageToCloudinary(
  file: File,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });

  if (uploadResult && uploadResult.secure_url && uploadResult.public_id) {
    return {
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } else {
    throw new Error(
      "Cloudinary n'a pas retourné d'URL sécurisée ou d'ID public."
    );
  }
}

export async function getDossiers(): Promise<{
  data?: (Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur })[];
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dossiers")
      .select("*, eleves(*), inspecteurs(*)")
      .order("iddossier", { ascending: true });

    if (error) {
      return {
        error:
          "Erreur lors de la récupération des dossiers : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as (Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur })[],
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération des dossiers : " + err,
      success: false,
    };
  }
}

export async function getDossierById(iddossier: number): Promise<{
  data?: Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur };
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dossiers")
      .select("*, eleves(*), inspecteurs(*)")
      .eq("iddossier", iddossier)
      .single();
    if (error) {
      if (error.code === "PGRST116") {
        return {
          error: "Dossier non trouvé.",
          success: false,
        };
      }
      return {
        error: "Erreur lors de la récupération du dossier : " + error?.message,
        success: false,
      };
    }

    return {
      data: data as Dossier & { eleves?: Eleve; inspecteurs?: Inspecteur },
      success: true,
    };
  } catch (err) {
    return {
      error: "Exception lors de la récupération du dossier : " + err,
      success: false,
    };
  }
}

export async function addDossier(
  newDossierData: Omit<Dossier, "iddossier" | DossierImageFields>, // Utilisez le type DossierImageFields
  files: BulletinFiles
): Promise<{ data?: Dossier; error?: string; success: boolean }> {
  const supabase = await createClient();
  // dossierToInsert est de type Partial<Dossier> et les propriétés seront 'string | null | undefined'
  const dossierToInsert: Partial<Dossier> = { ...newDossierData };
  const uploadedPublicIds: string[] = [];

  try {
    const fileFields: Array<{
      fileKey: keyof BulletinFiles;
      dbKey: DossierImageFields;
      folder: string;
    }> = [
      {
        fileKey: "bulletin5emeprimaireFile",
        dbKey: "bulletin5emeprimaire",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin6emeprimaireFile",
        dbKey: "bulletin6emeprimaire",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "certificatFile",
        dbKey: "certificat",
        folder: "dossiers/certificats",
      },
      {
        fileKey: "bulletin1ereFile",
        dbKey: "bulletin1ere",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin2emeFile",
        dbKey: "bulletin2eme",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin3emeFile",
        dbKey: "bulletin3eme",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin4emeFile",
        dbKey: "bulletin4eme",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin5emeFile",
        dbKey: "bulletin5eme",
        folder: "dossiers/bulletins",
      },
    ];

    for (const { fileKey, dbKey, folder } of fileFields) {
      const file = files[fileKey];
      if (file) {
        try {
          const { secure_url, public_id } = await uploadImageToCloudinary(
            file,
            folder
          );
          // Affectation maintenant correcte car dossierToInsert[dbKey] peut être string | null
          dossierToInsert[dbKey] = secure_url;
          uploadedPublicIds.push(public_id);
        } catch (uploadError) {
          console.error(
            `Erreur lors de l'upload du fichier ${String(fileKey)}:`,
            uploadError
          );
          for (const publicId of uploadedPublicIds) {
            await deleteImageFromCloudinary(publicId);
          }
          return {
            error: `Échec de l'upload pour ${String(fileKey)}: ${
              uploadError instanceof Error
                ? uploadError.message
                : String(uploadError)
            }`,
            success: false,
          };
        }
      }
    }

    const { data, error } = await supabase
      .from("dossiers")
      .insert(dossierToInsert)
      .select()
      .single();

    if (error) {
      for (const publicId of uploadedPublicIds) {
        await deleteImageFromCloudinary(publicId);
      }
      return {
        error:
          "Erreur lors de l'ajout du dossier dans la BD : " + error?.message,
        success: false,
      };
    }
    revalidatePath("/dashboard/dossiers");
    return { data: data as Dossier, success: true };
  } catch (err) {
    for (const publicId of uploadedPublicIds) {
      await deleteImageFromCloudinary(publicId);
    }
    return {
      error: "Exception lors de l'ajout du dossier : " + err,
      success: false,
    };
  }
}

export async function updateDossier(
  iddossier: number,
  updatedFields: Partial<Omit<Dossier, "iddossier" | DossierImageFields>>, // Utilisez DossierImageFields ici aussi
  newFiles: BulletinFiles,
  deleteFlags: DeleteBulletinFlags
): Promise<{ data?: Dossier; error?: string; success: boolean }> {
  const supabase = await createClient();
  const dossierToUpdate: Partial<Dossier> = { ...updatedFields };
  const newlyUploadedPublicIds: string[] = [];

  try {
    const { data: existingDossier, error: fetchError } = await supabase
      .from("dossiers")
      .select(
        "bulletin5emeprimaire, bulletin6emeprimaire, certificat, bulletin1ere, bulletin2eme, bulletin3eme, bulletin4eme, bulletin5eme"
      )
      .eq("iddossier", iddossier)
      .single();

    if (fetchError || !existingDossier) {
      return {
        error: "Dossier non trouvé ou erreur de récupération.",
        success: false,
      };
    }

    // Assurer que existingDossier est correctement typé pour l'accès
    type SelectedDossierImageFields = Pick<Dossier, DossierImageFields>;
    const typedExistingDossier: SelectedDossierImageFields = existingDossier;

    const fileFields: Array<{
      fileKey: keyof BulletinFiles;
      dbKey: DossierImageFields;
      deleteKey: keyof DeleteBulletinFlags;
      folder: string;
    }> = [
      {
        fileKey: "bulletin5emeprimaireFile",
        dbKey: "bulletin5emeprimaire",
        deleteKey: "deleteBulletin5emeprimaire",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin6emeprimaireFile",
        dbKey: "bulletin6emeprimaire",
        deleteKey: "deleteBulletin6emeprimaire",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "certificatFile",
        dbKey: "certificat",
        deleteKey: "deleteCertificat",
        folder: "dossiers/certificats",
      },
      {
        fileKey: "bulletin1ereFile",
        dbKey: "bulletin1ere",
        deleteKey: "deleteBulletin1ere",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin2emeFile",
        dbKey: "bulletin2eme",
        deleteKey: "deleteBulletin2eme",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin3emeFile",
        dbKey: "bulletin3eme",
        deleteKey: "deleteBulletin3eme",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin4emeFile",
        dbKey: "bulletin4eme",
        deleteKey: "deleteBulletin4eme",
        folder: "dossiers/bulletins",
      },
      {
        fileKey: "bulletin5emeFile",
        dbKey: "bulletin5eme",
        deleteKey: "deleteBulletin5eme",
        folder: "dossiers/bulletins",
      },
    ];

    for (const { fileKey, dbKey, deleteKey, folder } of fileFields) {
      const newFile = newFiles[fileKey];
      const deleteFlag = deleteFlags[deleteKey];

      // oldUrl est maintenant de type string | null | undefined, ce qui est compatible
      const oldUrl = typedExistingDossier[dbKey];
      const oldPublicId = oldUrl
        ? extractPublicIdFromCloudinaryUrl(oldUrl as string)
        : null;

      if (newFile) {
        try {
          const { secure_url, public_id } = await uploadImageToCloudinary(
            newFile,
            folder
          );
          dossierToUpdate[dbKey] = secure_url; // Affectation correcte
          newlyUploadedPublicIds.push(public_id);
          if (oldPublicId) {
            await deleteImageFromCloudinary(oldPublicId);
          }
        } catch (uploadError) {
          console.error(
            `Erreur lors de l'upload du fichier ${String(fileKey)}:`,
            uploadError
          );
          for (const publicId of newlyUploadedPublicIds) {
            await deleteImageFromCloudinary(publicId);
          }
          return {
            error: `Échec de l'upload pour ${String(fileKey)}: ${
              uploadError instanceof Error
                ? uploadError.message
                : String(uploadError)
            }`,
            success: false,
          };
        }
      } else if (deleteFlag) {
        if (oldPublicId) {
          try {
            await deleteImageFromCloudinary(oldPublicId);
            dossierToUpdate[dbKey] = null; // Affectation correcte
          } catch (deleteError) {
            return {
              error: `Échec de la suppression du fichier existant ${String(
                dbKey
              )}: ${
                deleteError instanceof Error
                  ? deleteError.message
                  : String(deleteError)
              }`,
              success: false,
            };
          }
        } else {
          dossierToUpdate[dbKey] = null; // Affectation correcte
        }
      }
    }

    const { data, error } = await supabase
      .from("dossiers")
      .update(dossierToUpdate)
      .eq("iddossier", iddossier)
      .select()
      .single();

    if (error) {
      for (const publicId of newlyUploadedPublicIds) {
        await deleteImageFromCloudinary(publicId);
      }
      return {
        error:
          "Erreur lors de la mise à jour du dossier dans la BD : " +
          error?.message,
        success: false,
      };
    }
    revalidatePath("/dashboard/dossiers");
    return { data: data as Dossier, success: true };
  } catch (err) {
    for (const publicId of newlyUploadedPublicIds) {
      await deleteImageFromCloudinary(publicId);
    }
    return {
      error: "Exception lors de la mise à jour du dossier : " + err,
      success: false,
    };
  }
}

export async function deleteDossier(
  iddossier: number
): Promise<{ error?: string; success: boolean }> {
  const supabase = await createClient();
  let publicIdsToDelete: string[] = [];

  try {
    const { data, error } = await supabase
      .from("dossiers")
      .select(
        "bulletin5emeprimaire, bulletin6emeprimaire, certificat, bulletin1ere, bulletin2eme, bulletin3eme, bulletin4eme, bulletin5eme"
      )
      .eq("iddossier", iddossier)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(
        "Erreur lors de la récupération des URLs des fichiers du dossier pour suppression:",
        error
      );
    } else if (data) {
      const fileUrls = [
        data.bulletin5emeprimaire,
        data.bulletin6emeprimaire,
        data.certificat,
        data.bulletin1ere,
        data.bulletin2eme,
        data.bulletin3eme,
        data.bulletin4eme,
        data.bulletin5eme,
      ];
      publicIdsToDelete = fileUrls
        .filter((url): url is string => typeof url === "string" && url !== null)
        .map((url) => extractPublicIdFromCloudinaryUrl(url))
        .filter((publicId): publicId is string => publicId !== null);
    }
  } catch (err) {
    console.error(
      "Exception lors de la récupération des URLs des fichiers du dossier:",
      err
    );
  }

  try {
    const { error } = await supabase
      .from("dossiers")
      .delete()
      .eq("iddossier", iddossier);

    if (error) {
      return {
        success: false,
        error:
          "Erreur lors de la suppression du dossier dans la BD : " +
          error?.message,
      };
    }

    for (const publicId of publicIdsToDelete) {
      try {
        await deleteImageFromCloudinary(publicId);
      } catch (fileDeleteError) {
        console.warn(
          `Avertissement: Le fichier avec Public ID ${publicId} n'a pas pu être supprimé de Cloudinary après la suppression du dossier:`,
          fileDeleteError
        );
      }
    }
    revalidatePath("/dashboard/dossiers");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Exception lors de la suppression du dossier : " + err,
    };
  }
}

export async function getTotalDossiers(): Promise<{
  count?: number;
  error?: string;
  success: boolean;
}> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("dossiers")
      .select("*", { count: "exact", head: true });

    if (error) {
      return {
        error: "Erreur lors du comptage des dossiers : " + error?.message,
        success: false,
      };
    }

    return { count: count || 0, success: true };
  } catch (err) {
    return {
      error: "Exception lors du comptage des dossiers : " + err,
      success: false,
    };
  }
}

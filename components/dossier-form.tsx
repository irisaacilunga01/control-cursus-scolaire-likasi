// components/dossier-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  addDossier,
  BulletinFiles,
  DeleteBulletinFlags,
  updateDossier,
} from "@/app/actions/dossiers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dossier, Eleve, Inspecteur } from "@/type"; // Importez les types Dossier, Eleve, Inspecteur
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";

// Schéma de validation pour les données du dossier
const dossierFormSchema = z.object({
  matricule: z.string().optional(),
  etat: z.string().optional(), // Champ 'etat' pour le texte
  idinspecteur: z.coerce.number().optional(),
  ideleve: z.coerce.number().optional(),
  // Champs de fichiers pour les bulletins/certificat
  bulletin5emeprimaireFile: z.instanceof(File).optional(),
  bulletin6emeprimaireFile: z.instanceof(File).optional(),
  certificatFile: z.instanceof(File).optional(),
  bulletin1ereFile: z.instanceof(File).optional(),
  bulletin2emeFile: z.instanceof(File).optional(),
  bulletin3emeFile: z.instanceof(File).optional(),
  bulletin4emeFile: z.instanceof(File).optional(),
  bulletin5emeFile: z.instanceof(File).optional(),

  // Champs pour la suppression des fichiers existants
  deleteBulletin5emeprimaire: z.boolean().optional(),
  deleteBulletin6emeprimaire: z.boolean().optional(),
  deleteCertificat: z.boolean().optional(),
  deleteBulletin1ere: z.boolean().optional(),
  deleteBulletin2eme: z.boolean().optional(),
  deleteBulletin3eme: z.boolean().optional(),
  deleteBulletin4eme: z.boolean().optional(),
  deleteBulletin5eme: z.boolean().optional(),
});

type DossierFormValues = z.infer<typeof dossierFormSchema>;

interface DossierFormProps {
  initialData?: Dossier; // Pour l'édition, contient les données existantes
  eleves: Eleve[]; // Liste des élèves pour le sélecteur
  inspecteurs: Inspecteur[]; // Liste des inspecteurs pour le sélecteur
}

export function DossierForm({
  initialData,
  eleves,
  inspecteurs,
}: DossierFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // États pour les prévisualisations d'images
  const [bulletin5emePrimairePreview, setBulletin5emePrimairePreview] =
    useState<string | null>(initialData?.bulletin5emeprimaire || null);
  const [bulletin6emePrimairePreview, setBulletin6emePrimairePreview] =
    useState<string | null>(initialData?.bulletin6emeprimaire || null);
  const [certificatPreview, setCertificatPreview] = useState<string | null>(
    initialData?.certificat || null
  );
  const [bulletin1erePreview, setBulletin1erePreview] = useState<string | null>(
    initialData?.bulletin1ere || null
  );
  const [bulletin2emePreview, setBulletin2emePreview] = useState<string | null>(
    initialData?.bulletin2eme || null
  );
  const [bulletin3emePreview, setBulletin3emePreview] = useState<string | null>(
    initialData?.bulletin3eme || null
  );
  const [bulletin4emePreview, setBulletin4emePreview] = useState<string | null>(
    initialData?.bulletin4eme || null
  );
  const [bulletin5emePreview, setBulletin5emePreview] = useState<string | null>(
    initialData?.bulletin5eme || null
  );

  const form = useForm<DossierFormValues>({
    resolver: zodResolver(dossierFormSchema),
    defaultValues: {
      matricule: initialData?.matricule || "",
      etat: initialData?.etat || "incomplet",
      idinspecteur: Number(initialData?.idinspecteur),
      ideleve: Number(initialData?.ideleve),

      // Initialiser les champs de fichiers à undefined
      bulletin5emeprimaireFile: undefined,
      bulletin6emeprimaireFile: undefined,
      certificatFile: undefined,
      bulletin1ereFile: undefined,
      bulletin2emeFile: undefined,
      bulletin3emeFile: undefined,
      bulletin4emeFile: undefined,
      bulletin5emeFile: undefined,

      // Initialiser les drapeaux de suppression à false
      deleteBulletin5emeprimaire: false,
      deleteBulletin6emeprimaire: false,
      deleteCertificat: false,
      deleteBulletin1ere: false,
      deleteBulletin2eme: false,
      deleteBulletin3eme: false,
      deleteBulletin4eme: false,
      deleteBulletin5eme: false,
    },
  });

  // Fonction générique pour gérer les changements de fichier d'image
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof BulletinFiles,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    deleteCheckboxName: keyof DeleteBulletinFlags
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
      form.setValue(deleteCheckboxName, false); // Désélectionner si un nouveau fichier est sélectionné
    } else {
      form.setValue(fieldName, undefined);
      // Ne pas effacer la prévisualisation ici, la suppression sera gérée par la checkbox
    }
  };

  // Fonction générique pour gérer les changements de checkbox de suppression
  const handleDeleteCheckboxChange = (
    checked: boolean,
    deleteCheckboxName: keyof DeleteBulletinFlags,
    fieldName: keyof BulletinFiles,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    initialPhotoUrl: string | null | undefined
  ) => {
    form.setValue(deleteCheckboxName, checked);
    if (checked) {
      setPreview(null); // Effacer la prévisualisation si l'utilisateur veut supprimer
      form.setValue(fieldName, undefined); // Assurez-vous qu'aucun nouveau fichier n'est en attente
    } else {
      // Si la case est décochée, restaurer la prévisualisation si initialData a une photo
      setPreview(initialPhotoUrl || null);
    }
  };

  async function onSubmit(values: DossierFormValues) {
    setLoading(true);
    try {
      const {
        // Séparer les fichiers et les drapeaux de suppression des autres données
        bulletin5emeprimaireFile,
        bulletin6emeprimaireFile,
        certificatFile,
        bulletin1ereFile,
        bulletin2emeFile,
        bulletin3emeFile,
        bulletin4emeFile,
        bulletin5emeFile,
        deleteBulletin5emeprimaire,
        deleteBulletin6emeprimaire,
        deleteCertificat,
        deleteBulletin1ere,
        deleteBulletin2eme,
        deleteBulletin3eme,
        deleteBulletin4eme,
        deleteBulletin5eme,
        ...dataToSave // Le reste des champs du formulaire
      } = values;

      // Nettoyer les champs optionnels vides ou marqueurs "null" avant d'envoyer à Supabase
      Object.keys(dataToSave).forEach((key) => {
        // Vérifie si la valeur est une chaîne vide pour les champs qui acceptent string | null
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof (dataToSave as any)[key] === "string" &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] === ""
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] = null;
        }
        // Gérer spécifiquement les IDs qui viennent de Zod transformés en number | null
        if (
          key === "idinspecteur" &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] === "null_inspecteur_id"
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] = null;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (key === "ideleve" && (dataToSave as any)[key] === "null_eleve_id") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] = null;
        }
      });

      const filesToUpload: BulletinFiles = {
        bulletin5emeprimaireFile,
        bulletin6emeprimaireFile,
        certificatFile,
        bulletin1ereFile,
        bulletin2emeFile,
        bulletin3emeFile,
        bulletin4emeFile,
        bulletin5emeFile,
      };

      const flagsToDelete: DeleteBulletinFlags = {
        deleteBulletin5emeprimaire,
        deleteBulletin6emeprimaire,
        deleteCertificat,
        deleteBulletin1ere,
        deleteBulletin2eme,
        deleteBulletin3eme,
        deleteBulletin4eme,
        deleteBulletin5eme,
      };

      let result;

      if (initialData) {
        result = await updateDossier(
          initialData.iddossier,
          dataToSave as Partial<
            Omit<
              Dossier,
              | "iddossier"
              | "bulletin5emeprimaire"
              | "bulletin6emeprimaire"
              | "certificat"
              | "bulletin1ere"
              | "bulletin2eme"
              | "bulletin3eme"
              | "bulletin4eme"
              | "bulletin5eme"
            >
          >,
          filesToUpload,
          flagsToDelete
        );
      } else {
        result = await addDossier(
          dataToSave as Omit<
            Dossier,
            | "iddossier"
            | "bulletin5emeprimaire"
            | "bulletin6emeprimaire"
            | "certificat"
            | "bulletin1ere"
            | "bulletin2eme"
            | "bulletin3eme"
            | "bulletin4eme"
            | "bulletin5eme"
          >,
          filesToUpload
        );
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Dossier mis à jour avec succès !"
            : "Dossier ajouté avec succès !",
        });

        router.push("/dashboard/dossiers"); // Redirige vers la liste des dossiers
        router.refresh(); // Rafraîchit les données
      } else {
        setLoading(false);
        toast.error(`Erreur ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: result.error || "Une erreur est survenue.",
        });
      }
    } catch (error) {
      toast.error("Erreur opération !!!", {
        description: "Erreur inattendue lors de l'opération. & " + error,
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="matricule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matricule (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Matricule de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="etat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>État du Dossier (Optionnel)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un état" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="incomplet">Incomplet</SelectItem>
                  <SelectItem value="complet">Complet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ideleve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Élève Associé (Optionnel)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null_eleve_id"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un élève" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null_eleve_id">Non spécifié</SelectItem>
                  {eleves.map((eleve) => (
                    <SelectItem
                      key={eleve.ideleve}
                      value={String(eleve.ideleve)}
                    >
                      {eleve.nom} {eleve.postnom} {eleve.prenom || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idinspecteur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inspecteur Associé (Optionnel)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : "null"
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un inspecteur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Non spécifié</SelectItem>
                  {inspecteurs.map((inspecteur) => (
                    <SelectItem
                      key={inspecteur.idinspecteur}
                      value={String(inspecteur.idinspecteur)}
                    >
                      {inspecteur.nom} {inspecteur.postnom}{" "}
                      {inspecteur.prenom || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champs pour les bulletins et certificat */}
        {[
          {
            name: "bulletin5emeprimaire",
            fileKey: "bulletin5emeprimaireFile",
            deleteKey: "deleteBulletin5emeprimaire",
            preview: bulletin5emePrimairePreview,
            setPreview: setBulletin5emePrimairePreview,
            label: "Bulletin 5ème Primaire",
          },
          {
            name: "bulletin6emeprimaire",
            fileKey: "bulletin6emeprimaireFile",
            deleteKey: "deleteBulletin6emeprimaire",
            preview: bulletin6emePrimairePreview,
            setPreview: setBulletin6emePrimairePreview,
            label: "Bulletin 6ème Primaire",
          },
          {
            name: "certificat",
            fileKey: "certificatFile",
            deleteKey: "deleteCertificat",
            preview: certificatPreview,
            setPreview: setCertificatPreview,
            label: "Certificat",
          },
          {
            name: "bulletin1ere",
            fileKey: "bulletin1ereFile",
            deleteKey: "deleteBulletin1ere",
            preview: bulletin1erePreview,
            setPreview: setBulletin1erePreview,
            label: "Bulletin 1ère",
          },
          {
            name: "bulletin2eme",
            fileKey: "bulletin2emeFile",
            deleteKey: "deleteBulletin2eme",
            preview: bulletin2emePreview,
            setPreview: setBulletin2emePreview,
            label: "Bulletin 2ème",
          },
          {
            name: "bulletin3eme",
            fileKey: "bulletin3emeFile",
            deleteKey: "deleteBulletin3eme",
            preview: bulletin3emePreview,
            setPreview: setBulletin3emePreview,
            label: "Bulletin 3ème",
          },
          {
            name: "bulletin4eme",
            fileKey: "bulletin4emeFile",
            deleteKey: "deleteBulletin4eme",
            preview: bulletin4emePreview,
            setPreview: setBulletin4emePreview,
            label: "Bulletin 4ème",
          },
          {
            name: "bulletin5eme",
            fileKey: "bulletin5emeFile",
            deleteKey: "deleteBulletin5eme",
            preview: bulletin5emePreview,
            setPreview: setBulletin5emePreview,
            label: "Bulletin 5ème",
          },
        ].map((fieldProps) => (
          <React.Fragment key={fieldProps.name}>
            <FormItem>
              <FormLabel>{fieldProps.label} (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      fieldProps.fileKey as keyof BulletinFiles,
                      fieldProps.setPreview,
                      fieldProps.deleteKey as keyof DeleteBulletinFlags
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {fieldProps.preview && (
              <div className="relative w-32 h-32 rounded-md overflow-hidden">
                <Image
                  src={fieldProps.preview}
                  alt={`Prévisualisation ${fieldProps.label}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                  priority
                />
              </div>
            )}

            {initialData?.[fieldProps.name as keyof Dossier] &&
              !form.getValues(
                fieldProps.fileKey as keyof DossierFormValues
              ) && (
                <FormField
                  control={form.control}
                  name={fieldProps.deleteKey as keyof DossierFormValues}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={(checked: boolean) =>
                            handleDeleteCheckboxChange(
                              checked,
                              fieldProps.deleteKey as keyof DeleteBulletinFlags,
                              fieldProps.fileKey as keyof BulletinFiles,
                              fieldProps.setPreview,
                              initialData[fieldProps.name as keyof Dossier] as
                                | string
                                | null
                                | undefined
                            )
                          }
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Supprimer {fieldProps.label} existant
                        </FormLabel>
                        <FormDescription>
                          Cochez cette case pour supprimer le fichier actuel.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}
          </React.Fragment>
        ))}

        <div className="md:col-span-2 flex justify-end">
          {loading ? (
            <Button size="sm" className="w-40 " disabled>
              <Loader2Icon className="animate-spin mr-2" />
              {!initialData ? "Ajout..." : "Modification..."}
            </Button>
          ) : (
            <Button type="submit" className="w-40 ">
              {initialData ? "Mettre à jour" : "Ajouter"}
              {initialData ? <IconPencil /> : <IconPlus />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

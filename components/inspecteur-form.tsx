"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addInspecteur, updateInspecteur } from "@/app/actions/inspecteurs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Pour le champ status
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
import { Inspecteur } from "@/type"; // Importez Eleve et Parent
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";

// Schéma de validation pour les données de l'élève
const inpecteurFormSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom est requis et doit contenir au moins 2 caractères.",
  }),
  postnom: z.string().min(2, {
    message: "Le postnom est requis et doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().optional(),
  matricule: z.string().optional(),
  telephone: z.string().optional(),
  poste_attache: z.string().optional(),
  zone: z.string().optional(),
  photoFile: z.instanceof(File).optional(), // Pour le nouvel upload de fichier
  deleteExistingPhoto: z.boolean().optional(), // Pour indiquer si la photo existante doit être supprimée
});

type InspecteurFormValues = z.infer<typeof inpecteurFormSchema>;

interface InspecteurFormProps {
  initialData?: Inspecteur;
}

export function InspecteurForm({ initialData }: InspecteurFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo || null
  );

  const form = useForm<InspecteurFormValues>({
    resolver: zodResolver(inpecteurFormSchema),
    defaultValues: {
      nom: initialData?.nom || "",
      postnom: initialData?.postnom || "",
      prenom: initialData?.prenom || "",
      matricule: initialData?.matricule || "",
      telephone: initialData?.telephone || "",
      poste_attache: initialData?.poste_attache || "",
      zone: initialData?.zone || "",
      photoFile: undefined, // Initialisé à undefined
      deleteExistingPhoto: false, // Par défaut, ne pas supprimer la photo
    },
  });

  // Gérer la prévisualisation de l'image
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("photoFile", file); // Mettre à jour le champ photoFile dans le formulaire
      setPhotoPreview(URL.createObjectURL(file));
      form.setValue("deleteExistingPhoto", false); // Désélectionner si un nouveau fichier est sélectionné
    } else {
      form.setValue("photoFile", undefined);
      // Ne pas effacer la prévisualisation si l'utilisateur annule, car il peut y avoir une photo existante
      // Si l'utilisateur clique sur "supprimer", la prévisualisation sera gérée par ce champ
    }
  };

  const handleDeletePhotoCheckboxChange = (checked: boolean) => {
    form.setValue("deleteExistingPhoto", checked);
    if (checked) {
      setPhotoPreview(null); // Effacer la prévisualisation si l'utilisateur veut supprimer
      form.setValue("photoFile", undefined); // Assurez-vous qu'aucun nouveau fichier n'est en attente
    } else {
      // Si la case est décochée, restaurer la prévisualisation si initialData a une photo
      setPhotoPreview(initialData?.photo || null);
    }
  };

  async function onSubmit(values: InspecteurFormValues) {
    setLoading(true);
    try {
      let result;
      const { photoFile, deleteExistingPhoto, ...dataToSave } = values; // Sépare photoFile et deleteExistingPhoto

      // Supprime les champs optionnels vides avant d'envoyer à Supabase
      Object.keys(dataToSave).forEach((key) => {
        if (dataToSave[key as keyof typeof dataToSave] === "") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] = null;
        }
      });

      if (initialData) {
        // Mode édition
        result = await updateInspecteur(
          initialData.idinspecteur,
          dataToSave as Partial<Omit<Inspecteur, "idinspecteur" | "photo">>,
          photoFile,
          deleteExistingPhoto
        );
      } else {
        // Mode ajout
        result = await addInspecteur(
          dataToSave as Omit<Inspecteur, "idinspecteur" | "photo">,
          photoFile
        );
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? "Inspecteur mis à jour avec succès !"
            : "Inspecteur ajouté avec succès !",
        });

        router.push("/dashboard/inspecteurs"); // Redirige vers la liste des élèves après succès
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
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postnom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postnom</FormLabel>
              <FormControl>
                <Input placeholder="Postnom de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prenom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Prénom de l'élève" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="matricule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matricule (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="matricule de l'inspecteur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  placeholder="telephone de l'inspecteur"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="poste_attache"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poste attaché (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  placeholder="poste attaché de l'inspecteur"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  placeholder="zone  de l'inspecteur"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ d'upload de photo */}
        <FormItem>
          <FormLabel>Photo (Optionnel)</FormLabel>
          <FormControl>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
          </FormControl>
          <FormMessage />
        </FormItem>

        {photoPreview && (
          <div className="relative w-32 h-32 rounded-md overflow-hidden">
            <Image
              src={photoPreview}
              alt="Prévisualisation de la photo"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
              priority // Pour optimiser le chargement de l'image de prévisualisation
            />
          </div>
        )}

        {/* Option pour supprimer la photo existante (uniquement en mode édition) */}
        {initialData?.photo && !form.getValues("photoFile") && (
          <FormField
            control={form.control}
            name="deleteExistingPhoto"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={handleDeletePhotoCheckboxChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Supprimer la photo existante</FormLabel>
                  <FormDescription>
                    Cochez cette case pour supprimer la photo actuelle.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

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

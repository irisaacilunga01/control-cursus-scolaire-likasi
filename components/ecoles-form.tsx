// components/ecoles-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Utilisation de Input pour les champs de texte
import { Ecole } from "@/type"; // Importe le type Ecole
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { addEcole, updateEcole } from "@/app/actions/ecoles";

// Schéma de validation pour les données de l'école
const ecoleFormSchema = z.object({
  nomecole: z.string().min(2, {
    message:
      "Le nom de l'école est requis et doit contenir au moins 2 caractères.",
  }),
  abreviation: z.string().min(1, {
    message: "L'abréviation est requise.",
  }),
  adresse: z.string().optional(),
  email: z
    .string()
    .email({ message: "Email invalide." })
    .optional()
    .or(z.literal("")),
  telephone: z.string().optional(),
  codeecole: z.string().optional(),
});

type EcoleFormValues = z.infer<typeof ecoleFormSchema>;

interface EcoleFormProps {
  initialData?: Ecole; // Pour l'édition, contient les données existantes
  // La prop 'parents' n'est plus nécessaire ici
}

export function EcoleForm({ initialData }: EcoleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<EcoleFormValues>({
    resolver: zodResolver(ecoleFormSchema),
    defaultValues: {
      nomecole: initialData?.nomecole || "",
      abreviation: initialData?.abreviation || "",
      adresse: initialData?.adresse || "",
      email: initialData?.email || "",
      telephone: initialData?.telephone || "",
      codeecole: initialData?.codeecole || "",
    },
  });

  async function onSubmit(data: EcoleFormValues) {
    setLoading(true);
    try {
      let result;
      // Nettoie les champs de chaîne vides en `null` pour Supabase
      const dataToSave = { ...data };
      Object.keys(dataToSave).forEach((key) => {
        if (
          typeof dataToSave[key as keyof typeof dataToSave] === "string" &&
          (dataToSave[key as keyof typeof dataToSave] as string).trim() === ""
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (dataToSave as any)[key] = null;
        }
      });

      if (initialData) {
        // Mode édition
        result = await updateEcole(initialData.idecole, dataToSave);
      } else {
        // Mode ajout
        result = await addEcole(dataToSave);
      }

      if (result.success) {
        toast.success(`Succès ${initialData ? "de mise à jour" : "d'ajout"}`, {
          description: initialData
            ? `L'école ${data.nomecole} a été mise à jour avec succès !`
            : `L'école ${data.nomecole} a été ajoutée avec succès !`,
        });

        router.push("/dashboard/ecoles"); // Redirige vers la liste des écoles après succès
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
        className="grid gap-4 grid-cols-1 md:grid-cols-2 p-4"
      >
        <FormField
          control={form.control}
          name="nomecole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;École</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Lycée Uzima" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abreviation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abréviation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: LUZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123 Rue Principale, Ville" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  {...field}
                />
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
                  type="tel"
                  placeholder="Ex: +243 999 123 456"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codeecole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code École (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: EPST001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

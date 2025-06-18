// app/dossiers/columns.tsx
"use client";

import { deleteDossier } from "@/app/actions/dossiers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalize } from "@/lib/utils"; // Assurez-vous que cette fonction existe ou adaptez-la
import { Dossier, Eleve, Inspecteur } from "@/type"; // Importez tous les types nécessaires
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

// Définition d'un type étendu pour les données affichées dans la table des dossiers
type DossierDisplay = Dossier & {
  eleves?: Eleve;
  inspecteurs?: Inspecteur;
};

// Composant utilitaire pour afficher les images des bulletins/certificats
function ImageCell({ url, altText }: { url?: string | null; altText: string }) {
  return (
    <Avatar className="h-12 w-12 rounded-md">
      {/* Utiliser des coins arrondis */}
      <AvatarImage
        src={url || undefined}
        alt={altText}
        className="object-cover rounded-md" // Assurez-vous que l'image est aussi arrondie
      />
      <AvatarFallback className="rounded-md">
        {/* Assurez-vous que le fallback est aussi arrondi */}
        {altText.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

// Composant Client pour gérer les actions d'édition et de suppression d'un dossier
function DossierActionsCell({ dossier }: { dossier: DossierDisplay }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteDossier(dossier.iddossier);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Le dossier de ${
          dossier?.eleves?.nom || "l'élève"
        } a été supprimé avec succès !`,
      });
      setOpen(false); // Fermer le Dialog
      setLoading(false); // Remettre à false
      router.refresh(); // Rafraîchir les données après suppression pour que la liste se mette à jour
    } else {
      toast.error("Erreur de suppression !!!", {
        description:
          result.error || "Erreur lors de la suppression du dossier.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex gap-3"
              href={`/dashboard/dossiers/${dossier.iddossier}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600 p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4" />
            <p>
              modifier le dossier de{" "}
              {dossier?.eleves?.nom
                ? capitalize(dossier.eleves.nom)
                : "l'élève"}
              {dossier?.eleves?.postnom
                ? ` ${capitalize(dossier.eleves.postnom)}`
                : ""}
              {dossier?.eleves?.prenom
                ? ` ${capitalize(dossier.eleves.prenom)}`
                : ""}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <IconTrash className="h-8 w-8 rounded-full text-white bg-destructive hover:bg-destructive/70 p-2 cursor-pointer" />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="flex gap-2 justify-center items-center">
              <IconTrash className="h-4 w-4" />
              <p>
                supprimer le dossier de{" "}
                {dossier?.eleves?.nom
                  ? capitalize(dossier.eleves.nom)
                  : "l'élève"}
                {dossier?.eleves?.postnom
                  ? ` ${capitalize(dossier.eleves.postnom)}`
                  : ""}
                {dossier?.eleves?.prenom
                  ? ` ${capitalize(dossier.eleves.prenom)}`
                  : ""}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suppression du dossier</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le dossier de l&apos;élève{" "}
              {dossier?.eleves?.nom ? capitalize(dossier.eleves.nom) : ""}
              {dossier?.eleves?.postnom
                ? ` ${capitalize(dossier.eleves.postnom)}`
                : ""}
              {dossier?.eleves?.prenom
                ? ` ${capitalize(dossier.eleves.prenom)}`
                : ""}
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Annuler
              </Button>
            </DialogClose>

            {loading ? (
              <Button size="sm" variant="destructive" disabled>
                <Loader2Icon className="animate-spin mr-2" />
                Suppression...
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDelete}>
                Confirmer
                <IconTrash className="ml-2" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Définition des colonnes pour la table des dossiers
export const columns: ColumnDef<DossierDisplay>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => {
      const eleve = row.original.eleves;

      return (
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={eleve?.photo || undefined}
            alt={`Photo de ${eleve?.nom}`}
            className="object-cover"
          />
          <AvatarFallback>
            {eleve?.nom
              ? eleve?.nom.charAt(0)
              : eleve?.prenom
              ? eleve?.prenom.charAt(0)
              : "EL"}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "eleve_name",
    accessorFn: (row) => {
      const eleve = row.eleves;
      return `${eleve?.nom?.toLowerCase() ?? ""} ${
        eleve?.postnom?.toLowerCase() ?? ""
      } ${eleve?.prenom?.toLowerCase() ?? ""}`;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Élève
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const eleve = row.original.eleves;
      return eleve
        ? `${capitalize(eleve.nom || "")} ${capitalize(
            eleve.postnom || ""
          )} ${capitalize(eleve.prenom || "")}`.trim()
        : "N/A";
    },
  },
  {
    accessorKey: "matricule",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Matricule
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "inspecteur_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inspecteur
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const inspecteur = row.original.inspecteurs;
      return inspecteur
        ? `${capitalize(inspecteur.nom || "")} ${capitalize(
            inspecteur.postnom || ""
          )} ${capitalize(inspecteur.prenom || "")}`.trim()
        : "N/A";
    },
  },
  {
    accessorKey: "etat",
    header: "État",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`text-muted-foreground px-1.5 ${
          row.original?.etat === "complet"
            ? "bg-blue-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {row.original.etat}
      </Badge>
    ),
  },
  {
    accessorKey: "bulletin5emeprimaire",
    header: "B. 5e P.",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin5emeprimaire}
                altText="Bulletin 5e Primaire"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin5emeprimaire ? (
              <Link target="_blank" href={row.original.bulletin5emeprimaire}>
                <Image
                  src={row.original.bulletin5emeprimaire}
                  alt="Bulletin 5e Primaire"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "bulletin6emeprimaire",
    header: "B. 6e P.",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin6emeprimaire}
                altText="Bulletin 6e Primaire"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin6emeprimaire ? (
              <Link target="_blank" href={row.original.bulletin6emeprimaire}>
                <Image
                  src={row.original.bulletin6emeprimaire}
                  alt="Bulletin 6e Primaire"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "certificat",
    header: "Certificat",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell url={row.original.certificat} altText="Certificat" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.certificat ? (
              <Link target="_blank" href={row.original.certificat}>
                <Image
                  src={row.original.certificat}
                  alt="Certificat"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "bulletin1ere",
    header: "B. 1ère",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin1ere}
                altText="Bulletin 1ère"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin1ere ? (
              <Link target="_blank" href={row.original.bulletin1ere}>
                <Image
                  src={row.original.bulletin1ere}
                  alt="Bulletin 1ère"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "bulletin2eme",
    header: "B. 2ème",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin2eme}
                altText="Bulletin 2ème"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin2eme ? (
              <Link target="_blank" href={row.original.bulletin2eme}>
                <Image
                  src={row.original.bulletin2eme}
                  alt="Bulletin 2ème"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "bulletin3eme",
    header: "B. 3ème",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin3eme}
                altText="Bulletin 3ème"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin3eme ? (
              <Link target="_blank" href={row.original.bulletin3eme}>
                <Image
                  src={row.original.bulletin3eme}
                  alt="Bulletin 3ème"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "bulletin4eme",
    header: "B. 4ème",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin4eme}
                altText="Bulletin 4ème"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin4eme ? (
              <Link target="_blank" href={row.original.bulletin4eme}>
                <Image
                  src={row.original.bulletin4eme}
                  alt="Bulletin 4ème"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "bulletin5eme",
    header: "B. 5ème",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ImageCell
                url={row.original.bulletin5eme}
                altText="Bulletin 5ème"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-1">
            {row.original.bulletin5eme ? (
              <Link target="_blank" href={row.original.bulletin5eme}>
                <Image
                  src={row.original.bulletin5eme}
                  alt="Bulletin 5ème"
                  className="h-24 w-auto object-contain"
                  width={320}
                  height={320}
                />
              </Link>
            ) : (
              "Aucun fichier"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <DossierActionsCell dossier={row.original} />,
  },
];

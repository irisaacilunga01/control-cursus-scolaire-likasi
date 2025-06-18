// app/eleve/columns.tsx
"use client";

import { deleteInspecteur } from "@/app/actions/inspecteurs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assurez-vous que vous avez ces composants Shadcn UI
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
import { capitalize } from "@/lib/utils";
import { Inspecteur } from "@/type"; // Assurez-vous que ce chemin est correct
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

// Composant Client pour gérer les actions d'édition et de suppression
function InspecteurActionsCell({ inspecteur }: { inspecteur: Inspecteur }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteInspecteur(inspecteur?.idinspecteur);
    if (result.success) {
      toast.success("Suppression réussie !!!", {
        description: `Inspecteur ${
          inspecteur?.nom + " " + inspecteur?.postnom + " " + inspecteur?.prenom
        } supprimé avec succès !`,
      });
      setOpen(false); // ✅ fermer le Dialog
      setLoading(false); // ✅ remettre à false avant de rediriger
      setTimeout(() => {
        window.location.reload(); // force le rechargement complet de la page
      }, 200);
    } else {
      toast.error("Erreur de  suppression !!!", {
        description:
          result.error || "Erreur lors de la suppression de l'inscription.",
      });
      setLoading(false); // ✅ dans tous les cas
    }
  };
  return (
    <div className="flex gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex gap-3"
              href={`/dashboard/inspecteurs/${inspecteur.idinspecteur}/edit`}
            >
              <IconPencil className="h-8 w-8 rounded-full text-white bg-green-500 hover:bg-green-600  p-2" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex gap-2 justify-center items-center">
            <IconPencil className="h-4 w-4 rounded-full" />
            <p>
              modifier l&apos;inspecteur $
              {inspecteur?.nom +
                " " +
                inspecteur?.postnom +
                " " +
                inspecteur?.prenom}
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
            <TooltipContent className="flex gap-2 justify-center items-center ">
              <IconTrash className="h-4 w-4 rounded-full" />
              <p>
                supprimer l&apos;inspecteur
                {inspecteur?.nom +
                  " " +
                  inspecteur?.postnom +
                  " " +
                  inspecteur?.prenom}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Suppression inspecteur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;élève $
              {inspecteur?.nom +
                " " +
                inspecteur?.postnom +
                " " +
                inspecteur?.prenom}{" "}
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fermer
              </Button>
            </DialogClose>

            {loading ? (
              <Button size="sm" variant="destructive" disabled>
                <Loader2Icon className="animate-spin mr-2" />
                Supression...
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDelete}>
                Confirmer
                <IconTrash />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const columns: ColumnDef<Inspecteur>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => {
      const photoUrl = row.original.photo;
      const nom = row.original.nom;
      const prenom = row.original.prenom;

      return (
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={photoUrl || undefined}
            alt={`Photo de ${nom}`}
            className="object-cover"
          />
          <AvatarFallback>
            {nom ? nom.charAt(0) : prenom ? prenom.charAt(0) : "EL"}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "fullname",
    accessorFn: (row) =>
      `${row.nom?.toLowerCase() ?? ""} ${row.postnom?.toLowerCase() ?? ""} ${
        row.prenom?.toLowerCase() ?? ""
      }`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom Complet
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      capitalize(row.original.nom) +
      " " +
      capitalize(row.original.postnom) +
      " " +
      capitalize(row.original.prenom!),
    enableHiding: false, // pour éviter de le masquer
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
    accessorKey: "telephone",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Téléphone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "poste_attache",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Poste attaché
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "zone",
    header: "Zone",
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false, // pour éviter de le masquer

    cell: ({ row }) => <InspecteurActionsCell inspecteur={row.original} />,
  },
];

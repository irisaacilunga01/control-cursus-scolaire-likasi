// components/dashboard-recent-activity.tsx
"use client";

import { Annee_scolaire, Classe, Eleve, Inscription, Option } from "@/type"; // Importe les types nécessaires
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Définition du type d'affichage pour les inscriptions dans le tableau
type InscriptionDisplayForDashboard = Inscription & {
  eleves?: Eleve;
  classes?: Classe & { options?: Option };
  annee_scolaires?: Annee_scolaire;
};

// Définition des colonnes pour le tableau des inscriptions récentes
export const recentInscriptionsColumns: ColumnDef<InscriptionDisplayForDashboard>[] =
  [
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
      header: "Élève",
      cell: ({ row }) => {
        const eleve = row.original.eleves;
        return eleve
          ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom || ""}`.trim()
          : "N/A";
      },
    },
    {
      id: "classe_info",
      header: "Classe",
      cell: ({ row }) => {
        const classe = row.original.classes;
        if (classe) {
          return (
            <span>
              {classe.nom} {classe.niveau ? `(${classe.niveau})` : ""}{" "}
              {classe.options?.abreviation
                ? ` (${classe.options.abreviation})`
                : ""}
            </span>
          );
        }
        return "N/A";
      },
    },
    {
      id: "anneescolaire_intitule",
      header: "Année Scolaire",
      cell: ({ row }) => {
        const anneescolaire = row.original.annee_scolaires;
        return anneescolaire ? anneescolaire.intitule : "N/A";
      },
    },
    {
      accessorKey: "dateinscription",
      header: "Date d'Inscription",
      cell: ({ row }) => {
        const date = row.original.dateinscription;
        return new Date(date).toLocaleString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

interface DashboardRecentActivityProps {
  initialRecentInscriptions: InscriptionDisplayForDashboard[];
  recentNumber: string;
}

export function DashboardRecentActivity({
  initialRecentInscriptions,
  recentNumber,
}: DashboardRecentActivityProps) {
  const recentInscriptions =
    initialRecentInscriptions as InscriptionDisplayForDashboard[];
  return (
    <div className="px-4 lg:px-6">
      <h3 className="text-xl font-semibold mb-4">
        Inscriptions Récentes ({recentNumber})
      </h3>
      <DataTable
        columns={recentInscriptionsColumns}
        data={recentInscriptions}
      />
    </div>
  );
}

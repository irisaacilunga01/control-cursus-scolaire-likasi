// app/dossiers/dossier-list-client.tsx
"use client";

import { getEleveById } from "@/app/actions/eleves";
import { getInspecteurById } from "@/app/actions/inspecteurs";
import { createClient } from "@/lib/supabase/client";
import { Dossier, Eleve, Inspecteur } from "@/type"; // Importez tous les types nécessaires
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns"; // Va être créé dans l'étape suivante
import { DataTable } from "./data-table"; // Réutilisation du composant DataTable générique

// Définition d'un type étendu pour les données affichées dans la table
type DossierDisplay = Dossier & {
  eleve?: Eleve;
  inspecteur?: Inspecteur;
};

interface DossierListClientProps {
  initialDossiers: DossierDisplay[];
}

export function DossierListClient({ initialDossiers }: DossierListClientProps) {
  const [dossiers, setDossiers] = useState<DossierDisplay[]>(initialDossiers);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'dossiers'
    const channel = supabase
      .channel("dossier_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dossiers" }, // Nom de la table est 'dossiers' (au pluriel)
        async (payload) => {
          if (!isMounted) return;

          let dossierData: Dossier;
          let dossierWithRelations: DossierDisplay;

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            dossierData = payload.new as Dossier;

            // Récupérer les données liées pour l'affichage
            let eleveData: Eleve | undefined = undefined;
            if (dossierData.ideleve) {
              const { data: fetchedEleve, success: eleveSuccess } =
                await getEleveById(dossierData.ideleve);
              if (eleveSuccess && fetchedEleve) {
                eleveData = fetchedEleve;
              }
            }

            let inspecteurData: Inspecteur | undefined = undefined;
            if (dossierData.idinspecteur) {
              const { data: fetchedInspecteur, success: inspecteurSuccess } =
                await getInspecteurById(dossierData.idinspecteur);
              if (inspecteurSuccess && fetchedInspecteur) {
                inspecteurData = fetchedInspecteur;
              }
            }

            dossierWithRelations = {
              ...dossierData,
              eleve: eleveData,
              inspecteur: inspecteurData,
            };
          } else {
            // DELETE
            dossierWithRelations = payload.old as Dossier; // Utilisez les anciennes données pour le filtrage de suppression
          }

          if (payload.eventType === "INSERT") {
            setDossiers((prev) => [dossierWithRelations, ...prev]);
            toast.success("Nouveau dossier ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setDossiers((prev) =>
              prev.map((d) =>
                d.iddossier === dossierWithRelations.iddossier
                  ? dossierWithRelations
                  : d
              )
            );
            toast.info("Dossier mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setDossiers((prev) =>
              prev.filter((d) => d.iddossier !== dossierWithRelations.iddossier)
            );
            toast.warning("Dossier supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to dossiers table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux dossiers.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return <DataTable columns={columns} data={dossiers} />;
}

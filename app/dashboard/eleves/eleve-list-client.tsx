// app/eleve/eleve-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { Eleve } from "@/type"; // Assurez-vous que le type est correct
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Réutilisation du composant DataTable générique

interface EleveListClientProps {
  initialEleves: Eleve[];
}

export function EleveListClient({ initialEleves }: EleveListClientProps) {
  const [eleves, setEleves] = useState<Eleve[]>(initialEleves);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // S'abonner aux changements en temps réel sur la table 'eleve'
    const channel = supabase
      .channel("eleve_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eleves" },
        async (payload) => {
          if (!isMounted) return;
          let eleveWithAll: Eleve;
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const currentEleve = payload.new as Eleve;
            eleveWithAll = { ...currentEleve };
          } else {
            // DELETE
            eleveWithAll = payload.old as Eleve; // Pour la suppression, on utilise les anciennes données pour le filtrage
          }

          if (payload.eventType === "INSERT") {
            setEleves((prev) => [eleveWithAll, ...prev]);
            toast.success("Nouvel élève ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setEleves((prev) =>
              prev.map((e) =>
                e.ideleve === eleveWithAll.ideleve ? eleveWithAll : e
              )
            );
            toast.info("Élève mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setEleves((prev) =>
              prev.filter((e) => e.ideleve !== eleveWithAll.ideleve)
            );
            toast.warning("Élève supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to eleve table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux élèves.");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={eleves} />;
}

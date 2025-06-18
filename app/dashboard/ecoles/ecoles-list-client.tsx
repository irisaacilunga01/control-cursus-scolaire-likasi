// app/options/option-list-client.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Ecole } from "@/type"; // Assurez-vous que ce chemin est correct
import { createClient } from "@/lib/supabase/client"; // Importez le client Supabase côté client
import { toast } from "sonner";

interface EcoleListClientProps {
  initialEcoles: Ecole[];
}

export function EcoleListClient({ initialEcoles }: EcoleListClientProps) {
  const [ecoles, setEcoles] = useState<Ecole[]>(initialEcoles);

  useEffect(() => {
    const supabase = createClient(); // Créez le client Supabase
    let isMounted = true; // Pour gérer le démontage du composant

    // S'abonner aux changements en temps réel sur la table 'option'
    const channel = supabase
      .channel("option_changes") // Nom du canal
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "option" },
        (payload) => {
          if (!isMounted) return;

          // Gérer les différents types d'événements
          if (payload.eventType === "INSERT") {
            setEcoles((prev) => [...prev, payload.new as Ecole]);
            toast.success("Nouvelle option ajoutée en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setEcoles((prev) =>
              prev.map((o) =>
                o.idecole === (payload.new as Ecole).idecole
                  ? (payload.new as Ecole)
                  : o
              )
            );
            toast.info("Ecole mise à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setEcoles((prev) =>
              prev.filter((o) => o.idecole !== (payload.old as Ecole).idecole)
            );
            toast.warning("Ecole supprimée en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to options table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux écoles.");
        }
      });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={ecoles} />;
}

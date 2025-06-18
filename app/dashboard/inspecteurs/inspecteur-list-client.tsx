// app/Inspecteur/parent-list-client.tsx
"use client";

import { createClient } from "@/lib/supabase/client"; // Importez le client Supabase côté client
import { Inspecteur } from "@/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface InspecteurListClientProps {
  initialInspecteur: Inspecteur[];
}

export function InspecteurListClient({
  initialInspecteur,
}: InspecteurListClientProps) {
  const [inspacteurs, setInspecteurs] =
    useState<Inspecteur[]>(initialInspecteur);

  useEffect(() => {
    const supabase = createClient(); // Créez le client Supabase

    let isMounted = true; // Pour gérer le démontage du composant

    // S'abonner aux changements en temps réel sur la table 'parent'
    const channel = supabase
      .channel("parent_changes") // Nom du canal
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inspecteurs" },
        (payload) => {
          if (!isMounted) return;

          // Gérer les différents types d'événements
          if (payload.eventType === "INSERT") {
            setInspecteurs((prev) => [...prev, payload.new as Inspecteur]);
            toast.success("Nouveau parent ajouté en temps réel !");
          } else if (payload.eventType === "UPDATE") {
            setInspecteurs((prev) =>
              prev.map((p) =>
                p.idinspecteur === (payload.new as Inspecteur).idinspecteur
                  ? (payload.new as Inspecteur)
                  : p
              )
            );
            toast.info("Parent mis à jour en temps réel !");
          } else if (payload.eventType === "DELETE") {
            setInspecteurs((prev) =>
              prev.filter(
                (p) =>
                  p.idinspecteur !== (payload.old as Inspecteur).idinspecteur
              )
            );
            toast.warning("Parent supprimé en temps réel !");
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription to Inspecteur table is active!");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error:", status);
          toast.error("Erreur de connexion en temps réel aux Inspecteur.");
        }
      });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au montage

  return <DataTable columns={columns} data={inspacteurs} />;
}

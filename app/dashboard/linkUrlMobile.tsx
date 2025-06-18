"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import {
  IconBooks,
  IconBrandPaypalFilled,
  IconBuildingSkyscraper, // Icône pour Paiements
  IconCalendarTime, // Nouvelle icône pour les dossiers
  IconCashBanknote,
  IconDotsCircleHorizontal, // Nouvelle icône pour les inspecteurs
  IconFolder,
  IconHomeFilled,
  IconManFilled, // Nouvelle icône pour les frais d'enrôlement
  IconSchool, // Nouvelle icône pour les écoles
  IconUsersGroup,
} from "@tabler/icons-react";
import { PanelLeft } from "lucide-react"; // Package2 pour le logo générique
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function LinkUrlMobile({ role = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs p-3">
        <DialogTitle className="sr-only">Menu de navigation</DialogTitle>{" "}
        {/* Titre pour l'accessibilité */}
        <nav className="grid gap-2 text-lg font-medium">
          {/* Logo/Nom de l'application */}
          {/* <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Inspection EPST</span>{" "}
          </Link> */}
          {/* Nom de l'application mis à jour */}

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname === "/dashboard" ? "bg-muted text-primary" : ""
            }`}
          >
            <IconHomeFilled className="h-5 w-5" />
            <span className="text-sm">Dashboard</span>
          </Link>

          {/* Écoles (Nouveau) */}
          {role !== "ecole" && (
            <Link
              href="/dashboard/ecoles"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname.includes("/dashboard/ecoles")
                  ? "bg-secondary-foreground text-primary"
                  : ""
              }`}
            >
              <IconBuildingSkyscraper className="h-5 w-5" />
              <span className="text-sm">Écoles</span>
            </Link>
          )}

          {/* Années Scolaires (Nom de chemin mis à jour) */}
          <Link
            href="/dashboard/annee-scolaires"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/annee-scolaires")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconCalendarTime className="h-5 w-5" />
            <span className="text-sm">Années Scolaires</span>
          </Link>

          {/* Inspecteurs (Nouveau) */}
          <Link
            href="/dashboard/inspecteurs"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/inspecteurs")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconUsersGroup className="h-5 w-5" />
            <span className="text-sm">Inspecteurs</span>
          </Link>

          {/* Élèves */}
          <Link
            href="/dashboard/eleves"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/eleves")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconManFilled className="h-5 w-5" />
            <span className="text-sm">Élèves</span>
          </Link>

          {/* Classes (Icône mise à jour) */}
          <Link
            href="/dashboard/classes"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/classes")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconSchool className="h-5 w-5" />
            <span className="text-sm">Classes</span>
          </Link>

          {/* Options */}
          {role !== "ecole" && (
            <Link
              href="/dashboard/options"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname.includes("/dashboard/options")
                  ? "bg-secondary-foreground text-primary"
                  : ""
              }`}
            >
              <IconDotsCircleHorizontal className="h-5 w-5" />
              <span className="text-sm">Options</span>
            </Link>
          )}

          {/* Inscriptions */}
          <Link
            href="/dashboard/inscriptions"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/inscriptions")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconBooks className="h-5 w-5" />
            <span className="text-sm">Inscriptions</span>
          </Link>

          {/* Dossiers (Nouveau) */}
          <Link
            href="/dashboard/dossiers"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/dossiers")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconFolder className="h-5 w-5" />
            <span className="text-sm">Dossiers</span>
          </Link>

          {/* Frais d'Enrôlement (Nom de chemin et icône mis à jour) */}
          <Link
            href="/dashboard/frais-enrolement"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/frais-enrolement")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconCashBanknote className="h-5 w-5" />
            <span className="text-sm">Frais d&apos;Enrôlement</span>
          </Link>

          {/* Paiements */}
          <Link
            href="/dashboard/paiements"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/paiements")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconBrandPaypalFilled className="h-5 w-5" />
            <span className="text-sm">Paiements</span>
          </Link>

          {/* Notifications */}
          {/* <Link
            href="/dashboard/notifications"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
              pathname.includes("/dashboard/notifications")
                ? "bg-secondary-foreground text-primary"
                : ""
            }`}
          >
            <IconBellFilled className="h-5 w-5" />
            <span className="text-sm">Notifications</span>
          </Link> */}

          {/* Bouton de déconnexion */}
          <Button variant="outline" onClick={logout} className="mt-4 w-full">
            Se déconnecter
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

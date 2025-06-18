"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { capitalize } from "@/lib/utils";
import {
  IconBooks,
  IconBrandPaypalFilled,
  IconBuildingSkyscraper, // Remplacer par une icône plus générique pour les paiements
  IconCalendarTime, // Nouvelle icône pour les dossiers
  IconCashBanknote,
  IconDotsCircleHorizontal, // Nouvelle icône pour les inspecteurs
  IconFolder,
  IconHomeFilled,
  IconManFilled, // Nouvelle icône pour les frais d'enrôlement
  IconSchool, // Nouvelle icône pour les écoles
  IconUsersGroup,
} from "@tabler/icons-react";
import { Moon, Sun, User, UserCog } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

function LinkUrl({ email = "", role = "" }) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <>
      <nav className="flex flex-col items-center gap-1 px-1 sm:py-3">
        {/* Dashboard */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === "/dashboard" ? "bg-muted text-primary" : ""
                }`}
              >
                <IconHomeFilled className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Écoles */}
        {role !== "ecole" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/ecoles"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    pathname.includes("/dashboard/ecoles")
                      ? "bg-secondary-foreground text-primary"
                      : ""
                  }`}
                >
                  <IconBuildingSkyscraper className="h-5 w-5" />
                  <span className="sr-only">Écoles</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Écoles</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Années Scolaires */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/annee-scolaires" // Renommé
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/annee-scolaires") // Renommé
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconCalendarTime className="h-5 w-5" />
                <span className="sr-only">Années Scolaires</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Années Scolaires</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Inspecteurs */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/inspecteurs"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/inspecteurs")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconUsersGroup className="h-5 w-5" />
                <span className="sr-only">Inspecteurs</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Inspecteurs</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Élèves */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/eleves"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/eleves")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconManFilled className="h-5 w-5" />
                <span className="sr-only">Élèves</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Élèves</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Classes */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/classes"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/classes")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconSchool className="h-5 w-5" /> {/* Icône changée */}
                <span className="sr-only">Classes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Classes</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Options */}
        {role !== "ecole" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/options"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    pathname.includes("/dashboard/options")
                      ? "bg-secondary-foreground text-primary"
                      : ""
                  }`}
                >
                  <IconDotsCircleHorizontal className="h-5 w-5" />
                  <span className="sr-only">Options</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Options</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Inscriptions */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/inscriptions"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/inscriptions")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconBooks className="h-5 w-5" />
                <span className="sr-only">Inscriptions</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Inscriptions</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Dossiers (Nouveau) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/dossiers"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/dossiers")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconFolder className="h-5 w-5" />
                <span className="sr-only">Dossiers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dossiers</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Frais d'Enrôlement */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/frais-enrolement" // Renommé
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/frais-enrolement") // Renommé
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconCashBanknote className="h-5 w-5" /> {/* Icône changée */}
                <span className="sr-only">Frais d&apos;Enrôlement</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              Frais d&apos;Enrôlement
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Paiements */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/paiements"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/paiements")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconBrandPaypalFilled className="h-5 w-5" />{" "}
                {/* Icône conservée ou à changer si une meilleure est trouvée */}
                <span className="sr-only">Paiements</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Paiements</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications (Conservé) */}
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/notifications"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname.includes("/dashboard/notifications")
                    ? "bg-secondary-foreground text-primary"
                    : ""
                }`}
              >
                <IconBellFilled className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        {/* Section Basse de la Navigation */}
        <nav className="mt-auto flex flex-col items-center gap-2 px-2 sm:py-5">
          {/* Utilisateurs (Conservé) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/users"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    pathname.includes("/dashboard/users")
                      ? "bg-secondary-foreground text-primary"
                      : ""
                  }`}
                >
                  <UserCog className="h-5 w-5" />
                  <span className="sr-only">Utilisateurs</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Utilisateurs</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Sélecteur de Thème (Conservé) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="w-7 h-7">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Changer de thème</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Clair
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Sombre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Système
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Utilisateur (Conservé) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-7 h-7 bg-blue-700 cursor-pointer" asChild>
                <User className="p-1" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Mr(Mme) {capitalize(email.split("@")[0])}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-sm font-thin">
                {email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </nav>
    </>
  );
}

export default LinkUrl;

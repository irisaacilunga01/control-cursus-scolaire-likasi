"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import Image from "next/image"; // Importez le composant Image de Next.js
import { useState } from "react";
import { toast } from "sonner"; // Pour les notifications

export default function ApiTestPage() {
  // State for /api/eleves/dossier/[matricule]
  const [dossierMatricule, setDossierMatricule] = useState("");
  const [dossierResponse, setDossierResponse] = useState<string | null>(null);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierError, setDossierError] = useState<string | null>(null);

  // State for /api/ecoles/[codeecole]
  const [ecoleCode, setEcoleCode] = useState("");
  const [ecoleResponse, setEcoleResponse] = useState<string | null>(null);
  const [ecoleLoading, setEcoleLoading] = useState(false);
  const [ecoleError, setEcoleError] = useState<string | null>(null);

  // State for /api/inspecteurs/[matricule]
  const [inspecteurMatricule, setInspecteurMatricule] = useState("");
  const [inspecteurResponse, setInspecteurResponse] = useState<string | null>(
    null
  );
  const [inspecteurLoading, setInspecteurLoading] = useState(false);
  const [inspecteurError, setInspecteurError] = useState<string | null>(null);

  /**
   * Handles the API call for /api/eleves/dossier/[matricule]
   */
  const handleDossierTest = async () => {
    setDossierLoading(true);
    setDossierError(null);
    setInspecteurResponse(null);
    setDossierResponse(null);
    setEcoleResponse(null);

    if (!dossierMatricule) {
      setDossierError("Veuillez entrer un matricule de dossier.");
      setDossierLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/eleves/dossier/${dossierMatricule}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération du dossier."
        );
      }

      setDossierResponse(JSON.stringify(data, null, 2));
      toast.success("Données du dossier récupérées avec succès !");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setDossierError(
        err.message || "Erreur inconnue lors du test du dossier."
      );
      toast.error("Erreur lors de la récupération du dossier", {
        description:
          err.message || "Veuillez vérifier le matricule ou la connexion.",
      });
    } finally {
      setDossierLoading(false);
    }
  };

  /**
   * Handles the API call for /api/ecoles/[codeecole]
   */
  const handleEcoleTest = async () => {
    setEcoleLoading(true);
    setEcoleError(null);
    setInspecteurResponse(null);
    setDossierResponse(null);
    setEcoleResponse(null);

    if (!ecoleCode) {
      setEcoleError("Veuillez entrer un code d'école.");
      setEcoleLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/ecoles/${ecoleCode}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Erreur lors de la récupération des informations de l'école."
        );
      }

      setEcoleResponse(JSON.stringify(data, null, 2));
      toast.success("Données de l'école récupérées avec succès !");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setEcoleError(err.message || "Erreur inconnue lors du test de l'école.");
      toast.error("Erreur lors de la récupération de l'école", {
        description:
          err.message ||
          "Veuillez vérifier le code de l'école ou la connexion.",
      });
    } finally {
      setEcoleLoading(false);
    }
  };

  /**
   * Handles the API call for /api/inspecteurs/[matricule]
   */
  const handleInspecteurTest = async () => {
    setInspecteurLoading(true);
    setInspecteurError(null);
    setInspecteurResponse(null);
    setDossierResponse(null);
    setEcoleResponse(null);
    if (!inspecteurMatricule) {
      setInspecteurError("Veuillez entrer un matricule d'inspecteur.");
      setInspecteurLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/inspecteurs/${inspecteurMatricule}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Erreur lors de la récupération des informations de l'inspecteur."
        );
      }

      setInspecteurResponse(JSON.stringify(data, null, 2));
      toast.success("Données de l'inspecteur récupérées avec succès !");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setInspecteurError(
        err.message || "Erreur inconnue lors du test de l'inspecteur."
      );
      toast.error("Erreur lors de la récupération de l'inspecteur", {
        description:
          err.message || "Veuillez vérifier le matricule ou la connexion.",
      });
    } finally {
      setInspecteurLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      {/* Image et Documentation */}
      <div className="text-center mb-10">
        <Image
          src="/epst.webp"
          alt="Ministère de l'Enseignement Primaire, Secondaire et Technique"
          width={250} // Ajustez la largeur selon vos besoins
          height={250} // Ajustez la hauteur selon vos besoins
          className="mx-auto mb-6 rounded-lg shadow-md"
          priority // Optionnel: pour charger l'image plus rapidement
        />
        <h1 className="text-4xl font-bold mb-4 text-primary-dark">
          Documentation et Testeur d&apos;API Publiques
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Bienvenue sur la page de documentation et de test des API publiques du
          Complexe Scolaire UZIMA. Ces API permettent d&apos;accéder à des
          informations clés de manière sécurisée et sans authentification,
          idéales pour des applications externes ou des intégrations légères.
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Utilisez les formulaires ci-dessous pour tester chaque endpoint en
          temps réel et observer les réponses JSON.
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-center">
        Testeur d&apos;API
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* API 1: /api/eleves/dossier/[matricule] */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              1. Dossier de l&apos;Élève par Matricule
            </CardTitle>
            <CardDescription>
              Affiche toutes les informations détaillées sur un élève, y compris
              son dossier, ses identités, ses classes, ses inscriptions, les
              années scolaires, l&apos;école et l&apos;option.
              <br />
              URL:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                /api/eleves/dossier/<span className="italic">[matricule]</span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="dossier-matricule">Matricule du Dossier</Label>
              <Input
                id="dossier-matricule"
                type="text"
                placeholder="Ex: M12345"
                value={dossierMatricule}
                onChange={(e) => setDossierMatricule(e.target.value)}
              />
            </div>
            <Button
              onClick={handleDossierTest}
              disabled={dossierLoading}
              className="w-full"
            >
              {dossierLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Tester la Route"
              )}
            </Button>
            {dossierError && (
              <p className="text-red-500 text-sm mt-2">
                Erreur : Dossier de l&apos;Élève{dossierError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* API 2: /api/ecoles/[codeecole] */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              2. Informations de l&apos;École par Code
            </CardTitle>
            <CardDescription>
              Affiche les informations complètes sur une école, y compris le
              nombre total d&apos;élèves, de classes et d&apos;options qui lui
              sont associées.
              <br />
              URL:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                /api/ecoles/<span className="italic">[codeecole]</span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="ecole-code">Code de l&apos;École</Label>
              <Input
                id="ecole-code"
                type="text"
                placeholder="Ex: ECOLE001"
                value={ecoleCode}
                onChange={(e) => setEcoleCode(e.target.value)}
              />
            </div>
            <Button
              onClick={handleEcoleTest}
              disabled={ecoleLoading}
              className="w-full"
            >
              {ecoleLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Tester la Route"
              )}
            </Button>
            {ecoleError && (
              <p className="text-red-500 text-sm mt-2">
                Erreur Ecole : {ecoleError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* API 3: /api/inspecteurs/[matricule] */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              3. Informations de l&apos;Inspecteur par Matricule
            </CardTitle>
            <CardDescription>
              Affiche les informations détaillées sur un inspecteur, telles que
              son nom, son matricule, son téléphone, son poste d&apos;attache et
              sa zone.
              <br />
              URL:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                /api/inspecteurs/<span className="italic">[matricule]</span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="inspecteur-matricule">
                Matricule de l&apos;Inspecteur
              </Label>
              <Input
                id="inspecteur-matricule"
                type="text"
                placeholder="Ex: I-001"
                value={inspecteurMatricule}
                onChange={(e) => setInspecteurMatricule(e.target.value)}
              />
            </div>
            <Button
              onClick={handleInspecteurTest}
              disabled={inspecteurLoading}
              className="w-full"
            >
              {inspecteurLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Tester la Route"
              )}
            </Button>
            {inspecteurError && (
              <p className="text-red-500 text-sm mt-2">
                Erreur Inspecteur : {inspecteurError}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-10 flex-col">
        {dossierResponse && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto w-full">
            {" "}
            {/* Added w-full here */}
            <h3 className="font-semibold mb-2">
              Réponse Dossier de l&apos;Élève :
            </h3>
            <pre className="text-sm whitespace-pre-wrap">{dossierResponse}</pre>
          </div>
        )}
        {ecoleResponse && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto w-full">
            {" "}
            {/* Added w-full here */}
            <h3 className="font-semibold mb-2">Réponse Ecole Info :</h3>
            <pre className="text-sm whitespace-pre-wrap">{ecoleResponse}</pre>
          </div>
        )}
        {inspecteurResponse && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto w-full">
            {" "}
            {/* Added w-full here */}
            <h3 className="font-semibold mb-2">Réponse Inspecteur Info :</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {inspecteurResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

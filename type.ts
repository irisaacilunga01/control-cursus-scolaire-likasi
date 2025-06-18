// types.ts

/**
 * Type pour la table 'Ecole'.
 */
export type Ecole = {
  idecole: number;
  nomecole: string;
  abreviation: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  codeecole?: string;
};

/**
 * Type pour la table 'Option'.
 */
export type Option = {
  idoption: number;
  nomoption: string;
  abreviation?: string;
};

/**
 * Type pour la table 'Annee_scolaire'.
 * dateDebut et dateFin sont des chaînes de caractères au format 'YYYY-MM-DD'.
 */
export type Annee_scolaire = {
  idannee: number;
  intitule: string;
  datedebut: string; // Représente une date (YYYY-MM-DD)
  datefin: string; // Représente une date (YYYY-MM-DD)
  status: "en cours" | "terminé";
};

/**
 * Type pour la table 'Inspecteur'.
 */
export type Inspecteur = {
  idinspecteur: number;
  nom: string;
  postnom: string;
  prenom?: string;
  matricule?: string;
  telephone?: string;
  poste_attache?: string;
  zone?: string;
  photo?: string;
};

/**
 * Type pour la table 'Dossier'.
 * bulletins pourrait être un JSON string si c'est une liste de documents, ou un simple texte.
 */
export type Dossier = {
  iddossier: number;
  matricule?: string | null;
  bulletin5emeprimaire?: string | null;
  bulletin6emeprimaire?: string | null;
  certificat?: string | null;
  bulletin1ere?: string | null;
  bulletin2eme?: string | null;
  bulletin3eme?: string | null;
  bulletin4eme?: string | null;
  bulletin5eme?: string | null;
  etat?: string | null;
  idinspecteur?: number;
  ideleve?: number;
};

/**
 * Type pour la table 'Eleve'.
 * dateNaissance est une chaîne de caractères au format 'YYYY-MM-DD'.
 */
export type Eleve = {
  ideleve: number;
  nom: string;
  postnom: string;
  prenom?: string;
  sexe?: string; // Assumé comme une chaîne (ex: 'M' ou 'F')
  lieunaissance?: string; // Représente une date (YYYY-MM-DD)
  datenaissance?: string; // Représente une date (YYYY-MM-DD)
  nationalite?: string;
  adresse?: string;
  photo?: string;
};

/**
 * Type pour la table 'Classe'.
 */
export type Classe = {
  idclasse: number;
  nom: string;
  niveau?: string;
  idoption?: number;
  idecole?: number;
};

/**
 * Type pour la table 'Inscription'.
 * Cette table a une clé primaire composite (idAnneeScolaire, idEleve, idClasse).
 * dateInscription est une chaîne de caractères au format ISO 8601.
 */
export type Inscription = {
  idanneescolaire: number; // Clé étrangère vers Annee_scolaire.idAnnee
  ideleve: number; // Clé étrangère vers Eleve.idEleve
  idclasse: number; // Clé étrangère vers Classe.idClasse
  dateinscription: string; // Représente un timestamp avec fuseau horaire
};

/**
 * Type pour la table 'Paiement'.
 * datePaiement est une chaîne de caractères au format ISO 8601.
 */
export type Paiement = {
  idpaiement: number;
  status: "en cours" | "terminé";
  montant: number;
  datepaiement: string; // Représente un timestamp avec fuseau horaire
  ideleve: number;
  idfrais: number;
};

/**
 * Type pour la table 'Frais_enrolement'.
 * anneeScolaire est une clé étrangère vers Annee_scolaire.idAnnee.
 */
export type Frais_enrolement = {
  idfrais: number;
  montant: number;
  description?: string;
  dateecheance?: string; // Représente une date (YYYY-MM-DD)
  idanneescolaire?: number;
};

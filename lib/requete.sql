-- Table: ecoles
-- Stocke les informations sur les écoles.
create table ecoles (
  idecole bigint primary key generated always as identity,
  nomecole text not null,
  abreviation text not null,
  adresse text,
  email text,
  telephone text,
  codeecole text
);

-- Active la sécurité au niveau des lignes (Row Level Security - RLS) pour la table ecoles.
alter table ecoles enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les informations des écoles.
create policy "public can read ecoles"
on public.ecoles
for select to anon
using (true);

---

-- Table: annee_scolaires
-- Stocke les informations sur les années scolaires.
create table annee_scolaires (
  idannee bigint primary key generated always as identity,
  intitule text not null,
  datedebut date not null,
  datefin date not null,
  status text not null default 'en cours' -- Ajout d'un statut par défaut 'pending'
);

-- Active la sécurité au niveau des lignes (RLS) pour la table annee_scolaires.
alter table annee_scolaires enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les années scolaires.
create policy "public can read annee_scolaires"
on public.annee_scolaires
for select to anon
using (true);

---

-- Table: inspecteurs
-- Stocke les informations des inspecteurs.
create table inspecteurs (
  idinspecteur bigint primary key generated always as identity,
  nom text not null,
  postnom text not null,
  prenom text,
  matricule text,
  telephone text,
  poste_attache text,
  zone text,
  photo text
);

-- Active la sécurité au niveau des lignes (RLS) pour la table inspecteurs.
alter table inspecteurs enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les informations des inspecteurs.
create policy "public can read inspecteurs"
on public.inspecteurs
for select to anon
using (true);

---

-- Table: options
-- Stocke les différentes options (filières) d'étude.
create table options (
  idoption bigint primary key generated always as identity,
  nomoption text not null,
  abreviation text, 
);

-- Active la sécurité au niveau des lignes (RLS) pour la table options.
alter table options enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les options.
create policy "public can read options"
on public.options
for select to anon
using (true);

---

-- Table: eleves
-- Stocke les informations des élèves.
create table eleves (
  ideleve bigint primary key generated always as identity,
  nom text not null,
  postnom text not null,
  prenom text,
  sexe text,
  lieunaissance text,
  datenaissance date,
  nationalite text,
  adresse text,
  photo text
);

-- Active la sécurité au niveau des lignes (RLS) pour la table eleves.
alter table eleves enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les informations des élèves.
create policy "public can read eleves"
on public.eleves
for select to anon
using (true);

---

-- Table: classes
-- Stocke les informations sur les classes.
create table classes (
  idclasse bigint primary key generated always as identity,
  nom text not null,
  niveau text,
  idoption bigint references options(idoption) on delete restrict,
    idecole bigint references ecoles(idecole) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table classes.
alter table classes enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les classes.
create policy "public can read classes"
on public.classes
for select to anon
using (true);

---


-- Table: frais_enrolement
-- Stocke les informations sur les frais d'enrôlement.
create table frais_enrolement (
  idfrais bigint primary key generated always as identity,
  montant numeric(10, 2) not null,
  description text,
  dateecheance date,
  idanneescolaire bigint references annee_scolaires(idannee) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table frais_enrolement.
alter table frais_enrolement enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les frais_enrolement.
create policy "public can read frais_enrolement"
on public.frais_enrolement
for select to anon
using (true);

----

-- Table: paiements
-- Stocke les paiements effectués par les élèves (ou leurs parents).
create table paiements (
  idpaiement bigint primary key generated always as identity,
  status text not null default 'en cours' -- Ajout d'un statut par défaut 'pending'
  montant numeric(10, 2) not null,
  datepaiement timestamp with time zone default now() not null,
  ideleve bigint references eleves(ideleve) on delete restrict,
  idfrais bigint references frais_enrolement(idfrais) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table paiements.
alter table paiements enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les paiements.
create policy "public can read paiements"
on public.paiements
for select to anon
using (true);

---
---

-- Table: inscriptions
-- Table de jonction pour les inscriptions des élèves à une classe pour une année scolaire donnée.
create table inscriptions (
  idanneescolaire bigint references annee_scolaires(idannee) on delete cascade,
  ideleve bigint references eleves(ideleve) on delete cascade,
  idclasse bigint references classes(idclasse) on delete cascade,
  dateinscription timestamp with time zone default now() not null,
  primary key (idanneescolaire, ideleve, idclasse) -- Clé primaire composite
);

-- Active la sécurité au niveau des lignes (RLS) pour la table inscriptions.
alter table inscriptions enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les inscriptions.
create policy "public can read inscriptions"
on public.inscriptions
for select to anon
using (true);



-- Table: dossiers
-- Stocke les dossiers des élèves (e.g., bulletins, état du dossier).
create table dossiers (
  iddossier bigint primary key generated always as identity,
  matricule text,
  bulletin5emeprimaire text,
  bulletin6emeprimaire text,
  certificat text,
  bulletin1ere text,
  bulletin2eme text,
  bulletin3eme text,
  bulletin4eme text,
  bulletin5eme text,
  etat text,
  idinspecteur bigint references inspecteurs(idinspecteur) on delete restrict,
  ideleve bigint references eleves(ideleve) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table dossiers.
alter table dossiers enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les dossiers.
create policy "public can read dossiers"
on public.dossiers
for select to anon
using (true);
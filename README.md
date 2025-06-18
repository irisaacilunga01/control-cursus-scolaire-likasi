\<a href="[https://control-cursus-scolaire-likasi.vercel.app/](https://control-cursus-scolaire-likasi.vercel.app/)"\>
\<img alt="Lycée UZIMA - Suivi Paiement Frais Scolaires" src="[https://control-cursus-scolaire-likasi.vercel.app/saacTech.png](https://control-cursus-scolaire-likasi.vercel.app/saacTech.png)"\>
\<h1 align="center"\>Lycée UZIMA – Application de gestion des frais scolaires\</h1\>
\</a\>

\<p align="center"\>
Application de suivi et de paiement des frais scolaires pour le Lycée UZIMA
\</p\>

\<p align="center"\>
\<a href="\#fonctionnalités"\>\<strong\>Fonctionnalités\</strong\>\</a\> ·
\<a href="\#api-publiques"\>\<strong\>API Publiques\</strong\>\</a\> ·
\<a href="\#démo"\>\<strong\>Démo\</strong\>\</a\> ·
\<a href="\#déploiement-vercel"\>\<strong\>Déploiement\</strong\>\</a\> ·
\<a href="\#installation-locale"\>\<strong\>Installation locale\</strong\>\</a\> ·
\<a href="\#contact-et-support"\>\<strong\>Support\</strong\>\</a\>
\</p\>

---

## ✨ Fonctionnalités

- Authentification sécurisée avec [Supabase Auth](https://supabase.com/auth)

- Suivi des frais scolaires par élève

- Historique des paiements

- Gestion des élèves, parents, classes, options, inspecteurs, années scolaires et notifications.

- Interface réactive avec [Tailwind CSS](https://tailwindcss.com)

- Composants UI modernes avec [shadcn/ui](https://ui.shadcn.com)

- Changement de thème (clair/sombre)

- Compatible avec [Vercel](https://vercel.com) pour un déploiement rapide

---

## 🌐 API Publiques

Cette application expose des API RESTful publiques pour faciliter l'accès à certaines données clés sans authentification. Ces endpoints sont idéaux pour l'intégration avec des applications externes ou pour des besoins d'analyse.

**Endpoints disponibles :**

1.  **`GET /api/eleves/dossier/[matricule]`**

    - **Description :** Récupère toutes les informations détaillées sur un élève, y compris son dossier, ses identités, ses classes, ses inscriptions, les années scolaires, l'école et l'option, à partir du matricule de son dossier.

    - **Exemple :** `/api/eleves/dossier/M12345`

2.  **`GET /api/ecoles/[codeecole]`**

    - **Description :** Affiche les informations complètes sur une école, y compris le nombre total d'élèves, de classes et d'options qui lui sont associées.

    - **Exemple :** `/api/ecoles/ECOLE001`

3.  **`GET /api/inspecteurs/[matricule]`**

    - **Description :** Récupère les informations détaillées sur un inspecteur (nom, matricule, téléphone, poste d'attache, zone) à partir de son matricule.

    - **Exemple :** `/api/inspecteurs/I-001`

**Tester les API en direct :**

Vous pouvez tester ces endpoints directement via notre interface de test API :
➡️ [Accéder au Testeur d'API](https://www.google.com/search?q=https://control-cursus-scolaire-likasi.vercel.app/api-test) (Remplacez `control-cursus-scolaire-likasi.vercel.app` par l'URL de votre déploiement si différent)

---

## 🧪 Démo

Consulte une version de démonstration ici :
➡️ [control-cursus-scolaire-likasi.vercel.app](https://www.google.com/search?q=https://control-cursus-scolaire-likasi.vercel.app)

---

## 🚀 Déploiement Vercel

Déploie automatiquement l’application sur Vercel :

[](https://www.google.com/search?q=https://vercel.com/new/clone%3Frepository-url%3Dhttps://github.com/irisaacilunga01/control-cursus-scolaire-likasi%26project-name%3Dcontrol-cursus-scolaire-likasi%26repository-name%3Dcontrol-cursus-scolaire-likasi)

L’intégration Supabase attribuera automatiquement les variables d’environnement nécessaires.

---

## 🛠️ Installation locale

1.  Crée un projet Supabase via le [dashboard](https://database.new)

2.  Clone ce dépôt :

    ```bash
    git clone https://github.com/irisaacilunga01/control-cursus-scolaire-likasi.git
    cd control-cursus-scolaire-likasi
    ```

3.  **Configure Supabase :**

    - Dans votre tableau de bord Supabase, allez dans "Project Settings" \> "API".
    - Copiez l'`URL` et la `Service Role Key` (ou `Anon Public Key` pour le frontend).
    - Créez un fichier `.env.local` à la racine de votre projet et ajoutez :
      ```
      NEXT_PUBLIC_SUPABASE_URL="[Votre URL Supabase]"
      NEXT_PUBLIC_SUPABASE_ANON_KEY="[Votre clé publique anon Supabase]"
      SUPABASE_SERVICE_ROLE_KEY="[Votre clé Service Role Supabase]" # Utilisée pour les Server Actions/fonctions protégées
      ```

4.  **Exécute les migrations de base de données :**

    - Utilise le schéma SQL fourni précédemment dans la console Supabase SQL Editor pour créer toutes les tables et politiques RLS nécessaires.

5.  **Installe les dépendances :**

    ```bash
    npm install
    # ou
    yarn install
    ```

6.  **Démarre le serveur de développement :**

    ```bash
    npm run dev
    # ou
    yarn dev
    ```

    L'application sera accessible sur `http://localhost:3000`.

---

## 📞 Contact et Support

Pour toute question ou demande de support, veuillez contacter [saacTech](mailto:saac.tech.inc@gmail.com).

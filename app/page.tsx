// // app/page.tsx
// import { AuthButton } from "@/components/auth-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { hasEnvVars } from "@/lib/utils";
// import Image from "next/image"; // Importation du composant Image de Next.js
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
//       <div className="flex-1 w-full flex flex-col items-center">
//         {/* Barre de navigation */}
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shadow-sm">
//           <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//             <div className="flex gap-5 items-center font-semibold">
//               <Link
//                 href={"/"}
//                 className="text-lg font-bold text-primary-dark flex items-center gap-2"
//               >
//                 {/* Logo EPST */}
//                 <Image
//                   src="/epst.webp"
//                   alt="Logo EPST"
//                   width={40} // Largeur fixe pour le logo
//                   height={40} // Hauteur fixe pour le logo
//                   className="rounded-full object-cover"
//                   priority // Chargement prioritaire pour le logo dans la nav
//                 />
//                 Inspection EPST
//               </Link>
//             </div>
//             {/* Bouton d'authentification et avertissement */}
//             <div className="flex items-center gap-4">
//               {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
//               <ThemeSwitcher />
//             </div>
//           </div>
//         </nav>

//         {/* Contenu principal de la page d'accueil */}
//         <div className="flex-1 flex flex-col gap-10 max-w-5xl w-full p-5 md:p-10 lg:p-12">
//           {/* Titre principal */}
//           <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-8 leading-tight">
//             Bienvenue au Système de Contrôle du Cursus Scolaire EPST
//           </h1>
//           <Image
//             src="/epst.webp"
//             alt="Logo EPST"
//             width={250} // Largeur fixe pour le logo
//             height={250}
//             className="rounded-full object-cover mx-auto"
//             priority // Chargement prioritaire pour le logo dans la nav
//           />
//           {/* Section: Situation Géographique */}
//           <section className="mb-12 border-l-4 border-primary-light pl-4 md:pl-6">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
//               Situation Géographique
//             </h2>
//             <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               L’inspection de l’EPST de Likasi se situe dans le bâtiment de la
//               sous division LIKASI 1, ce bâtiment est délimité au nord par le
//               complexe scolaire ¨MAPINDUZI au sud par l’avenue Jacaranda à l’est
//               par le théâtre de la verdure MAPINDUZI et le boulevard KAMANYOLA à
//               l’ouest par le terrain de foot MAPINDUZI et le boulevard de
//               l’indépendance.
//             </p>
//           </section>

//           {/* Section: Historique */}
//           <section className="mb-12 border-l-4 border-secondary-light pl-4 md:pl-6">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
//               Historique de l&apos;Inspection de l&apos;EPST en RDC
//             </h2>
//             <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               L’Inspection de l’Enseignement en République Démocratique du Congo
//               (RDC) est un organe clé du système éducatif, ayant évolué au fil
//               du temps pour s’adapter aux réalités du pays.
//             </p>
//             <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               <strong>Période coloniale (1908 – 1960):</strong>
//               L’enseignement en RDC (ancien Congo belge) était sous le contrôle
//               des missions religieuses, supervisées par les autorités
//               coloniales. La première structure d’inspection était dirigée par
//               des inspecteurs belges qui veillaient à l’application des
//               programmes éducatifs coloniaux. L’éducation était limitée aux
//               niveaux primaire et technique, avec peu d&apos;accès pour les
//               Congolais à l’enseignement secondaire et supérieur.
//             </p>
//             <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               <strong>
//                 Indépendance et mise en place d’une inspection nationale (1960 –
//                 1970):
//               </strong>
//               près l’indépendance en 1960, le gouvernement congolais a repris le
//               contrôle du système éducatif. L’Inspection de l’Enseignement a été
//               instaurée pour garantir la qualité de l’éducation et veiller à
//               l’application des réformes. En 1967, la réforme éducative de
//               Mobutu a renforcé le rôle de l’inspection en instaurant une
//               supervision plus centralisée de l’enseignement.
//             </p>
//             <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               <strong>
//                 La Zaïrianisation et réforme éducative (1971 – 1990):
//               </strong>
//               En 1971, la Zaïrianisation de l’éducation a conduit à la
//               nationalisation des écoles, réduisant l’influence des missions
//               religieuses. L’Inspection Générale de l’Enseignement (IGE) a été
//               renforcée pour superviser les écoles publiques et privées. Des
//               structures comme les Inspecteurs Principaux Provinciaux (IPP) et
//               les Inspecteurs Sectionnaires (ISEC) ont été mises en place. La
//               période de troubles politiques et économiques (1990 – 2000) a
//               gravement affecté l’éducation. L’Inspection de l’Enseignement a
//               souffert d’un manque de moyens, ce qui a réduit son efficacité. La
//               prolifération d’écoles privées, souvent mal contrôlées, a posé des
//               défis à l’inspection.
//             </p>
//             <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               <strong>
//                 Les Réformes et la modernisation (2000 – aujourd’hui):
//               </strong>
//               Avec les réformes du secteur éducatif initiées dans les années
//               2000, l’Inspection de l’EPST a été restructurée. Il y a eu
//               l&apos;introduction de nouvelles catégories d’inspecteurs, comme
//               l’Inspecteur Itinérant et l’Inspecteur Exploitant, et
//               l&apos;adoption de la gratuité de l’enseignement primaire (2019),
//               nécessitant un renforcement du contrôle des établissements
//               scolaires. On observe également l’intégration progressive des
//               technologies pour améliorer le suivi des établissements et des
//               enseignants.
//             </p>
//           </section>

//           {/* Section: Présentation de l’organisation */}
//           <section className="mb-12 border-l-4 border-accent-light pl-4 md:pl-6">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
//               Présentation de l&apos;Organisation
//             </h2>
//             <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
//               <p>
//                 L&apos;organisation de l&apos;Inspection de l&apos;EPST est
//                 structurée autour de plusieurs niveaux de responsabilité :
//               </p>
//               <ul className="list-disc list-inside ml-4 space-y-2">
//                 <li>
//                   <strong>IGE (Inspecteur Général de l&apos;EPST):</strong>{" "}
//                   L’inspecteur général est la plus haute autorité dans
//                   l&apos;inspection de l&apos;enseignement en RDC. Il définit
//                   les grandes orientations et politiques de contrôle de la
//                   qualité éducative, et supervise l’ensemble des inspections sur
//                   le territoire national.
//                 </li>
//                 <li>
//                   <strong>IPP (Inspecteur Principal Provincial):</strong>{" "}
//                   L’inspecteur principal provincial supervise l&apos;ensemble
//                   des inspections dans une province. Il coordonne les activités
//                   des inspecteurs et veille à l&apos;application des
//                   instructions officielles, et rend compte au ministère de
//                   l&apos;EPST de la situation de l&apos;éducation dans la
//                   province.
//                 </li>
//                 <li>
//                   <strong>INSPOOL (Inspecteur Chef de Pool):</strong>{" "}
//                   L’inspecteur chef de pool coordonne les inspections au sein
//                   d’un pool (un regroupement d’écoles ou d’établissements),
//                   encadre les inspecteurs sous sa responsabilité et assure le
//                   suivi des recommandations pédagogiques.
//                 </li>
//                 <li>
//                   <strong>INS (Inspecteur Itinérant):</strong> L’inspecteur
//                   itinérant se déplace régulièrement pour contrôler les
//                   établissements scolaires. Il apporte un appui technique et
//                   pédagogique aux enseignants dans plusieurs écoles.
//                 </li>
//                 <li>
//                   <strong>IPRI (Inspecteur Pool Primaire):</strong> Il est
//                   responsable du suivi pédagogique et administratif au niveau
//                   des écoles primaires. Il assure la coordination des
//                   inspections sous sa juridiction (inspecteur itinérant) et
//                   contrôle la mise en œuvre des réformes et programmes
//                   éducatifs.
//                 </li>
//                 <li>
//                   <strong>ISEC (Inspecteur pool secondaire):</strong> Supervise
//                   les établissements d&apos;un secteur scolaire spécifique dans
//                   une province. Il évalue et contrôle les enseignants et les
//                   élèves selon les programmes en vigueur.
//                 </li>
//               </ul>
//             </div>
//             {/* Organigramme */}
//             <div className="mt-8 flex justify-center">
//               <div className="relative w-full max-w-2xl h-64 md:h-96">
//                 {/* Conteneur pour l'image */}
//                 <Image
//                   src="/orga.png"
//                   alt="Organigramme hiérarchique de l'Inspection EPST"
//                   layout="fill" // Permet à l'image de remplir le conteneur
//                   objectFit="contain" // S'assure que l'image est contenue dans le conteneur sans être coupée
//                   className="rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl"
//                 />
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* Pied de page */}
//         <footer className="w-full flex items-center justify-center border-t border-t-foreground/10 mx-auto text-center text-xs gap-8 py-16 text-muted-foreground">
//           <p>
//             Propulsé par{" "}
//             <a
//               href="#"
//               className="font-bold hover:underline text-primary"
//               rel="noreferrer"
//             >
//               saacTech
//             </a>
//           </p>
//         </footer>
//       </div>
//     </main>
//   );
// }
// app/page.tsx
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";
import Image from "next/image"; // Importation du composant Image de Next.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Barre de navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shadow-sm">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link
                href={"/"}
                className="text-lg font-bold text-primary-dark flex items-center gap-2"
              >
                {/* Logo EPST */}
                <Image
                  src="/epst.webp"
                  alt="Logo EPST"
                  width={40} // Largeur fixe pour le logo
                  height={40} // Hauteur fixe pour le logo
                  className="rounded-full object-cover"
                  priority // Chargement prioritaire pour le logo dans la nav
                />
                Inspection EPST
              </Link>
            </div>
            {/* Bouton d'authentification et avertissement */}
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Contenu principal de la page d'accueil */}
        <div className="flex-1 flex flex-col gap-10 max-w-5xl w-full p-5 md:p-10 lg:p-12">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-8 leading-tight">
            Bienvenue au Système de Contrôle du Cursus Scolaire EPST
          </h1>
          <Image
            src="/epst.webp"
            alt="Logo EPST"
            width={250} // Largeur fixe pour le logo
            height={250}
            className="rounded-full object-cover mx-auto"
            priority // Chargement prioritaire pour le logo dans la nav
          />
          {/* Section: Situation Géographique */}
          <section className="mb-12 border-l-4 border-primary-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Situation Géographique
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              L’inspection de l’EPST de Likasi se situe dans le bâtiment de la
              sous division LIKASI 1, ce bâtiment est délimité au nord par le
              complexe scolaire ¨MAPINDUZI au sud par l’avenue Jacaranda à l’est
              par le théâtre de la verdure MAPINDUZI et le boulevard KAMANYOLA à
              l’ouest par le terrain de foot MAPINDUZI et le boulevard de
              l’indépendance.
            </p>
          </section>

          {/* Section: Historique */}
          <section className="mb-12 border-l-4 border-secondary-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Historique de l&apos;Inspection de l&apos;EPST en RDC
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              L’Inspection de l’Enseignement en République Démocratique du Congo
              (RDC) est un organe clé du système éducatif, ayant évolué au fil
              du temps pour s’adapter aux réalités du pays.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Période coloniale (1908 – 1960):</strong>
              L’enseignement en RDC (ancien Congo belge) était sous le contrôle
              des missions religieuses, supervisées par les autorités
              coloniales. La première structure d’inspection était dirigée par
              des inspecteurs belges qui veillaient à l’application des
              programmes éducatifs coloniaux. L’éducation était limitée aux
              niveaux primaire et technique, avec peu d&apos;accès pour les
              Congolais à l’enseignement secondaire et supérieur.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>
                Indépendance et mise en place d’une inspection nationale (1960 –
                1970):
              </strong>
              près l’indépendance en 1960, le gouvernement congolais a repris le
              contrôle du système éducatif. L’Inspection de l’Enseignement a été
              instaurée pour garantir la qualité de l’éducation et veiller à
              l’application des réformes. En 1967, la réforme éducative de
              Mobutu a renforcé le rôle de l’inspection en instaurant une
              supervision plus centralisée de l’enseignement.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>
                La Zaïrianisation et réforme éducative (1971 – 1990):
              </strong>
              En 1971, la Zaïrianisation de l’éducation a conduit à la
              nationalisation des écoles, réduisant l’influence des missions
              religieuses. L’Inspection Générale de l’Enseignement (IGE) a été
              renforcée pour superviser les écoles publiques et privées. Des
              structures comme les Inspecteurs Principaux Provinciaux (IPP) et
              les Inspecteurs Sectionnaires (ISEC) ont été mises en place. La
              période de troubles politiques et économiques (1990 – 2000) a
              gravement affecté l’éducation. L’Inspection de l’Enseignement a
              souffert d’un manque de moyens, ce qui a réduit son efficacité. La
              prolifération d’écoles privées, souvent mal contrôlées, a posé des
              défis à l’inspection.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>
                Les Réformes et la modernisation (2000 – aujourd’hui):
              </strong>
              Avec les réformes du secteur éducatif initiées dans les années
              2000, l’Inspection de l’EPST a été restructurée. Il y a eu
              l&apos;introduction de nouvelles catégories d’inspecteurs, comme
              l’Inspecteur Itinérant et l’Inspecteur Exploitant, et
              l&apos;adoption de la gratuité de l’enseignement primaire (2019),
              nécessitant un renforcement du contrôle des établissements
              scolaires. On observe également l’intégration progressive des
              technologies pour améliorer le suivi des établissements et des
              enseignants.
            </p>
          </section>

          {/* Section: Présentation de l’organisation */}
          <section className="mb-12 border-l-4 border-accent-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Présentation de l&apos;Organisation
            </h2>
            <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                L&apos;organisation de l&apos;Inspection de l&apos;EPST est
                structurée autour de plusieurs niveaux de responsabilité :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>IGE (Inspecteur Général de l&apos;EPST):</strong>{" "}
                  L’inspecteur général est la plus haute autorité dans
                  l&apos;inspection de l&apos;enseignement en RDC. Il définit
                  les grandes orientations et politiques de contrôle de la
                  qualité éducative, et supervise l’ensemble des inspections sur
                  le territoire national.
                </li>
                <li>
                  <strong>IPP (Inspecteur Principal Provincial):</strong>{" "}
                  L’inspecteur principal provincial supervise l&apos;ensemble
                  des inspections dans une province. Il coordonne les activités
                  des inspecteurs et veille à l&apos;application des
                  instructions officielles, et rend compte au ministère de
                  l&apos;EPST de la situation de l&apos;éducation dans la
                  province.
                </li>
                <li>
                  <strong>INSPOOL (Inspecteur Chef de Pool):</strong>{" "}
                  L’inspecteur chef de pool coordonne les inspections au sein
                  d’un pool (un regroupement d’écoles ou d’établissements),
                  encadre les inspecteurs sous sa responsabilité et assure le
                  suivi des recommandations pédagogiques.
                </li>
                <li>
                  <strong>INS (Inspecteur Itinérant):</strong> L’inspecteur
                  itinérant se déplace régulièrement pour contrôler les
                  établissements scolaires. Il apporte un appui technique et
                  pédagogique aux enseignants dans plusieurs écoles.
                </li>
                <li>
                  <strong>IPRI (Inspecteur Pool Primaire):</strong> Il est
                  responsable du suivi pédagogique et administratif au niveau
                  des écoles primaires. Il assure la coordination des
                  inspections sous sa juridiction (inspecteur itinérant) et
                  contrôle la mise en œuvre des réformes et programmes
                  éducatifs.
                </li>
                <li>
                  <strong>ISEC (Inspecteur pool secondaire):</strong> Supervise
                  les établissements d&apos;un secteur scolaire spécifique dans
                  une province. Il évalue et contrôle les enseignants et les
                  élèves selon les programmes en vigueur.
                </li>
              </ul>
            </div>
            {/* Organigramme */}
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-2xl h-64 md:h-96">
                {/* Conteneur pour l'image */}
                <Image
                  src="/orga.png"
                  alt="Organigramme hiérarchique de l'Inspection EPST"
                  layout="fill" // Permet à l'image de remplir le conteneur
                  objectFit="contain" // S'assure que l'image est contenue dans le conteneur sans être coupée
                  className="rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl"
                />
              </div>
            </div>
          </section>

          {/* Nouvelle section pour la documentation API */}
          <section className="mb-12 border-l-4 border-purple-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Explorez nos API Publiques
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Nous mettons à disposition une série d&apos;API publiques pour
              faciliter l&apos;accès à certaines informations clés de notre
              système. Ces API sont conçues pour être facilement intégrées dans
              des applications tierces ou des outils d&apos;analyse de données.
              Aucune authentification n&apos;est requise pour ces endpoints.
            </p>
            <Link href="/api-test">
              <Button className="mt-4 px-6 py-3 text-lg font-semibold rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 m">
                Accéder au Testeur d&apos;API
              </Button>
            </Link>
          </section>
        </div>

        {/* Pied de page */}
        <footer className="w-full flex items-center justify-center border-t border-t-foreground/10 mx-auto text-center text-xs gap-8 py-16 text-muted-foreground">
          <p>
            Propulsé par{" "}
            <a
              href="#"
              className="font-bold hover:underline text-primary"
              rel="noreferrer"
            >
              saacTech
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

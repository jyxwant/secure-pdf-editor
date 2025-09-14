import React from 'react';
import { HomePage } from './HomePage';
import { SEOHead } from '../components/SEO/SEOHead';

interface FrenchPageProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
}

export function FrenchPage(props: FrenchPageProps) {
  return (
    <>
      <SEOHead 
        title="Éditeur PDF sécurisé - Outil de caviardage PDF professionnel | Traitement local"
        description="Outil gratuit de caviardage PDF et de protection de la confidentialité. Traitement 100% local dans le navigateur, aucune mise en ligne. Zones caviardées ou pixelisées, suppression définitive des données. Conforme GDPR/HIPAA."
        keywords="éditeur PDF,caviardage PDF,sécurité des documents,protection de la confidentialité,traitement local,GDPR,HIPAA"
        canonicalUrl="/fr"
        lang="fr"
        alternates={{ en: 'https://secureredact.tech/', zh: 'https://secureredact.tech/zh', fr: 'https://secureredact.tech/fr' }}
      />
      <HomePage {...props} withSEO={false} />
    </>
  );
}

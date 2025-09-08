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
        title="Éditeur PDF Sécurisé - Outil de Caviarité PDF Professionnel"
        description="Masquez en toute sécurité les informations sensibles, tout le traitement est effectué localement dans le navigateur. Support pour la caviarité de documents PDF et la protection de la confidentialité."
        keywords="éditeur PDF,caviarité PDF,sécurité document,protection confidentialité,traitement informations sensibles,traitement local"
        canonicalUrl="/fr"
      />
      <HomePage {...props} />
    </>
  );
}
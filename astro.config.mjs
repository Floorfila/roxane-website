// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://eterna-photo.com',
  // CSS intégré à la page : plus de fichier à attendre avant l'affichage (vitesse mobile).
  build: { inlineStylesheets: 'always' },
});

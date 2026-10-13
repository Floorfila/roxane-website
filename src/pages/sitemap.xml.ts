// Plan du site pour les moteurs de recherche : chaque page avec ses versions FR et EN.
// Ajouter ici toute nouvelle page.
const site = 'https://eterna-photo.com';
const pages: { fr: string; en: string }[] = [
  { fr: '/', en: '/en/' },
];

export function GET() {
  const links = (p: { fr: string; en: string }) =>
    `<xhtml:link rel="alternate" hreflang="fr" href="${site}${p.fr}"/>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${site}${p.en}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${site}${p.en}"/>`;
  const urls = pages
    .flatMap((p) => [p.fr, p.en].map((loc) => `  <url><loc>${site}${loc}</loc>${links(p)}</url>`))
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

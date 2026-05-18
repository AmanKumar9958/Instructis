import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useHead } from '@unhead/react';

const siteName = 'Instructis';
const siteOrigin = 'https://instructis.co.in';
const defaultDescription =
  'Personalised learning programs for Class 11-12, JEE and NEET with expert teachers, doubt sessions, and test series.';
const defaultImage = '/og-image.svg';
const defaultLocale = 'en_IN';

const toAbsoluteUrl = (origin, url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (!origin) return url;
  if (url.startsWith('/')) return `${origin}${url}`;
  return `${origin}/${url}`;
};

export default function Seo({
  title,
  description,
  image,
  noIndex = false,
  type = 'website',
  jsonLd
}) {
  const { pathname } = useLocation();
  const canonicalUrl = `${siteOrigin}${pathname}`;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const imageUrl = toAbsoluteUrl(siteOrigin, image || defaultImage);
  const robots = noIndex ? 'noindex,nofollow' : 'index,follow';

  const schemaItems = useMemo(() => {
    if (Array.isArray(jsonLd)) {
      return jsonLd;
    }
    if (jsonLd) {
      return [jsonLd];
    }
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        '@id': `${siteOrigin}#organization`,
        name: siteName,
        url: siteOrigin,
        description: metaDescription
      }
    ];
  }, [jsonLd, metaDescription]);

  useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: metaDescription },
      { name: 'robots', content: robots },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:locale', content: defaultLocale },
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: metaDescription },
      { name: 'twitter:image', content: imageUrl }
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: schemaItems.map((item, index) => ({
      key: `ld-json-${index}`,
      type: 'application/ld+json',
      children: JSON.stringify(item)
    }))
  });

  return null;
}

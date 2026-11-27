export const POSTS_QUERY = `
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    category,
    readingTime,
    coverImage
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    category,
    readingTime,
    coverImage,
    seo,
    body
  }
`;
// src/lib/sanity/queries.ts

export const POST_SEO_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    title,
    excerpt,
    publishedAt,
    category,
    coverImage,
    seo
  }
`;

export const POST_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()][]{
    "slug": slug.current,
    publishedAt,
    "updatedAt": _updatedAt
  }
`;
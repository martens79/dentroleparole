export const POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
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
  *[_type == "post" && slug.current == $slug][0] {
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
  *[_type == "post" && slug.current == $slug][0]{
    title,
    excerpt,
    publishedAt,
    category,
    coverImage,
    seo
  }
`;

export const POST_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current)][]{
    "slug": slug.current,
    publishedAt
  }
`;
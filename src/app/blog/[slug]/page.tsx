// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { publicClient } from "@/lib/sanity/publicClient";
import { urlFor } from "@/lib/sanity/image";
import { POST_BY_SLUG_QUERY, POST_SEO_BY_SLUG_QUERY } from "@/lib/sanity/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Post = {
  title: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  readingTime?: number;
  coverImage?: any;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
  };
  body?: any[];
};

const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 font-serif text-2xl md:text-3xl text-gold leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-serif text-xl md:text-2xl text-gold/90 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-5 text-ivory/90 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 rounded-3xl border border-gold/20 bg-midnight/55 backdrop-blur p-6 text-ivory/90">
        <div className="text-gold/90 font-semibold mb-2">Nota</div>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 list-disc pl-6 text-ivory/90 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal pl-6 text-ivory/90 space-y-2">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-ivory">{children}</strong>,
    em: ({ children }) => <em className="text-ivory/95">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-gold underline underline-offset-4 hover:opacity-90"
      >
        {children}
      </a>
    ),
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // guard: se arriva vuoto -> no index
  if (!slug) {
    return { title: "Articolo", robots: { index: false, follow: false } };
  }

  const data: Post | null = await publicClient.fetch(POST_SEO_BY_SLUG_QUERY, { slug });

  if (!data) {
    return { title: "Articolo non trovato", robots: { index: false, follow: false } };
  }

  const title = data?.seo?.metaTitle || data.title;
  const description = data?.seo?.metaDescription || data.excerpt || "";
  const canonical = `${SITE_URL}/blog/${slug}`;

  const ogSource = data?.seo?.ogImage || data.coverImage;
  const ogImage = ogSource
    ? urlFor(ogSource).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) return notFound();

  const post: Post | null = await publicClient.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) return notFound();

  return (
    <main className="min-h-screen text-ivory">
      {/* sfondi come home */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      {/* contenuto */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        {/* breadcrumb */}
        <div className="text-xs tracking-[0.18em] uppercase text-ivory/65">
          <Link href="/blog" className="hover:text-ivory transition">
            Blog
          </Link>
          <span className="mx-2 text-ivory/35">/</span>
          <span className="text-ivory/55">Articolo</span>
        </div>

        {/* header articolo */}
        <div className="mt-6 rounded-3xl border border-gold/25 bg-midnight/65 backdrop-blur p-8 hover:border-gold/45 transition">
          {/* cover */}
          {post.coverImage ? (
            <div className="mb-6 overflow-hidden rounded-3xl border border-gold/20">
              <Image
                src={urlFor(post.coverImage).width(1600).height(900).fit("crop").url()}
                alt={post.coverImage?.alt || post.title}
                width={1600}
                height={900}
                className="h-56 md:h-72 w-full object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="text-xs tracking-[0.18em] uppercase text-ivory/65">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("it-IT") : ""}
            {post.category ? ` • ${post.category}` : ""}
            {typeof post.readingTime === "number" ? ` • ${post.readingTime} min` : ""}
          </div>

          <h1 className="mt-3 font-serif text-3xl md:text-5xl text-gold leading-tight">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-5 text-ivory/90 text-lg leading-relaxed">{post.excerpt}</p>
          ) : null}
        </div>

        {/* corpo */}
        <article className="mt-10 rounded-3xl border border-gold/20 bg-midnight/55 backdrop-blur p-8 md:p-10">
          {post.body ? <PortableText value={post.body} components={ptComponents} /> : null}
        </article>

        {/* CTA finale */}
        <div className="mt-12 rounded-3xl border border-gold/25 bg-midnight/60 backdrop-blur p-8">
          <div className="text-gold font-semibold text-lg">Vuoi un parere sul tuo testo?</div>
          <p className="mt-2 text-ivory/85">
            Se hai un romanzo o un racconto in lavorazione, puoi richiedere una valutazione
            dell’estratto (5–10 pagine) per capire direzione e priorità di intervento.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/#contatti"
              className="btn-shine rounded-2xl bg-gold text-night px-5 py-3 text-sm font-semibold shadow-glow transition hover:opacity-95"
            >
              Richiedi una valutazione
            </a>

            <Link
              href="/blog"
              className="rounded-2xl border border-gold/25 bg-night/20 px-5 py-3 text-sm text-ivory/85 hover:text-ivory hover:border-gold/45 transition"
            >
              Torna al blog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
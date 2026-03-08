import Link from "next/link";
import Image from "next/image";
import { publicClient } from "@/lib/sanity/publicClient";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  readingTime?: number;
  coverImage?: any;
};

export default async function BlogPage() {
  const posts: Post[] = await publicClient.fetch(POSTS_QUERY);

  return (
    <main className="min-h-screen text-ivory">
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-serif text-gold">Blog</h1>

        <p className="mt-3 max-w-prose text-ivory/85">
          Scrittura, editing e pubblicazione: risorse pratiche per autori.
        </p>

        {posts.length === 0 && (
          <div className="mt-10 rounded-3xl border border-gold/25 bg-midnight/60 p-6 text-ivory/80 backdrop-blur">
            Nessun articolo pubblicato ancora.
            <br />
            Vai su <span className="text-gold">/studio</span> per crearne uno.
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((p) => {
            const imageUrl = p.coverImage?.asset
              ? urlFor(p.coverImage).width(1200).height(700).fit("crop").url()
              : null;

            return (
              <Link
                key={p._id}
                href={`/blog/${p.slug}`}
                className="group rounded-3xl border border-gold/35 bg-midnight/70 p-6 backdrop-blur transition hover:border-gold/60"
              >
                {imageUrl && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-gold/20">
                    <Image
                      src={imageUrl}
                      alt={p.coverImage?.alt || p.title}
                      width={1200}
                      height={700}
                      className="h-44 w-full object-cover opacity-95 transition group-hover:opacity-100"
                    />
                  </div>
                )}

                <div className="text-xs uppercase tracking-[0.18em] text-ivory/70">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("it-IT") : ""}
                  {p.category ? ` • ${p.category}` : ""}
                  {typeof p.readingTime === "number" ? ` • ${p.readingTime} min` : ""}
                </div>

                <h2 className="mt-2 text-xl font-semibold text-gold">
                  {p.title}
                </h2>

                {p.excerpt ? (
                  <p className="mt-3 text-ivory/90">{p.excerpt}</p>
                ) : null}

                <div className="mt-4 text-sm text-gold">
                  Leggi →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
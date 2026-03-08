import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Articoli",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Scrittura", value: "scrittura" },
          { title: "Editing", value: "editing" },
          { title: "Pubblicazione", value: "pubblicazione" },
          { title: "Fantasy", value: "fantasy" },
          { title: "Self publishing", value: "self-publishing" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Estratto",
      type: "text",
      rows: 3,
      description: "Breve descrizione (usata in lista blog e come base SEO).",
      validation: (Rule) => Rule.max(220),
    }),

    defineField({
      name: "publishedAt",
      title: "Data pubblicazione",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverImage",
      title: "Immagine copertina",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Testo alternativo",
          type: "string",
          description: "SEO + accessibilità (descrivi l’immagine in modo semplice).",
        }),
      ],
    }),

    defineField({
      name: "readingTime",
      title: "Tempo di lettura (min)",
      type: "number",
      description: "Es: 4 (minuti). Puoi lasciarlo vuoto e calcolarlo dopo.",
      validation: (Rule) => Rule.min(1).max(60),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "string",
          description: "Se vuoto, usiamo il Titolo.",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "text",
          rows: 2,
          description: "Se vuoto, usiamo l’Estratto.",
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "OG image (social)",
          type: "image",
          description: "Opzionale. Se vuoto, usiamo la copertina.",
          options: { hotspot: true },
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    defineField({
      name: "body",
      title: "Contenuto",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "coverImage",
      date: "publishedAt",
      category: "category",
    },
    prepare({ title, media, date, category }) {
      const d = date ? new Date(date).toLocaleDateString("it-IT") : "";
      const cat = category ? String(category) : "";
      return {
        title,
        media,
        subtitle: [cat, d].filter(Boolean).join(" • "),
      };
    },
  },
});
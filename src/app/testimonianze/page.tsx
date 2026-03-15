export default function TestimonianzePage() {
  const testimonials = [
    {
      quote:
        "Mi ritengo fortunata ad averti incontrata. Non sei solo un editor brava, attenta e precisa, ma molto di più. Sono orgogliosa del lavoro che abbiamo fatto insieme.",
      author: "Silvia De Santis",
      role: "Autrice",
    },
    {
      quote:
        "Ti ringrazio per la delicatezza con cui ti sei occupata del mio libro e per la bellissima persona che sei.",
      author: "Olimpia Rausa",
      role: "Autrice",
    },
    {
      quote:
        "Il libro ha raggiunto 110 copie vendute e ho ricevuto molti commenti positivi. Grazie per il tuo aiuto.",
      author: "Simone Squaiella",
      role: "Autore",
    },
    {
      quote:
        "Grazie per il supporto sul testo e per aver accompagnato questo libro con grande cura.",
      author: "Daniele Di Stefano",
      role: "Autore",
    },
    {
      quote:
        "Sono molto soddisfatto del lavoro svolto. Anche questa seconda correzione di bozze è stata precisa e accurata.",
      author: "Giovanni Neri",
      role: "Autore",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-gold/20 bg-midnight/40 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-ivory/70">
          Testimonianze
        </span>

        <h1 className="mt-6 font-serif text-4xl leading-tight text-gold md:text-5xl">
          Dicono del mio lavoro
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-ivory/78">
          Nel tempo ho ricevuto parole di stima, messaggi di gratitudine e
          riscontri sinceri da parte di autrici e autori con cui ho lavorato.
          Qui ne raccolgo alcuni.
        </p>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        {testimonials.map((item) => (
          <article
            key={`${item.author}-${item.quote.slice(0, 20)}`}
            className="rounded-[2rem] border border-gold/20 bg-midnight/55 p-7 backdrop-blur"
          >
            <p className="font-serif text-3xl leading-none text-gold/70">“</p>

            <blockquote className="mt-3 text-lg leading-relaxed text-ivory/88">
              {item.quote}
            </blockquote>

            <div className="mt-6 border-t border-gold/10 pt-4">
              <p className="text-base font-medium text-ivory">{item.author}</p>
              <p className="mt-1 text-sm text-ivory/60">{item.role}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
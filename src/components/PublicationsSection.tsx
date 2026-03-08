import PublicationRow from "@/components/PublicationRow";
import { publications } from "@/data/publications";

export default function PublicationsSection() {
  return (
    <section className="mt-6">
      <div className="overflow-hidden rounded-3xl border border-gold/20 bg-midnight/45 backdrop-blur">
        <div className="divide-y divide-gold/10">
          {publications.map((p) => (
            <PublicationRow key={p.title + p.year} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
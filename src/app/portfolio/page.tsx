import Section from "@/components/Section";
import PortfolioSection from "@/components/PortfolioSection";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen text-ivory">
      {/* sfondi come home / chi sono */}
      <div className="bg-fixed-sky" />
      <div className="bg-fixed-fantasy" />

      <div className="relative z-10 px-6 pt-24 pb-20">
        <Section
          id="portfolio-page"
          title="Portfolio"
          subtitle="Una selezione di progetti editoriali seguiti con cura e metodo."
        >
          <PortfolioSection />
        </Section>
      </div>
    </main>
  );
}
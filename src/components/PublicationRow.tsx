import type { PublicationItem as Publication } from "@/data/publications";

export default function PublicationRow({ p }: { p: Publication }) {
  return (
    <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div>{p.title}</div>

      {p.amazonUrl && (
        <a
          href={p.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "10px 14px",
            background: "white",
            color: "black",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          TEST AMAZON
        </a>
      )}
    </div>
  );
}
import React from "react";

export default function PremiumBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="group rounded-3xl border border-gold/25 bg-midnight/55 backdrop-blur p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.16)]">
      {children}
    </div>
  );
}
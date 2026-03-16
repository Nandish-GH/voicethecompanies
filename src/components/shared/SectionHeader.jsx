import React from "react";

export default function SectionHeader({ label, title, description, align = "center" }) {
  return (
    <div className={`max-w-2xl mb-16 md:mb-20 ${align === "center" ? "mx-auto text-center" : ""}`}>
      {label && (
        <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-3">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[#6B6B6B] text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
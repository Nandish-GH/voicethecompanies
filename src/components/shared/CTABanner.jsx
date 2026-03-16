import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

export default function CTABanner({
  title = "Ready to Make an Impact?",
  description = "Whether you're a student looking for experience or a business ready to go digital, we'd love to hear from you.",
  buttonText = "Get Involved",
  buttonPage = "GetInvolved",
}) {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
          {title}
        </h2>
        <p className="mt-4 text-[#6B6B6B] text-lg max-w-2xl mx-auto">
          {description}
        </p>
        <Link
          to={createPageUrl(buttonPage)}
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#B2C9AD]/25 hover:shadow-xl text-base"
        >
          {buttonText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
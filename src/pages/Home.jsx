import React from "react";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import PillarsSection from "../components/home/PillarsSection";
import StatsSection from "../components/home/StatsSection";
import TestimonialsPreview from "../components/home/TestimonialsPreview";
import CTABanner from "../components/shared/CTABanner";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <PillarsSection />
      <StatsSection />
      <TestimonialsPreview />
      <CTABanner />
    </div>
  );
}
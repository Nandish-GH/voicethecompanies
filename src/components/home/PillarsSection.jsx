import React from "react";
import { Settings, BookOpen, Heart, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  {
    icon: Settings,
    title: "Structure & Operations",
    description: "Student teams operate with defined roles across project management, web design, development, and content creation for professional results.",
    color: "#B2C9AD",
  },
  {
    icon: BookOpen,
    title: "Education & Sustainability",
    description: "Our Digital Literacy Curriculum equips business owners with video tutorials, written guides, and ongoing workshops to stay current.",
    color: "#8FAF88",
  },
  {
    icon: Heart,
    title: "Community & Funding",
    description: "Supported by grants focused on digital equity, small business development, and youth education, alongside local tech mentors.",
    color: "#B2C9AD",
  },
  {
    icon: BarChart3,
    title: "Impact Tracking",
    description: "We measure website traffic growth, social media engagement, and publish results alongside testimonials to demonstrate community impact.",
    color: "#8FAF88",
  },
];

export default function PillarsSection() {
  return (
    <section className="py-24 md:py-32 bg-white" aria-labelledby="pillars-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-3">
            What We Stand For
          </p>
          <h2 id="pillars-heading" className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
            Our Four Pillars
          </h2>
          <p className="mt-4 text-[#6B6B6B] text-lg">
            Everything we do is guided by these core principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-5 p-8 rounded-2xl border border-gray-100 hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-lg group bg-white"
            >
              <div className="flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: `${pillar.color}20` }}
                >
                  <pillar.icon
                    className="w-6 h-6"
                    style={{ color: pillar.color }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">{pillar.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
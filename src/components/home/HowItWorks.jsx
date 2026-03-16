import React from "react";
import { ClipboardList, Users, Code, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Business Applies",
    description: "A local small business submits a request for digital services through our simple application process.",
  },
  {
    icon: Users,
    number: "02",
    title: "Team Assigned",
    description: "A student team with defined roles in design, development, and content is matched to the business.",
  },
  {
    icon: Code,
    number: "03",
    title: "Website Built",
    description: "The team conducts a needs assessment and builds a professional website and social media presence.",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Business Trained",
    description: "Owners receive digital literacy training and ongoing workshops to manage their platforms independently.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="how-it-works-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-3">
            Our Process
          </p>
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-[#6B6B6B] text-lg">
            From application to launch, here is how we bring small businesses online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#EDF3EB] group-hover:bg-[#B2C9AD] flex items-center justify-center transition-colors duration-300">
                    <step.icon className="w-5 h-5 text-[#8FAF88] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  <span className="text-3xl font-bold text-[#D4E4D0]">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-[#D4E4D0]" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
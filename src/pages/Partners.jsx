import React from "react";
import { motion } from "framer-motion";
import { Handshake, GraduationCap, Building2, Heart, Mail } from "lucide-react";
import ContactForm from "../components/forms/ContactForm";

const partnerTypes = [
  {
    icon: GraduationCap,
    title: "Technology Mentors",
    description: "Experienced developers, designers, and digital marketers who volunteer their time to guide student teams and ensure high-quality deliverables.",
  },
  {
    icon: Building2,
    title: "Business Partners",
    description: "Local organizations and chambers of commerce that help us identify businesses in need of digital services and amplify our reach.",
  },
  {
    icon: Heart,
    title: "Grant Funders",
    description: "Foundations and institutions focused on digital equity, small business development, and youth education that make our work possible.",
  },
];

export default function Partners() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="partners-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#B2C9AD]/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                Community & Partners
              </p>
              <h1 id="partners-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Built on{" "}
                <span className="text-[#8FAF88]">community partnerships</span>
              </h1>
              <p className="mt-4 text-lg text-[#6B6B6B] max-w-xl">
                Our mission succeeds because of the mentors, funders, and community organizations who believe in digital equity and youth empowerment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mentorship Section */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="mentorship-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
                </div>
                <h2 id="mentorship-heading" className="text-2xl font-bold text-[#2D2D2D]">Our Mentors</h2>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed">
                Local technology professionals serve as mentors to our student teams, providing guidance on
                best practices, code reviews, design feedback, and professional development. Their involvement
                lends credibility to our mission and ensures every business receives a high-quality digital presence.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mt-4">
                Mentors typically commit a few hours per month and can work with teams remotely or in person.
                It's a meaningful way to give back to the community while helping shape the next generation of
                technology professionals.
              </p>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6">
                {partnerTypes.map((type, index) => (
                  <motion.div
                    key={type.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-lg bg-[#FAFAF8] group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-[#B2C9AD] flex items-center justify-center transition-colors duration-300 border border-gray-100">
                        <type.icon className="w-5 h-5 text-[#8FAF88] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2D2D2D] mb-1">{type.title}</h3>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">{type.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]" aria-labelledby="contact-heading">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl bg-[#EDF3EB] flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
            </div>
            <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
              Get in Touch
            </h2>
            <p className="mt-4 text-[#6B6B6B] text-lg">
              Interested in partnering, mentoring, donating, or just learning more? We'd love to hear from you.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
{ name: "Home", page: "Home" },
{ name: "About", page: "About" },
{ name: "Get Involved", page: "GetInvolved" },
{ name: "Impact", page: "Impact" },
{ name: "Partners", page: "Partners" }];

const programLinks = [
{ name: "Digital Literacy Curriculum", page: "DigitalLiteracy" },
{ name: "Needs Assessment", page: "NeedsAssessment" },
{ name: "Follow-Up Workshops", page: "Workshops" },
{ name: "Student Teams", page: "StudentTeams" },
{ name: "Measurable Outcomes", page: "MeasurableOutcomes" },
{ name: "My Business Dashboard", page: "BusinessDashboard" }];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPageName]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ?
        "bg-white/95 backdrop-blur-md shadow-sm" :
        "bg-transparent"}`
        }>

        <nav className="max-w-7xl mx-auto px-6 lg:px-8" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2.5 group"
              aria-label="Go to homepage">

              <img
                src={logoSrc}
                alt="Voice the Companies logo"
                className="w-9 h-9 rounded-xl object-cover transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-bold tracking-tight text-[#2D2D2D]">Voice the Companies

              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPageName === link.page ?
                "text-[#2D2D2D] bg-[#EDF3EB]" :
                "text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8]"}`
                }>

                  {link.name}
                </Link>
              )}
              {/* Program dropdown */}
              <div className="relative group">
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                programLinks.some((l) => l.page === currentPageName) ?
                "text-[#2D2D2D] bg-[#EDF3EB]" :
                "text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8]"}`
                }>
                  Program
                  <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {programLinks.map((link) =>
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                    currentPageName === link.page ?
                    "text-[#2D2D2D] bg-[#EDF3EB]" :
                    "text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8]"}`
                    }>

                      {link.name}
                    </Link>
                  )}
                </div>
              </div>
              <Link
                to={createPageUrl("GetInvolved")}
                className="ml-3 px-5 py-2.5 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">

                Join Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#EDF3EB] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}>

              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen &&
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden">

              <div className="px-6 py-4 space-y-1">
                {[...navLinks, ...programLinks].map((link) =>
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                currentPageName === link.page ?
                "text-[#2D2D2D] bg-[#EDF3EB]" :
                "text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8]"}`
                }>

                    {link.name}
                  </Link>
              )}
                <Link
                to={createPageUrl("GetInvolved")}
                className="block text-center mt-3 px-5 py-3 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-colors">

                  Join Us
                </Link>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src={logoSrc}
                  alt="Voice the Companies logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-lg font-bold">Voice the Companies</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Connecting students with small businesses to build professional digital presences
                and create lasting community impact.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Pages</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) =>
                <li key={link.page}>
                    <Link to={createPageUrl(link.page)} className="text-sm text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Program</h4>
              <ul className="space-y-2.5">
                {programLinks.map((link) =>
                <li key={link.page}>
                    <Link to={createPageUrl(link.page)} className="text-sm text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Get Started</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to={createPageUrl("GetInvolved")} className="text-sm text-gray-300 hover:text-white transition-colors">
                    Student Application
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("GetInvolved")} className="text-sm text-gray-300 hover:text-white transition-colors">
                    Business Request
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Partners")} className="text-sm text-gray-300 hover:text-white transition-colors">
                    Become a Mentor
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Voice the Companies. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Building digital equity, one business at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>);

}
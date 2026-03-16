import React, { useState } from "react";
import { localClient } from "@/api/localClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const demoNames = ["Taylor Morgan", "Jordan Lee", "Riley Chen", "Casey Patel", "Avery Nguyen"];
const demoInquiryTypes = ["general", "partnership", "mentorship", "donation", "media"];
const demoSubjects = [
  "Partnership inquiry",
  "Mentorship opportunities",
  "Local business support request",
  "Press and media question",
  "Community collaboration",
];
const demoMessages = [
  "I would like to discuss a local mentorship partnership for this summer.",
  "Our organization wants to collaborate on digital literacy workshops.",
  "Can we set up a short call to talk about support options for small businesses?",
  "I am interested in learning how we can sponsor student project teams.",
  "Please share next steps for getting involved as a community partner.",
];
const DEMO_EMAIL = "2009nandish@gmail.com";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "", inquiry_type: "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

  const fillDemoData = () => {
    const name = randomItem(demoNames);

    setForm({
      name,
      email: DEMO_EMAIL,
      subject: randomItem(demoSubjects),
      message: randomItem(demoMessages),
      inquiry_type: randomItem(demoInquiryTypes),
    });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await localClient.entities.ContactInquiry.create(form);
      await localClient.integrations.Core.SendEmail({
        to: "2009nandish@gmail.com",
        subject: `New Contact Inquiry: ${form.subject || "General Inquiry"}`,
        body: `A new contact inquiry was submitted.\n\nName: ${form.name}\nEmail: ${form.email}\nInquiry Type: ${form.inquiry_type}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error?.message || "Unable to send email right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#EDF3EB] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#8FAF88]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Message Sent!</h3>
        <p className="text-[#6B6B6B]">We appreciate you reaching out. We'll respond within 2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name *</Label>
          <Input id="contact-name" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input id="contact-email" type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="contact-type">Inquiry Type</Label>
          <Select value={form.inquiry_type} onValueChange={(v) => handleChange("inquiry_type", v)}>
            <SelectTrigger id="contact-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="mentorship">Mentorship</SelectItem>
              <SelectItem value="donation">Donation</SelectItem>
              <SelectItem value="media">Media</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input id="contact-subject" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} placeholder="Subject of your inquiry" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea id="contact-message" required value={form.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="How can we help?" rows={5} />
      </div>
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <Button
        type="button"
        variant="outline"
        onClick={fillDemoData}
        disabled={submitting}
        className="w-full"
      >
        Fill Demo Data
      </Button>
      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold py-3 rounded-xl h-12"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
      </Button>
    </form>
  );
}
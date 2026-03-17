// @ts-nocheck
import React, { useState } from "react";
import { localClient } from "@/api/localClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const demoBusinessNames = ["Sunrise Cafe", "Maple Street Salon", "Cornerstone Auto", "Bloom & Vine", "Luna Fitness"];
const demoOwnerNames = ["Avery Patel", "Jordan Kim", "Sam Rivera", "Taylor Morgan", "Casey Johnson"];
const demoBusinessTypes = ["Cafe", "Salon", "Auto Repair", "Retail", "Fitness Studio"];
const demoServices = [
  "Website setup, local SEO basics, and social media profile optimization.",
  "Landing page redesign, booking integration, and Google Business Profile updates.",
  "Content planning, analytics setup, and monthly performance dashboard support.",
  "Online menu or catalog page with contact form and SEO improvements.",
];
const demoAdditionalInfo = [
  "We are opening a second location in two months.",
  "Most customers find us by word of mouth and we want better online visibility.",
  "We want to start posting consistently but need a repeatable process.",
  "Our busiest season starts soon and we need updates before then.",
];
const DEMO_EMAIL = "voicethecompanies@gmail.com";

export default function BusinessForm() {
  const [form, setForm] = useState({
    business_name: "", owner_name: "", email: "", phone: "",
    business_type: "", website_exists: false, services_needed: "", additional_info: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
  const randomDigits = (length) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

  const fillDemoData = () => {
    const businessName = randomItem(demoBusinessNames);
    const ownerName = randomItem(demoOwnerNames);
    const businessType = randomItem(demoBusinessTypes);

    setForm({
      business_name: businessName,
      owner_name: ownerName,
      email: DEMO_EMAIL,
      phone: `(555) ${randomDigits(3)}-${randomDigits(4)}`,
      business_type: businessType,
      website_exists: Math.random() > 0.5,
      services_needed: randomItem(demoServices),
      additional_info: randomItem(demoAdditionalInfo),
    });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await localClient.entities.BusinessRequest.create(form);
      await localClient.integrations.Core.SendEmail({
        to: "voicethecompanies@gmail.com",
        subject: `New Business Request: ${form.business_name}`,
        body: `A new business service request was submitted.\n\nBusiness: ${form.business_name}\nOwner: ${form.owner_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness Type: ${form.business_type}\nHas Website: ${form.website_exists ? "Yes" : "No"}\n\nServices Needed:\n${form.services_needed}\n\nAdditional Info:\n${form.additional_info}`,
      });
      await localClient.integrations.Core.SendProfitJourneyEmails({
        to: form.email,
        ownerName: form.owner_name,
        businessName: form.business_name,
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
        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Request Submitted!</h3>
        <p className="text-[#6B6B6B]">Thank you for reaching out. We'll contact you shortly to discuss next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="biz-name">Business Name *</Label>
          <Input id="biz-name" required value={form.business_name} onChange={(e) => handleChange("business_name", e.target.value)} placeholder="Your business name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-name">Owner Name *</Label>
          <Input id="owner-name" required value={form.owner_name} onChange={(e) => handleChange("owner_name", e.target.value)} placeholder="Your full name" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="biz-email">Email *</Label>
          <Input id="biz-email" type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@business.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="biz-phone">Phone</Label>
          <Input id="biz-phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="(555) 123-4567" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="biz-type">Business Type</Label>
          <Input id="biz-type" value={form.business_type} onChange={(e) => handleChange("business_type", e.target.value)} placeholder="e.g. Restaurant, Salon, Retail" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="biz-website">Current Website?</Label>
          <Select value={form.website_exists ? "yes" : "no"} onValueChange={(v) => handleChange("website_exists", v === "yes")}>
            <SelectTrigger id="biz-website"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No, I don't have one</SelectItem>
              <SelectItem value="yes">Yes, but it needs work</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="biz-services">Services Needed</Label>
        <Textarea id="biz-services" value={form.services_needed} onChange={(e) => handleChange("services_needed", e.target.value)} placeholder="Tell us what you're looking for (website, social media, both?)" rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="biz-additional">Additional Information</Label>
        <Textarea id="biz-additional" value={form.additional_info} onChange={(e) => handleChange("additional_info", e.target.value)} placeholder="Anything else you'd like us to know" rows={3} />
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
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
      </Button>
    </form>
  );
}
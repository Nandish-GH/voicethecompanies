import React, { useState } from "react";
import { localClient } from "@/api/localClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function BusinessForm() {
  const [form, setForm] = useState({
    business_name: "", owner_name: "", email: "", phone: "",
    business_type: "", website_exists: false, services_needed: "", additional_info: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitWarning("");
    try {
      await localClient.entities.BusinessRequest.create(form);
      const emailResult = await localClient.integrations.Core.SendEmail({
        to: "voicethecompanies@gmail.com",
        subject: `New Business Request: ${form.business_name}`,
        body: `A new business service request was submitted.\n\nBusiness: ${form.business_name}\nOwner: ${form.owner_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness Type: ${form.business_type}\nHas Website: ${form.website_exists ? "Yes" : "No"}\n\nServices Needed:\n${form.services_needed}\n\nAdditional Info:\n${form.additional_info}`,
      });
      if (!emailResult?.success) {
        setSubmitWarning("Your request was received, but email notifications are temporarily unavailable. Please also email voicethecompanies@gmail.com.");
      }
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
        {submitWarning && <p className="text-sm text-amber-700 mt-3">{submitWarning}</p>}
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
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold py-3 rounded-xl h-12"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
      </Button>
    </form>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Heart } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#EDF3EB] flex items-center justify-center mx-auto mb-6">
          <Heart className="w-7 h-7 text-[#B2C9AD]" />
        </div>
        <h1 className="text-6xl font-extrabold text-[#2D2D2D] mb-4">404</h1>
        <p className="text-lg text-[#6B6B6B] mb-8">
          Sorry, we couldn't find the page you're looking for. Let's get you back on track.
        </p>
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
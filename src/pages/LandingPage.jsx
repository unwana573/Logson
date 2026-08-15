import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCards from "../components/FeatureCards";
import CommunitySlider from "../components/CommunitySlider";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="w-full">
      <Navbar />
      <Hero />
      <FeatureCards />
      <CommunitySlider />
      <Footer />
    </div>
  );
}

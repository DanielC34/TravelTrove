import React from "react";
import Navbar from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import UserActionAnalytics from "@/components/analytics/UserActionAnalytics";

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MobileNav />

      <main className="flex-1 pt-24 pb-16 md:pt-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <UserActionAnalytics />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;

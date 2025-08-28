import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientSection from "./components/ClientSection";

const Index = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login"); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-blue-50">
      {/* Header Bar */}
      <div className="w-full border-b border-white/20 bg-gradient-to-r from-black/90 via-purple-900 to-purple-700 backdrop-blur-md sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center px-10 py-6">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Customer Rent Management
          </h1>
        </div>
      </div>

      {/* Client-side Section */}
      <ClientSection />
    </div>
  );
};

export default Index;

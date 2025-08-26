"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CustomerRentForm } from "./components/CustomerRentForm";

const Index = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-blue-50">
      {/* Header Bar */}
      <div className="w-full border-b border-white/20 bg-gradient-to-r from-black/90 via-purple-900 to-purple-700 backdrop-blur-md sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center px-10 py-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Customer Rent Management
            </h1>
          </div>

          {/* Button on extreme right */}
          <div>
            <button
              onClick={() => router.push("/customers")}
              className="px-4 py-3 bg-gradient-to-l from-blue-200 via-blue-300 to-blue-200 
             text-blue-900 font-bold rounded-xl shadow-lg
             transition duration-300 ease-in-out cursor-pointer
             transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
            >
              View Customers
            </button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="w-full flex items-center justify-center p-6">
        <div
          className="w-full max-w-6xl rounded-2xl p-8 space-y-10"
        >
          {/* Form */}
          <div className="space-y-6">
            <CustomerRentForm
              onCustomerAdded={(customer) => {
                console.log("Customer Added:", customer);
              }}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/40" />
        </div>
      </div>
    </div>

  );
};

export default Index;

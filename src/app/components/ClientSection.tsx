"use client";

import { useRouter } from "next/navigation";
import { CustomerRentForm } from "./CustomerRentForm";
import { signOut } from "next-auth/react"; // ✅ import from next-auth

export default function ClientSection() {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="w-full max-w-6xl rounded-2xl p-8 space-y-10">
        
        {/* Buttons Row */}
        <div className="flex justify-end gap-4">
          {/* View Customers */}
          <button
            onClick={() => router.push("/customers")}
            className="px-4 py-2 bg-gradient-to-l from-blue-600 via-blue-600 to-blue-800 
             text-white font-bold rounded-sm shadow-lg
             transition duration-300 ease-in-out cursor-pointer
             transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
          >
            View Customers
          </button>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })} // ✅ proper logout
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-red-600 to-red-700
             text-white font-bold rounded-sm shadow-lg
             transition duration-300 ease-in-out cursor-pointer
             transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <CustomerRentForm
            onCustomerAdded={(customer) => {
              console.log("Customer Added:", customer);
            }}
          />
        </div>
      </div>
    </div>
  );
}

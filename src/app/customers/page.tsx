import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { CustomerRentList } from "../components/CustomerRentList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ensure fresh data fetching

export default async function CustomersPage() {
  await connectDB();
  const customers = await Customer.find().lean();

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login"); // If not logged in, go to login
  }

  async function deleteCustomer(id: string) {
    "use server";
    await connectDB();
    await Customer.findByIdAndDelete(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl mb-6 font-extrabold tracking-tight bg-clip-text text-black drop-shadow-sm flex-shrink-0">
            ALL CUSTOMERS
          </h1>
          {/* Buttons */}
          <div className="flex gap-4 flex-shrink-0">
            {/* Go Home Button */}
            <Button
              asChild
              className="rounded-xl shadow-lg px-5 sm:px-6 py-3 bg-gradient-to-l from-purple-800 to-purple-600 hover:from-purple-800 hover:to-gray-900 transition transform hover:scale-105"
            >
              <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
                <span className="text-3xl font-bold">←</span> Go to Home
              </Link>
            </Button>

            {/* Add Customer Button */}
            <Button
              asChild
              className="rounded-xl shadow-lg px-5 sm:px-6 py-3 bg-gradient-to-r from-purple-800 to-purple-500 hover:from-purple-800 hover:to-gray-900 transition transform hover:scale-105"
            >
              <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
                <span className="text-3xl font-bold">+</span> Add Customer
              </Link>
            </Button>
          </div>
        </div>
        
        {customers && customers.length > 0 ? (
          <CustomerRentList
            customers={JSON.parse(JSON.stringify(customers))}
            onDeleteCustomer={deleteCustomer}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <svg
              className="w-20 h-20 text-purple-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>

            <p className="text-2xl font-semibold text-gray-700">
              No customers added yet
            </p>
            <p className="text-gray-400">
              Start by adding your first customer to get going 🚀
            </p>
            <Button
              asChild
              className="mt-4 rounded-3xl shadow-lg px-6 py-3 bg-gradient-to-r from-purple-700 to-black hover:from-purple-800 hover:to-gray-900 transition transform hover:scale-105"
            >
              <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
                <span className="text-2xl font-bold">+</span> Add Customer
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

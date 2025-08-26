import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { CustomerRentList } from "../components/CustomerRentList"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic"; // ensure fresh data fetching

export default async function CustomersPage() {
  await connectDB();
  const customers = await Customer.find().lean();

  async function deleteCustomer(id: string) {
    "use server";
    await connectDB();
    await Customer.findByIdAndDelete(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            All Customers
          </h1>

          {/* ✅ Use Link instead of useNavigate */}
          <Button asChild className="rounded-2xl shadow-md px-4 py-2">
            <Link href="/"><span className="text-bold text-2xl">←</span> Go to Home</Link>
          </Button>
        </div>

        {customers && customers.length > 0 ? (
          <CustomerRentList
            customers={JSON.parse(JSON.stringify(customers))}
            onDeleteCustomer={deleteCustomer}
          />
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No customers added yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

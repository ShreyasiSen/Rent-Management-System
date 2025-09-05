// app/customer/[id]/page.tsx
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "../.././api/auth/[...nextauth]/route";

import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  IndianRupee,
} from "lucide-react";

// ✅ keep dates as string
type CustomerType = {
  _id: string;
  name: string;
  phoneNumber: string;
  aadharNumber: string;
  address: string;
  currentRent: number;
  advancedMoney: number;
  previousIncrementDate: string; // 👈 string instead of Date
  startingRent: number;
  increasePercentage: number;
  yearsOfEngagement: number;
  yearsUntilIncrease: number;
  reminderDate: string;          // 👈 string instead of Date
  __v: number;
};

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const result = await Customer.findById(id).lean();
  const rawCustomer: CustomerType | null =
    result && !Array.isArray(result) ? (result as CustomerType) : null;

  if (!rawCustomer) return notFound();

  // ⬇️ Use your same increment logic here
  const calculateNextIncrement = (customer: CustomerType) => {
    const nextIncrementDate = new Date(customer.previousIncrementDate);
    nextIncrementDate.setFullYear(
      nextIncrementDate.getFullYear() + customer.yearsUntilIncrease
    );

    const today = new Date();

    if (today >= nextIncrementDate) {
      const newRent =
        customer.currentRent +
        (customer.currentRent * customer.increasePercentage) / 100;

      return {
        ...customer,
        currentRent: newRent,
        previousIncrementDate: nextIncrementDate.toISOString(), // store as string
        reminderDate: nextIncrementDate.toISOString(),
      };
    }
    return customer;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  // ✅ Apply logic here so view always shows updated info
  const customer = calculateNextIncrement(rawCustomer);

  // helper for "new rent" preview (without updating currentRent yet)
  const calculateNewRent = (currentRent: number, percentage: number) => {
    return currentRent + (currentRent * percentage) / 100;
  };

  const isIncrementToday = (customer: CustomerType) => {
    const today = new Date();
    const lastIncrement = new Date(customer.previousIncrementDate);

    // Compare only the date part (ignore time)
    return (
      lastIncrement.getFullYear() === today.getFullYear() &&
      lastIncrement.getMonth() === today.getMonth() &&
      lastIncrement.getDate() === today.getDate()
    );
  };


  const isReminderDue = (customer: CustomerType) => {
    const today = new Date();
    const reminder = new Date(customer.previousIncrementDate);
    reminder.setFullYear(reminder.getFullYear() + customer.yearsUntilIncrease);
    return reminder <= today;
  };

  const isReminderWithin3Days = (customer: CustomerType) => {
    const today = new Date();

    const nextIncrement = new Date(customer.previousIncrementDate);
    nextIncrement.setFullYear(nextIncrement.getFullYear() + customer.yearsUntilIncrease);

    const diffTime = nextIncrement.getTime() - today.getTime();

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 3;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="flex items-center text-2xl gap-2 text-purple-700 hover:text-purple-900 transition"
        >
          <Link href="/customers">
            <ArrowLeft className="h-5 w-5 text-2xl" />
            Back to Customers
          </Link>
        </Button>
        <div>
          {/* Reminder Badge */}
              {isReminderDue(customer) && (
                <Badge variant="destructive" className="px-3 py-1 text-sm font-semibold bg-red-500 text-white shadow-sm">
                  Reminder Due
                </Badge>
              )}

              {!isReminderDue(customer) && isReminderWithin3Days(customer) && (
                <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-yellow-400 text-black shadow-sm">
                  Increment Soon
                </Badge>
              )}

              {isIncrementToday(customer) && (
                <Badge className="px-3 py-1 text-sm font-semibold bg-green-500 text-white shadow-sm">
                  Today is Increment Day
                </Badge>
              )}
        </div>
        
        {/* Customer Card */}
        <Card className="rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-2 font-bold text-gray-900">
                <User className="h-6 w-6 text-purple-600" />
                {customer.name}
              </CardTitle>
              {/* <Button
                variant="outline"
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <Bell className="h-5 w-5" />
                Send Reminder
              </Button> */}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 bg-white rounded-b-3xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-gray-600">Phone Number</p>
                  <p className="text-gray-800 font-semibold">
                    {customer.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-gray-600">Aadhar Number</p>
                  <p className="text-gray-800 font-semibold">
                    {customer.aadharNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-purple-400 mt-1" />
              <div>
                <p className="font-medium text-gray-600">Address</p>
                <p className="text-gray-800 font-semibold">{customer.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial + Engagement */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 font-semibold text-lg">
                <IndianRupee className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white rounded-b-3xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 uppercase text-xs tracking-wide">
                    Starting Rent
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{customer.startingRent}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs tracking-wide">
                    Current Rent
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{customer.currentRent}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 uppercase text-xs tracking-wide">
                    Increase Rate
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {customer.increasePercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs tracking-wide">
                    Next Rent
                  </p>
                  <p className="text-xl font-semibold text-purple-600">
                    ₹
                    {calculateNewRent(
                      customer.currentRent,
                      customer.increasePercentage
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 font-semibold text-lg">
                <Calendar className="h-5 w-5" />
                Engagement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white rounded-b-3xl p-6">
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-wide">
                  Starting Year of Engagement
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  Year {customer.yearsOfEngagement}
                </p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-wide">
                  Years Until Increase
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {customer.yearsUntilIncrease} years
                </p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs tracking-wide">
                  Previous Increment Date (yyyy-mm-dd)
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatDate(customer.previousIncrementDate)}
                </p>
              </div>
              {/* <div>
                <p className="text-gray-500 uppercase text-xs tracking-wide">
                  Reminder Date
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(customer.reminderDate).toLocaleDateString()}
                </p>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

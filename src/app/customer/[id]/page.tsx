// app/customer/[id]/page.tsx
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bell,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
} from "lucide-react";

type CustomerType = {
  _id: string;
  name: string;
  phoneNumber: string;
  aadharNumber: string;
  address: string;
  currentRent: number;
  advancedMoney: number;
  increasePercentage: number;
  yearsOfEngagement: number;
  yearsUntilIncrease: number;
  reminderDate: string;
  __v: number;
};

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 params is a Promise
}) {
  const { id } = await params; // 👈 Await it here
  await connectDB();

  const result = await Customer.findById(id).lean();
  const customer: CustomerType | null =
    result && !Array.isArray(result) ? (result as CustomerType) : null;

  if (!customer) return notFound();

  const calculateNewRent = (currentRent: number, percentage: number) => {
    return currentRent + (currentRent * percentage) / 100;
  };

  const isReminderDue = (reminderDate: string) => {
    const today = new Date();
    const reminder = new Date(reminderDate);
    return reminder <= today;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Link>
        </Button>

        {isReminderDue(customer.reminderDate) && (
          <Badge variant="destructive">Reminder Due</Badge>
        )}

        {/* Customer Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                {customer.name}
              </CardTitle>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-muted-foreground">{customer.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Aadhar Number</p>
                  <p className="text-muted-foreground">{customer.aadharNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">{customer.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial + Engagement */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-muted-foreground">Current Rent</p>
                  <p className="text-2xl font-bold">₹{customer.currentRent}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Advanced Money</p>
                  <p className="text-2xl font-bold">₹{customer.advancedMoney}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-muted-foreground">Increase Rate</p>
                  <p className="text-xl font-semibold">
                    {customer.increasePercentage}%
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">New Rent</p>
                  <p className="text-xl font-semibold text-primary">
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Engagement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-muted-foreground">
                  Years of Engagement
                </p>
                <p className="text-2xl font-bold">
                  {customer.yearsOfEngagement} years
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Years Until Increase
                </p>
                <p className="text-xl font-semibold">
                  {customer.yearsUntilIncrease} years
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Reminder Date</p>
                <p className="text-lg">
                  {new Date(customer.reminderDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

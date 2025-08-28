"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Trash2} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { ObjectId } from "mongoose";

interface Customer {
  _id?: ObjectId;
  name: string;
  phoneNumber: string;
  address: string;
  aadharNumber: string;
  yearsOfEngagement: number;
  advancedMoney: number;
  currentRent: number;
  increasePercentage: number;
  yearsUntilIncrease: number;
  reminderDate: string;
}

interface CustomerRentListProps {
  customers: Customer[];
  onDeleteCustomer: (id: string) => void;
}

export const CustomerRentList: React.FC<CustomerRentListProps> = ({
  customers,
  onDeleteCustomer
}) => {
  const router = useRouter();
  const [localCustomers, setLocalCustomers] = useState(customers); // ✅ local state

  const calculateNewRent = (currentRent: number, percentage: number) => {
    return currentRent + (currentRent * percentage / 100);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const isReminderDue = (reminderDate: string) => {
    const today = new Date();
    const reminder = new Date(reminderDate);
    return reminder <= today;
  };

  // const handleReminder = (customer: Customer) => {
  //   toast("Rent Increase Reminder", {
  //     description: `Time to increase ${customer.name}'s rent from ₹${customer.currentRent} to ₹${calculateNewRent(customer.currentRent, customer.increasePercentage).toFixed(2)}`,
  //   });
  // };

  const handleDelete = (id: string) => {
    setLocalCustomers((prev) => prev.filter((c) => c._id?.toString() !== id));
    onDeleteCustomer(id);
    toast("🗑️ Customer Deleted", {
      description: "Customer has been removed successfully.",
    });
  };

  if (localCustomers.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No customers added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {localCustomers.map((customer) => (
        <div
          key={customer._id?.toString()}
          className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transition-transform transform hover:-translate-y-1"
          onClick={() => router.push(`/customer/${customer?._id}`)}
        >
          {/* Gradient Top Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black via-purple-500 to-black"></div>

          <CardContent className="p-6 md:p-8 bg-white">
            <div className="flex items-center justify-between gap-2">
              {/* Customer Name */}
              <h2 className="text-2xl md:text-3xl font-bold text-purple-900 flex-1">
                {customer.name}
              </h2>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {isReminderDue(customer.reminderDate) && (
                  <Badge
                    variant="destructive"
                    className="py-1 px-3 text-sm md:text-base font-semibold"
                  >
                    Reminder Due
                  </Badge>
                )}

                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 md:p-4 rounded-xl hover:bg-purple-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReminder(customer);
                  }}
                >
                  <Bell className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                </Button> */}

                <Button
                  variant="ghost"
                  size="lg"
                  className="p-2 md:p-4 rounded-xl hover:bg-red-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomerId(customer._id?.toString() || null);
                    setIsModalOpen(true); // open modal
                  }}
                >
                  <Trash2 className="h-8 w-8 md:h-8 md:w-8 text-red-600" />
                </Button>

              </div>
            </div>

            {/* Rent Info */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-2xl">
              <div>
                <p className="text-lg text-black uppercase">Current Rent</p>
                <p className="text-lg font-semibold text-gray-800">₹{customer.currentRent}</p>
              </div>
              <div>
                <p className="text-lg text-black uppercase">Increase</p>
                <p className="text-lg font-semibold text-gray-800">{customer.increasePercentage}%</p>
              </div>
              <div>
                <p className="text-lg text-black uppercase">New Rent</p>
                <p className="text-lg font-bold text-purple-600">
                  ₹{calculateNewRent(customer.currentRent, customer.increasePercentage).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-lg text-black uppercase">Years / Reminder</p>
                <p className="text-lg font-semibold text-gray-800">{customer.yearsUntilIncrease} yr</p>
                <p className="text-xs text-gray-500 mt-1">{customer.reminderDate}</p>
              </div>
            </div>
          </CardContent>

          {/* Subtle hover animation overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl pointer-events-none"></div>
        </div>
      ))}
      {isModalOpen && selectedCustomerId && (
        <div className="fixed inset-0 z-80 flex items-center justify-center  bg-opacity-40 backdrop-blur-lg">
          <div className="bg-gradient-to-bl from-purple-100 via-purple-200 to-purple-300 rounded-2xl p-6 w-80 md:w-96 shadow-2xl space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Confirm Delete?</h2>
            <p className="text-black text-xl ">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                className="bg-gray-100 text-gray-800 rounded-lg text-xl px-4 py-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 text-white text-xl rounded-lg px-4 py-4 cursor-pointer hover:bg-red-600"
                onClick={() => {
                  handleDelete(selectedCustomerId);
                  setIsModalOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Trash2, Bell } from 'lucide-react';
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

  const isReminderDue = (reminderDate: string) => {
    const today = new Date();
    const reminder = new Date(reminderDate);
    return reminder <= today;
  };

  const handleReminder = (customer: Customer) => {
    toast("Rent Increase Reminder", {
      description: `Time to increase ${customer.name}'s rent from ₹${customer.currentRent} to ₹${calculateNewRent(customer.currentRent, customer.increasePercentage).toFixed(2)}`,
    });
  };

  const handleDelete = (id: string) => {
    // remove from UI instantly
    setLocalCustomers((prev) => prev.filter((c) => c._id?.toString() !== id));
    // call parent delete (which updates DB)
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
    <div className="space-y-4">
      {localCustomers.map((customer) => (
        <Card 
          key={customer._id?.toString()} 
          className="w-full cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => router.push(`/customer/${customer?._id}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{customer.name}</CardTitle>
              <div className="flex items-center gap-2">
                {isReminderDue(customer.reminderDate) && (
                  <Badge variant="destructive">Reminder Due</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReminder(customer);
                  }}
                >
                  <Bell className="h-4 w-4 cursor-pointer" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customer._id) {
                      handleDelete(customer._id.toString()); 
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 cursor-pointer" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Current Rent</p>
                <p className="text-lg font-semibold">₹{customer.currentRent}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Increase</p>
                <p className="text-lg font-semibold">{customer.increasePercentage}%</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">New Rent</p>
                <p className="text-lg font-semibold text-primary">
                  ₹{calculateNewRent(customer.currentRent, customer.increasePercentage).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Years/Reminder</p>
                <p className="text-lg font-semibold">{customer.yearsUntilIncrease} yr</p>
                <p className="text-xs text-muted-foreground">{customer.reminderDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

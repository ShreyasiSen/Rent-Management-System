"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
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
  const [localCustomers, setLocalCustomers] = useState(customers);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

  const calculateNewRent = (currentRent: number, percentage: number) =>
    currentRent + (currentRent * percentage / 100);

  const isReminderDue = (reminderDate: string) => {
    const today = new Date();
    const reminder = new Date(reminderDate);
    return reminder <= today;
  };

  const handleDelete = (id: string) => {
    setLocalCustomers((prev) => prev.filter((c) => c._id?.toString() !== id));
    onDeleteCustomer(id);
    toast("🗑️ Customer Deleted", {
      description: "Customer has been removed successfully.",
    });
  };

  const handleEditSave = async () => {
    if (!editForm._id) return;

    const res = await fetch(`/api/customers/${editForm._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      const updated = await res.json();
      setLocalCustomers((prev) =>
        prev.map((c) => (c._id?.toString() === updated._id ? updated : c))
      );
      toast("✅ Customer Updated", {
        description: `${updated.name}'s info has been saved.`,
      });
      setIsEditModalOpen(false);
    } else {
      toast("❌ Failed to update", { description: "Please try again." });
    }
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
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black via-purple-500 to-black"></div>

          <CardContent className="p-6 md:p-8 bg-white">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-900 flex-1">
                {customer.name}
              </h2>

              <div className="flex items-center gap-4">
                {isReminderDue(customer.reminderDate) && (
                  <Badge
                    variant="destructive"
                    className="py-1 px-3 text-sm md:text-base font-semibold"
                  >
                    Reminder Due
                  </Badge>
                )}

                {/* Edit button */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="p-2 md:p-4 rounded-xl hover:bg-blue-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditForm(customer);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Pencil className="h-8 w-8 text-blue-600" />
                </Button>

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="p-2 md:p-4 rounded-xl hover:bg-red-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomerId(customer._id?.toString() || null);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="h-8 w-8 text-red-600" />
                </Button>
              </div>
            </div>

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

          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl pointer-events-none"></div>
        </div>
      ))}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedCustomerId && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-lg">
          <div className="bg-gradient-to-bl from-purple-100 via-purple-200 to-purple-300 rounded-2xl p-6 w-80 md:w-96 shadow-2xl space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Confirm Delete?</h2>
            <p className="text-black text-xl">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-100 text-gray-800 rounded-lg text-xl px-4 py-2 hover:bg-gray-200">
                Cancel
              </Button>
              <Button onClick={() => { handleDelete(selectedCustomerId); setIsDeleteModalOpen(false); }} className="bg-red-500 text-white text-xl rounded-lg px-4 py-2 hover:bg-red-600">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 backdrop-blur-lg">
          <div className="bg-gradient-to-bl from-white to-purple-100 rounded-2xl p-6 w-[90%] md:w-[600px] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-purple-800">Edit Customer</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  className="w-full border p-2 rounded-lg"
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Customer Name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input
                  className="w-full border p-2 rounded-lg"
                  value={editForm.phoneNumber || ""}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                  className="w-full border p-2 rounded-lg"
                  value={editForm.address || ""}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Address"
                />
              </div>

              {/* Aadhar Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Aadhar Number</label>
                <input
                  className="w-full border p-2 rounded-lg"
                  value={editForm.aadharNumber || ""}
                  onChange={(e) => setEditForm({ ...editForm, aadharNumber: e.target.value })}
                  placeholder="Aadhar Number"
                />
              </div>

              {/* Years of Engagement */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Years of Engagement</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  value={editForm.yearsOfEngagement || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, yearsOfEngagement: Number(e.target.value) })
                  }
                  placeholder="Years of Engagement"
                />
              </div>

              {/* Advanced Money */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Advanced Money</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  value={editForm.advancedMoney || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, advancedMoney: Number(e.target.value) })
                  }
                  placeholder="Advanced Money"
                />
              </div>

              {/* Current Rent */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Current Rent (₹)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  value={editForm.currentRent || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, currentRent: Number(e.target.value) })
                  }
                  placeholder="Current Rent"
                />
              </div>

              {/* Increase % */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Increase Percentage (%)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  value={editForm.increasePercentage || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, increasePercentage: Number(e.target.value) })
                  }
                  placeholder="Increase %"
                />
              </div>

              {/* Years Until Increase */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Years Until Next Increase</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  value={editForm.yearsUntilIncrease || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, yearsUntilIncrease: Number(e.target.value) })
                  }
                  placeholder="Years Until Next Increase"
                />
              </div>

              {/* Reminder Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Reminder Date</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded-lg"
                  value={editForm.reminderDate || ""}
                  onChange={(e) => setEditForm({ ...editForm, reminderDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-100 text-gray-800 rounded-lg text-lg px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                className="bg-green-500 text-white text-lg rounded-lg px-4 py-2 hover:bg-green-600 cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

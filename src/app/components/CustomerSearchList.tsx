"use client";

import { useState, useEffect } from "react";
import { CustomerRentList } from "./CustomerRentList";
import { ObjectId } from "mongoose";

interface Customer {
  _id: ObjectId;
  name: string;
  phoneNumber: string;
  address: string;
  aadharNumber: string;
  yearsOfEngagement: number;
  currentRent: number;
  increasePercentage: number;
  startingRent: number;
  previousIncrementDate: string;
  previousRent: number;
  advancedMoney: number;
  yearsUntilIncrease: number;
  reminderDate: string;
}

export default function CustomerSearchList({
  onDeleteCustomer,
}: {
  onDeleteCustomer: (id: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await fetch(`/api/customers/search?q=${query}`);
      const data = await res.json();
      setCustomers(data);
      setLoading(false);
    };

    const timeout = setTimeout(fetchCustomers, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 outline-none"
        />
      </div>

      {/* Customer List */}
      {loading ? (
        <p className="text-center text-gray-500">Searching...</p>
      ) : customers.length > 0 ? (
        <CustomerRentList customers={customers} onDeleteCustomer={onDeleteCustomer} />
      ) : (
        <p className="text-center text-gray-500 text-lg">No customers found</p>
      )}
    </div>
  );
}

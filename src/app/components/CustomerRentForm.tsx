"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Toaster } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { toast } from "sonner";

// ✅ Validation Schema
const customerSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  aadharNumber: z.string().length(12, "Aadhar number must be 12 digits"),
  yearsOfEngagement: z.number().min(0, "Years of engagement must be positive"),
  advancedMoney: z.number().min(0, "Advanced money must be positive"),
  currentRent: z.number().min(0, "Rent must be positive"),
  increasePercentage: z
    .number()
    .min(0)
    .max(100, "Percentage must be between 0-100"),
  yearsUntilIncrease: z.number().min(1, "Years must be at least 1"),
  reminderDate: z.string().min(1, "Reminder date is required"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerRentFormProps {
  onCustomerAdded: (customer: CustomerFormData & { id: string }) => void;
}

export const CustomerRentForm: React.FC<CustomerRentFormProps> = ({
  onCustomerAdded,
}) => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
      aadharNumber: "",
      yearsOfEngagement: 0,
      advancedMoney: 0,
      currentRent: 0,
      increasePercentage: 0,
      yearsUntilIncrease: 1,
      reminderDate: "",
    },
  });

 const onSubmit = async (data: CustomerFormData) => {
  try {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to save customer");

    const savedCustomer = await res.json();

    onCustomerAdded(savedCustomer); // pass saved customer back
    form.reset();

    toast.success("Customer Added", {
      description: `${savedCustomer.name} has been added successfully.`,
    });
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to add customer", {
      description: "Something went wrong. Please try again.",
    });
  }
};


  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl shadow-accent-foreground rounded-xl 
                border border-white/20 
                bg-gradient-to-br from-white/10 via-white/5 to-transparent 
                backdrop-blur-xl">
      <CardHeader className="text-center pb-2 pt-4">
        <CardTitle className="text-4xl font-bold text-purple-800 tracking-tight drop-shadow-sm">
          Add Customer Rent Details
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          Fill in the details below to register a new customer
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
          >
            {/* Left Column */}
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700">Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 9876543210"
                        {...field}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street"
                        {...field}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700">Aadhar Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="XXXX-XXXX-XXXX"
                        {...field}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="yearsOfEngagement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-600">Years of Engagement</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="advancedMoney"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-600">Advanced Money (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-600">Current Rent (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="increasePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-600">Increase Percentage (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsUntilIncrease"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-600">Years Until Increase</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reminderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-600">Reminder Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-12 rounded-lg border-gray-200 bg-white/70 backdrop-blur-sm 
                               focus:border-blue-600 focus:ring-2 focus:ring-blue-400/50 
                               transition-all shadow-sm text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-4 flex justify-center">
              <Button
                type="submit"
                className="flex items-center gap-2 px-8 py-6 text-lg font-semibold 
                       bg-gradient-to-r from-blue-600 to-indigo-600 
                       hover:from-blue-700 hover:to-indigo-700
                       text-white rounded-xl shadow-lg 
                       transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Add Customer
              </Button>
               <Toaster />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

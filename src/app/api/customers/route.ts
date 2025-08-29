import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";
import { CustomerBackup } from "@/models/Customer";

// GET all customers
export async function GET() {
  await connectDB();
  const customers = await Customer.find();
  return NextResponse.json(customers);
}

// POST new customer
export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const newCustomer = await Customer.create(data);
  await CustomerBackup.create({...data,_id: newCustomer._id,originalId: newCustomer._id});
  return NextResponse.json(newCustomer);
}

// DELETE customer
export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

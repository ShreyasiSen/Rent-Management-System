import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Customer.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Customer deleted" });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
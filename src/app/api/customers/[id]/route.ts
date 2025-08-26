import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function DELETE(
  req: Request,
  context: { params: { id: string } } // ✅ context object
) {
  await connectDB();
  const { id } = context.params; // ✅ extract id
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({ message: "Customer deleted" });
}

export async function GET(
  req: Request,
  context: { params: { id: string } } // ✅ context object
) {
  try {
    await connectDB();
    const { id } = context.params; // ✅ extract id
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

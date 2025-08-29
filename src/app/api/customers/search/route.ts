import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  const customers = await Customer.find({
    name: { $regex: query, $options: "i" }, 
  }).lean();

  return NextResponse.json(customers);
}

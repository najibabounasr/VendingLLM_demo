import { NextResponse } from "next/server";
import { purchase } from "../../../lib/products.ts";

export async function POST(req: Request) {
  const { items } = await req.json(); // [{id, quantity}]
  const updated = await purchase(items);
  return NextResponse.json({ success: true, products: updated });
}
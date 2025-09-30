import { NextResponse } from "next/server";
import { getProducts } from "../../lib/products.ts"

export async function GET() {
  const data = await getProducts();
  return NextResponse.json({ products: data });
}

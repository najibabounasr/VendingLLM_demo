// import { supabaseServer } from "./supabaseServer";
import {supabaseClient} from "./supabaseClient";

export async function getProducts() {
  const { data, error } = await supabaseClient.from("products").select("*").order("id");
  if (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseClient.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

/** Decrement stock atomically for a single item */
export async function decrementStock(id: string, qty: number) {
  const { data, error } = await supabaseClient.rpc("decrement_stock", { p_id: id, p_qty: qty });
  if (error) throw error;
  return data; // returns updated row or true per your RPC
}


// for purchasing items in bulk, should basically bulk decrement stock.
export async function purchase(items: { id?: string; name?: string; quantity: number }[]) {
  const { error } = await supabaseClient.rpc("decrement_stock_bulk", { // calls an sql function. 
    p_items: items,
  });
  if (error) throw error;

  return await getProducts();
}



export async function insertProduct(p: { id: string; name: string; price: number; stock: number }) {
  const { data, error } = await supabaseClient.from("products").insert(p).select().single();
  if (error) throw error;
  return data;
}


// Update fields (name, price, stock, etc.)
export async function updateProduct(id: string, fields: Partial<{ name: string; price: number; stock: number }>) {
  const { data, error } = await supabaseClient.from("products").update(fields).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

// Delete a product
export async function deleteProduct(id: string) {
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

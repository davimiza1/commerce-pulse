"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function addProduct(formData: FormData) {
  const { supabase } = await authenticatedClient();
  const { error } = await supabase.from("products").insert({
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    category: String(formData.get("category") ?? ""),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await authenticatedClient();
  const { error } = await supabase.from("products").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/products");
}

export async function addCustomer(formData: FormData) {
  const { supabase } = await authenticatedClient();
  const { error } = await supabase.from("customers").insert({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/customers");
}

export async function deleteCustomer(formData: FormData) {
  const { supabase } = await authenticatedClient();
  const { error } = await supabase.from("customers").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/customers");
}

export async function addOrder(formData: FormData) {
  const { supabase } = await authenticatedClient();
  const productId = String(formData.get("product_id"));
  const quantity = Number(formData.get("quantity"));
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("price")
    .eq("id", productId)
    .single();

  if (productError) throw new Error(productError.message);

  const { error } = await supabase.from("orders").insert({
    order_number: `CP-${Date.now().toString().slice(-6)}`,
    customer_id: String(formData.get("customer_id")),
    product_id: productId,
    quantity,
    total: Number(product.price) * quantity,
    status: String(formData.get("status") ?? "Processing"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/payments");
}

export async function updateOrderStatus(formData: FormData) {
  const { supabase } = await authenticatedClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: String(formData.get("status")) })
    .eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/payments");
}

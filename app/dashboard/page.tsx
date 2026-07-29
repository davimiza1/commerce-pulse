import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: orderData }, { count: customers = 0 }, { count: products = 0 }] = await Promise.all([
    supabase.from("orders").select("total, status"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);
  const orders = orderData ?? [];
  const paidOrders = orders.filter((order) => order.status === "Paid");
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);

  return <Dashboard stats={{ revenue, orders: orders.length, customers: customers ?? 0, products: products ?? 0 }} />;
}

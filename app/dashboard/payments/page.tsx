import DataShell from "../DataShell";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("id, order_number, total, status, created_at").order("created_at", { ascending: false });
  const orders = data ?? [];
  const paid = orders.filter((order) => order.status === "Paid");
  const refunded = orders.filter((order) => order.status === "Refunded");
  const revenue = paid.reduce((sum, order) => sum + Number(order.total), 0);
  const refundTotal = refunded.reduce((sum, order) => sum + Number(order.total), 0);

  return <DataShell title="Payments" description="Monitor paid, processing, and refunded order totals.">
    <section className="payment-metrics"><article><span>Collected revenue</span><strong>${revenue.toFixed(2)}</strong></article><article><span>Paid orders</span><strong>{paid.length}</strong></article><article><span>Refunded</span><strong>${refundTotal.toFixed(2)}</strong></article></section>
    <article className="data-card data-list-card payment-list"><div className="data-card-head"><h2>Payment activity</h2><span>{orders.length} transactions</span></div>{orders.length === 0 ? <p className="empty-state">No payment activity yet.</p> : orders.map((order) => <div className="data-row" key={order.id}><div><strong>#{order.order_number}</strong><small>{new Date(order.created_at).toLocaleDateString()}</small></div><strong>${Number(order.total).toFixed(2)}</strong><span className={`payment-status ${order.status.toLowerCase()}`}>{order.status}</span></div>)}</article>
  </DataShell>;
}

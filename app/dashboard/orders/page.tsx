import DataShell from "../DataShell";
import { addOrder, updateOrderStatus } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();
  const [{ data: ordersData }, { data: customersData }, { data: productsData }] = await Promise.all([
    supabase.from("orders").select("*, customers(name), products(name, sku)").order("created_at", { ascending: false }),
    supabase.from("customers").select("id, name").order("name"),
    supabase.from("products").select("id, name, price").order("name"),
  ]);
  const orders = ordersData ?? [];
  const customers = customersData ?? [];
  const products = productsData ?? [];

  return <DataShell title="Orders" description="Create orders and update their payment status.">
    <section className="data-stack">
      <form action={addOrder} className="data-card data-form order-form">
        <h2>Create order</h2>
        <label>Customer<select name="customer_id" required><option value="">Choose customer</option>{customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label>
        <label>Product<select name="product_id" required><option value="">Choose product</option>{products.map((product) => <option value={product.id} key={product.id}>{product.name} — ${Number(product.price).toFixed(2)}</option>)}</select></label>
        <label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required /></label>
        <label>Status<select name="status"><option>Processing</option><option>Paid</option><option>Refunded</option></select></label>
        <button type="submit" disabled={!customers.length || !products.length}>Create order</button>
        {(!customers.length || !products.length) && <small>Add at least one customer and product before creating an order.</small>}
      </form>
      <article className="data-card data-list-card"><div className="data-card-head"><h2>All orders</h2><span>{orders.length} orders</span></div>
        {orders.length === 0 ? <p className="empty-state">No orders yet.</p> : orders.map((order) => <div className="data-row order-data-row" key={order.id}><div><strong>#{order.order_number}</strong><small>{order.customers?.name} · {order.products?.name}</small></div><span>{order.quantity} item{order.quantity === 1 ? "" : "s"}</span><strong>${Number(order.total).toFixed(2)}</strong><form action={updateOrderStatus}><input type="hidden" name="id" value={order.id} /><select name="status" defaultValue={order.status}><option>Processing</option><option>Paid</option><option>Refunded</option></select><button>Update</button></form></div>)}
      </article>
    </section>
  </DataShell>;
}

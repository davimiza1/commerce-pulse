import DataShell from "../DataShell";
import { addCustomer, deleteCustomer } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  const customers = data ?? [];

  return <DataShell title="Customers" description="Create and manage the customers connected to your orders.">
    <section className="data-grid">
      <form action={addCustomer} className="data-card data-form">
        <h2>Add customer</h2>
        <label>Full name<input name="name" placeholder="Amelia Stone" required /></label>
        <label>Email address<input name="email" type="email" placeholder="amelia@example.com" required /></label>
        <button type="submit">Save customer</button>
      </form>
      <article className="data-card data-list-card"><div className="data-card-head"><h2>Customer directory</h2><span>{customers.length} customers</span></div>
        {customers.length === 0 ? <p className="empty-state">No customers yet. Add your first customer.</p> : customers.map((customer) => <div className="data-row customer-data-row" key={customer.id}><div className="data-avatar">{customer.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2)}</div><div><strong>{customer.name}</strong><small>{customer.email}</small></div><form action={deleteCustomer}><input type="hidden" name="id" value={customer.id} /><button className="danger">Delete</button></form></div>)}
      </article>
    </section>
  </DataShell>;
}

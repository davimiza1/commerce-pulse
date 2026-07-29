import DataShell from "../DataShell";
import { addProduct, deleteProduct } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const products = data ?? [];

  return <DataShell title="Products" description="Add products and manage prices and stock levels.">
    <section className="data-grid">
      <form action={addProduct} className="data-card data-form">
        <h2>Add product</h2>
        <label>Product name<input name="name" placeholder="Everyday Overshirt" required /></label>
        <div className="form-row"><label>SKU<input name="sku" placeholder="APP-1042" required /></label><label>Category<input name="category" placeholder="Apparel" required /></label></div>
        <div className="form-row"><label>Price<input name="price" type="number" min="0" step="0.01" placeholder="80.00" required /></label><label>Stock<input name="stock" type="number" min="0" placeholder="25" required /></label></div>
        <button type="submit">Save product</button>
      </form>
      <article className="data-card data-list-card"><div className="data-card-head"><h2>Product catalog</h2><span>{products.length} products</span></div>
        {products.length === 0 ? <p className="empty-state">No products yet. Add your first product.</p> : products.map((product) => <div className="data-row" key={product.id}><div><strong>{product.name}</strong><small>{product.sku} · {product.category}</small></div><span>${Number(product.price).toFixed(2)}</span><span>{product.stock} in stock</span><form action={deleteProduct}><input type="hidden" name="id" value={product.id} /><button className="danger">Delete</button></form></div>)}
      </article>
    </section>
  </DataShell>;
}

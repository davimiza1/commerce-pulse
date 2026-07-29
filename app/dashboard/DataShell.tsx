"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CreditCard, LayoutDashboard, LogOut, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
];

export default function DataShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="data-workspace">
      <aside className="data-sidebar">
        <Link className="data-brand" href="/dashboard"><span><TrendingUp size={18} /></span>Commerce<strong>Pulse</strong></Link>
        <nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><Icon size={17} />{label}</Link>)}</nav>
        <button onClick={logout}><LogOut size={16} />Sign out</button>
      </aside>
      <section className="data-main">
        <header><div><span><BarChart3 size={14} /> Live workspace</span><h1>{title}</h1><p>{description}</p></div></header>
        {children}
      </section>
    </main>
  );
}

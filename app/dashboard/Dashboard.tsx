"use client";

import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Box, CalendarDays,
  ChevronDown, CircleDollarSign, CreditCard, Download, LayoutDashboard,
  LogOut, Menu, Moon, PackageCheck, Search, Settings, ShoppingBag, Sparkles, Sun,
  TrendingUp, Users, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

type Range = "7 days" | "30 days" | "90 days";
type Category = "All categories" | "Apparel" | "Accessories" | "Footwear";

const datasets: Record<Range, { day: string; revenue: number; orders: number }[]> = {
  "7 days": [
    { day: "Mon", revenue: 7200, orders: 92 }, { day: "Tue", revenue: 9400, orders: 118 },
    { day: "Wed", revenue: 8100, orders: 104 }, { day: "Thu", revenue: 12800, orders: 151 },
    { day: "Fri", revenue: 11700, orders: 140 }, { day: "Sat", revenue: 15200, orders: 176 },
    { day: "Sun", revenue: 13900, orders: 162 },
  ],
  "30 days": [
    { day: "Jul 1", revenue: 21600, orders: 258 }, { day: "Jul 5", revenue: 27400, orders: 321 },
    { day: "Jul 10", revenue: 24100, orders: 296 }, { day: "Jul 15", revenue: 32800, orders: 385 },
    { day: "Jul 20", revenue: 29700, orders: 348 }, { day: "Jul 25", revenue: 38200, orders: 436 },
    { day: "Jul 29", revenue: 35900, orders: 407 },
  ],
  "90 days": [
    { day: "May", revenue: 68200, orders: 812 }, { day: "May 15", revenue: 74100, orders: 864 },
    { day: "Jun", revenue: 82300, orders: 938 }, { day: "Jun 15", revenue: 79600, orders: 904 },
    { day: "Jul", revenue: 91400, orders: 1054 }, { day: "Jul 15", revenue: 103200, orders: 1176 },
    { day: "Now", revenue: 97800, orders: 1121 },
  ],
};

const products = [
  { name: "Everyday Overshirt", sku: "APP-1042", category: "Apparel", sales: 342, revenue: "$27,360", stock: 26, color: "#d8b89b" },
  { name: "Studio Carryall", sku: "ACC-2088", category: "Accessories", sales: 289, revenue: "$23,120", stock: 9, color: "#9cb5a8" },
  { name: "Cloud Runner", sku: "FTW-3014", category: "Footwear", sales: 214, revenue: "$19,260", stock: 14, color: "#a8acc8" },
  { name: "Ribbed Essential Tee", sku: "APP-1167", category: "Apparel", sales: 198, revenue: "$9,504", stock: 47, color: "#c6b69f" },
];

const orders = [
  { id: "#CP-10483", customer: "Amelia Stone", initials: "AS", product: "Everyday Overshirt", total: "$160.00", status: "Paid", date: "Jul 29, 2026" },
  { id: "#CP-10482", customer: "Liam Chen", initials: "LC", product: "Studio Carryall", total: "$124.00", status: "Processing", date: "Jul 29, 2026" },
  { id: "#CP-10481", customer: "Nora Adams", initials: "NA", product: "Cloud Runner", total: "$180.00", status: "Paid", date: "Jul 28, 2026" },
  { id: "#CP-10480", customer: "Ethan Cole", initials: "EC", product: "Ribbed Essential Tee", total: "$96.00", status: "Refunded", date: "Jul 28, 2026" },
];

const channels = [
  { name: "Online store", value: 68, color: "#16745b" },
  { name: "Social", value: 19, color: "#77ad9b" },
  { name: "Marketplace", value: 13, color: "#d8e7e1" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Orders", icon: ShoppingBag },
  { label: "Products", icon: Box }, { label: "Customers", icon: Users },
  { label: "Payments", icon: CreditCard },
];

export default function Home() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [range, setRange] = useState<Range>("30 days");
  const [category, setCategory] = useState<Category>("All categories");
  const [metric, setMetric] = useState<"Revenue" | "Orders">("Revenue");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => products.filter((product) =>
    category === "All categories" || product.category === category
  ), [category]);
  const visibleOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(search.toLowerCase())
  );

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className={dark ? "dashboard dark" : "dashboard"}>
      <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <div className="wordmark"><span><TrendingUp size={19} /></span><strong>Commerce<span>Pulse</span></strong><button onClick={() => setSidebarOpen(false)}><X size={17} /></button></div>
        <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label); setSidebarOpen(false); flash(`${label} view selected`); }}><Icon size={17} />{label}{label === "Orders" && <i>12</i>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="upgrade"><Sparkles size={17} /><strong>Unlock deeper insights</strong><p>Connect more stores and compare performance.</p><button onClick={() => flash("Upgrade preview opened")}>View upgrade</button></div><button className={activeNav === "Settings" ? "active" : ""} onClick={() => setActiveNav("Settings")}><Settings size={17} />Settings</button><div className="profile-row"><span>MD</span><div><strong>Muhammad Dawood</strong><small>Store owner</small></div><button aria-label="Sign out" title="Sign out" onClick={signOut}><LogOut size={15} /></button></div></div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="global-search"><Search size={16} /><input placeholder="Search your store..." onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="top-actions"><button onClick={() => { setDark(!dark); flash(`${dark ? "Light" : "Dark"} mode enabled`); }}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="notification" onClick={() => flash("You have 3 inventory alerts")}><Bell size={17} /><i /></button><button className="store-switcher" onClick={() => flash("Store switcher opened")}><span>NS</span><div><strong>North & State</strong><small>Primary store</small></div><ChevronDown size={14} /></button></div>
        </header>

        <div className="content">
          <div className="page-heading"><div><span>Wednesday, July 29</span><h1>Good afternoon, Dawood</h1><p>Here’s what’s happening with your store today.</p></div><div className="heading-actions"><label><CalendarDays size={15} /><select value={range} onChange={(e) => setRange(e.target.value as Range)}><option>7 days</option><option>30 days</option><option>90 days</option></select></label><button onClick={() => flash("Report exported successfully")}><Download size={15} />Export report</button></div></div>

          <section className="metrics">
            <Metric icon={CircleDollarSign} label="Total revenue" value={range === "7 days" ? "$78,300" : range === "30 days" ? "$248,920" : "$596,420"} change="+18.2%" positive />
            <Metric icon={ShoppingBag} label="Total orders" value={range === "7 days" ? "943" : range === "30 days" ? "3,482" : "8,124"} change="+12.5%" positive />
            <Metric icon={Users} label="New customers" value={range === "7 days" ? "186" : range === "30 days" ? "648" : "1,592"} change="+8.4%" positive />
            <Metric icon={PackageCheck} label="Conversion rate" value="3.84%" change="-0.6%" />
          </section>

          <section className="chart-grid">
            <article className="panel revenue-panel">
              <header><div><h2>Sales overview</h2><p>Track revenue and order volume over time.</p></div><div className="metric-tabs"><button className={metric === "Revenue" ? "active" : ""} onClick={() => setMetric("Revenue")}>Revenue</button><button className={metric === "Orders" ? "active" : ""} onClick={() => setMetric("Orders")}>Orders</button></div></header>
              <div className="chart-total"><strong>{metric === "Revenue" ? "$248,920" : "3,482"}</strong><span><ArrowUpRight size={12} /> 18.2% vs previous period</span></div>
              <div className="main-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={datasets[range]}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16745b" stopOpacity={0.28}/><stop offset="100%" stopColor="#16745b" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e8ebe8" strokeDasharray="3 5"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#89918d"}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#89918d"}} width={42}/><Tooltip contentStyle={{borderRadius:10,border:"1px solid #e1e5e2",fontSize:11}}/><Area type="monotone" dataKey={metric === "Revenue" ? "revenue" : "orders"} stroke="#16745b" strokeWidth={2.5} fill="url(#salesFill)"/></AreaChart></ResponsiveContainer></div>
            </article>

            <article className="panel channel-panel"><header><div><h2>Sales by channel</h2><p>Where your revenue comes from.</p></div><button onClick={() => flash("Channel report opened")}>View report</button></header><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={channels} dataKey="value" innerRadius={62} outerRadius={84} paddingAngle={3} stroke="none">{channels.map((item) => <Cell key={item.name} fill={item.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div><strong>100%</strong><span>sales</span></div></div><ul>{channels.map((channel) => <li key={channel.name}><i style={{background:channel.color}}/><span>{channel.name}</span><strong>{channel.value}%</strong></li>)}</ul></article>
          </section>

          <section className="lower-grid">
            <article className="panel products-panel"><header><div><h2>Top products</h2><p>Your best performers this period.</p></div><select value={category} onChange={(e) => setCategory(e.target.value as Category)}><option>All categories</option><option>Apparel</option><option>Accessories</option><option>Footwear</option></select></header><div className="product-list">{visibleProducts.map((product, index) => <button key={product.sku} onClick={() => flash(`${product.name} details opened`)}><span className="rank">0{index + 1}</span><span className="product-thumb" style={{background:product.color}}><Box size={18}/></span><span className="product-name"><strong>{product.name}</strong><small>{product.sku} · {product.category}</small></span><span><strong>{product.sales}</strong><small>units sold</small></span><span><strong>{product.revenue}</strong><small>revenue</small></span><span className={product.stock < 15 ? "stock low" : "stock"}>{product.stock < 15 && <AlertTriangle size={12}/>} {product.stock} in stock</span></button>)}</div></article>

            <article className="panel inventory-panel"><header><div><h2>Inventory health</h2><p>Stock levels across products.</p></div></header><div className="inventory-score"><div><strong>84</strong><span>/100</span></div><p><strong>Healthy inventory</strong><span>3 products need attention</span></p></div><ResponsiveContainer width="100%" height={130}><BarChart data={[{name:"Healthy",value:68},{name:"Low",value:22},{name:"Out",value:10}]} layout="vertical"><XAxis type="number" hide/><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#747d78"}} width={50}/><Tooltip/><Bar dataKey="value" radius={[0,6,6,0]}>{["#16745b","#d7a241","#c85a52"].map((color) => <Cell key={color} fill={color}/>)}</Bar></BarChart></ResponsiveContainer><button className="wide-action" onClick={() => flash("Inventory report opened")}><AlertTriangle size={14}/>Review low stock</button></article>
          </section>

          <section className="panel orders-panel"><header><div><h2>Recent orders</h2><p>Latest purchases across all channels.</p></div><button onClick={() => { setActiveNav("Orders"); flash("All orders opened"); }}>View all orders</button></header><div className="table-head"><span>Order</span><span>Customer</span><span>Product</span><span>Date</span><span>Total</span><span>Status</span></div>{visibleOrders.map((order) => <button className="order-row" key={order.id} onClick={() => flash(`${order.id} details opened`)}><strong>{order.id}</strong><span className="customer"><i>{order.initials}</i>{order.customer}</span><span>{order.product}</span><span>{order.date}</span><strong>{order.total}</strong><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></button>)}</section>
        </div>
      </section>
      {sidebarOpen && <button className="overlay" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      {notice && <div className="notice">{notice}</div>}
    </main>
  );
}

function Metric({ icon: Icon, label, value, change, positive = false }: { icon: typeof TrendingUp; label: string; value: string; change: string; positive?: boolean }) {
  return <article><div className="metric-icon"><Icon size={18}/></div><span>{label}</span><strong>{value}</strong><small className={positive ? "positive" : "negative"}>{positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {change}<em> vs last period</em></small></article>;
}

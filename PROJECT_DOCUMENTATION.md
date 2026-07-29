# CommercePulse Project Documentation

## 1. Project overview

CommercePulse is a responsive e-commerce analytics dashboard designed as a frontend portfolio project. It presents store performance data through summary cards, charts, product rankings, inventory indicators, and a recent-orders table.

The current version is a polished frontend prototype. It uses realistic sample data stored in the application; it is not yet connected to a database, payment provider, or live commerce platform.

## 2. Live links

- Production: https://commerce-pulse-362mf1bjv-md-automation.vercel.app
- GitHub: https://github.com/davimiza1/commerce-pulse

## 3. Main features

- Revenue, order, customer, and conversion KPI cards
- Selectable 7-day, 30-day, and 90-day reporting periods
- Revenue and order-volume chart switching
- Sales-by-channel donut chart
- Product filtering by category
- Inventory health score and low-stock indicators
- Searchable recent-order list
- Responsive desktop and mobile layouts
- Collapsible mobile navigation
- Light and dark themes
- Toast feedback for dashboard actions
- Social sharing preview image and metadata

## 4. Technology stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 | Application framework, routing, metadata, and production build |
| React 19 | Component-based user interface and state management |
| TypeScript | Type-safe application code |
| Recharts | Area, bar, and donut charts |
| Lucide React | Interface icons |
| CSS | Responsive layout, visual system, themes, and animations |
| GitHub | Source control and project repository |
| Vercel | Production hosting and automatic deployments |

## 5. Application structure

```text
commerce-pulse/
├── app/
│   ├── globals.css       # Complete visual system and responsive styles
│   ├── layout.tsx        # Root layout, fonts, icons, and social metadata
│   └── page.tsx          # Dashboard components, data, and interactions
├── public/
│   ├── favicon.svg       # Browser icon
│   └── og.png            # Social sharing preview
├── tests/                # Rendered HTML checks
├── package.json          # Dependencies and project scripts
└── README.md             # Quick project introduction
```

## 6. Component and state design

The primary dashboard is implemented in `app/page.tsx`.

Important interface state:

- `dark`: switches between light and dark themes.
- `range`: changes the chart and headline metrics between 7, 30, and 90 days.
- `category`: filters the displayed products.
- `metric`: switches the main chart between revenue and order data.
- `search`: filters recent orders.
- `activeNav`: records the selected sidebar section.
- `sidebarOpen`: controls mobile navigation.
- `notice`: displays temporary action feedback.

The `Metric` component is reused for the four headline KPI cards. Recharts components render the sales overview, channel distribution, and inventory health visualizations.

## 7. Data model

The dashboard currently uses four in-file sample datasets:

- `datasets`: revenue and order values for each reporting period.
- `products`: product name, SKU, category, sales, revenue, and stock.
- `orders`: order, customer, product, date, total, and payment status.
- `channels`: percentage distribution across store, social, and marketplace sales.

Because this is sample data, refreshing the page restores the original values.

## 8. Local development

Requirements:

- Node.js 22.13 or newer
- npm

Install and run:

```bash
git clone https://github.com/davimiza1/commerce-pulse.git
cd commerce-pulse
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
```

## 9. Deployment

CommercePulse is connected to Vercel through its GitHub repository.

Deployment workflow:

1. Make and test a change locally.
2. Commit the change to Git.
3. Push it to the `main` branch on GitHub.
4. Vercel automatically creates a new production deployment.

No paid service is required for the current demo. It runs on Vercel's Hobby plan and does not use a paid database or external API.

## 10. Current limitations

- Dashboard data is static and stored in the frontend.
- Sidebar sections provide interaction feedback but are not separate pages.
- Export actions show feedback but do not yet generate downloadable reports.
- There is no authentication or user account.
- Data changes are not persisted.
- There is no live Shopify, WooCommerce, or payment-platform integration.

## 11. Recommended development roadmap

### Phase 1: Portfolio-ready dashboard — complete

- Responsive dashboard
- Interactive charts and filters
- Dark mode
- GitHub repository
- Production deployment

### Phase 2: Convert the prototype into a full-stack application

- Add authentication
- Add protected dashboard routes
- Move mock data into a database
- Add create, update, and delete operations for products and orders
- Build real export functionality

### Phase 3: Production-level enhancements

- Add role-based access
- Add store integrations or a documented demo API
- Add automated tests
- Add loading, empty, and error states
- Add analytics and performance monitoring

## 12. Portfolio talking points

When presenting the project, explain that it demonstrates:

- Designing a clear interface for dense business data
- Building responsive dashboard layouts
- Integrating multiple chart types
- Managing interactive UI state with React
- Creating accessible, reusable interface patterns
- Configuring GitHub-based continuous deployment
- Taking a project from concept to a live production URL


# Auto Mart 🚗

**Auto Mart** is an early-stage automotive spare parts e-commerce project built to make browsing and ordering vehicle parts more convenient for customers in Mongolia.

The project provides a Mongolian-language storefront, product search, a shopping cart, and an order checkout flow. Product and order data are stored with [Supabase](https://supabase.com/), and the application is deployed on [Vercel](https://vercel.com/).

- **Live demo:** https://auto-mart-tau.vercel.app/
- **Repository:** https://github.com/royzmr4-hub/Auto-mart

## Project goals

Auto Mart aims to make automotive spare parts easier to discover and order through a simple online shopping experience. The project is currently in an early development stage, and its functionality and documentation will continue to improve.

## Features

### Customer storefront

- Mongolian-language storefront and navigation.
- Product listing loaded from the Supabase `products` table.
- Search products by name, description, or category.
- Display product information, price, image, and stock availability.
- Add products to a shopping cart.
- Change item quantities and remove items from the cart.
- Persist the cart in the browser using `localStorage`.
- Submit an order with customer name, phone number, delivery address, and a selected payment method.

### Admin area

- Admin sign-in using Supabase Authentication.
- Add products with a name, price, category, stock quantity, image URL, and description.
- View the product list.
- Delete products.

### Order data

The checkout flow saves an order to the Supabase `orders` table and its line items to `order_items`. The checkout form currently offers QPay, card, cash-on-delivery, and BNPL as payment-method choices. Selecting a method records the choice with the order; a live payment gateway integration is not documented as implemented in the current code.

## Technology

- **HTML5** — page structure.
- **CSS3** — styling and responsive layout.
- **Vanilla JavaScript** — storefront, cart, checkout, and admin interactions.
- **Supabase** — database access and admin authentication.
- **Vercel** — deployment.
- **Supabase JavaScript client v2** — browser-side connection to Supabase.

## Repository structure

```text
Auto-mart/
├── index.html   # Customer storefront and checkout interface
├── admin.html   # Admin login and product management interface
├── app.js       # Supabase connection and application logic
├── style.css    # Application styles
└── README.md    # Project documentation
```

## Getting started

### Requirements

- A [Supabase](https://supabase.com/) project.
- A modern web browser.
- A local static web server (recommended for local development).

### 1. Clone the repository

```bash
git clone https://github.com/royzmr4-hub/Auto-mart.git
cd Auto-mart
```

### 2. Configure Supabase

Open `app.js` and configure the Supabase project URL and publishable key:

```javascript
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";
```

Use a Supabase publishable/anon key in browser code only. **Never put a Supabase secret or service-role key in frontend files or commit one to GitHub.**

### 3. Prepare the database

The current application code expects these Supabase tables and fields:

| Table | Fields used by the application |
|---|---|
| `products` | `id`, `name`, `price`, `stock`, `category`, `image_url`, `description`, `created_at` |
| `orders` | `id`, `customer_name`, `phone`, `address`, `payment_method`, `total`, `status` |
| `order_items` | `order_id`, `product_id`, `quantity`, `price` |

Configure column types, primary keys, foreign keys, and defaults in Supabase to match how the application uses these fields. The application expects product and order IDs to be usable as numeric identifiers.

Before making the application public, configure and test **Row Level Security (RLS)** policies for each table. Allow only the operations appropriate for each user role; do not expose customer or order information publicly. The browser application must not rely on a secret/service-role key.

### 4. Configure admin authentication

Enable the appropriate sign-in method in Supabase Authentication and create an authorized admin account. The admin page uses Supabase email-and-password authentication.

### 5. Run locally

Because this is a static HTML/CSS/JavaScript application, serve the project directory with a local static server. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open:

- Storefront: http://localhost:8000/
- Admin page: http://localhost:8000/admin.html

Make sure the Supabase configuration and database policies are set before testing database-dependent features.

## Current development status

Auto Mart is an early-stage project. The current repository contains the storefront, admin interface, application JavaScript, and stylesheet. Features and integrations may change as development continues.

The payment choices shown in checkout are currently saved as order information. Choosing QPay or card does not, by itself, complete a transaction through a payment provider.

## Roadmap

Potential areas for future development include:

- Improve the README and developer documentation as the project evolves.
- Improve product discovery and filtering.
- Expand inventory and order-management capabilities.
- Integrate and test payment providers.
- Strengthen validation, security, and database access policies.
- Improve accessibility, mobile usability, and automated testing.
- Make the project easier for other developers to understand and contribute to.

## Contributing

Suggestions, bug reports, and improvements are welcome. If you would like to contribute, please open an issue to discuss the proposed change before submitting a pull request.

## License

No license is currently specified in this repository. Until a license is added, reuse and redistribution permissions are not explicitly granted. Add a suitable open-source license if you intend to accept contributions and allow others to reuse the code.

---

Built with the goal of making automotive spare parts shopping more accessible in Mongolia.

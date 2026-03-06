## AbhiCares Admin Panel – Technical Documentation

Developer handover & collaboration guide for the AbhiCares operations/admin SPA.

---

## 1. Project Overview

### Purpose

The AbhiCares Admin Panel is a React-based single-page application used by internal administrators and operations teams to manage the AbhiCares services platform. It provides tools to monitor and control core business entities and workflows, including:

- **Service catalog**: Categories, services, products, and packages
- **Orders & bookings**: Creation, monitoring, and lifecycle management
- **Partners & payouts**: Partner profiles, cash submissions, and seller cashouts
- **Customers**: Profiles, wallets, refunds, and reviews
- **Content and marketing**: Banners, offers, notifications, and globals
- **Support & reliability**: Help center tickets and crash reports
- **Configuration**: Cities, global settings, and commissions

The admin panel communicates with a backend API over HTTPS using Axios, with cookies and localStorage for authentication state and permission-based access control.

### Main Features

- **Admin authentication** via credentials and secure cookies
- **Dashboard analytics** and high-level KPIs (in `Dashboard.jsx`)
- **Order and booking management** (list + detail views)
- **Service catalog management** (categories, services, products, packages)
- **Customer and partner management** (profiles, wallets, cash submissions)
- **Role/permission-based access control** (route-level gating via `PrivateRoute`)
- **Crash reporting and monitoring** for frontend errors
- **Marketing and content management** (banners, offers, notifications)
- **System configuration** (cities, globals, commission settings)

---

## 2. Technology Stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| Application type   | SPA (React + Vite)                     |
| Framework          | React 19 (with React Router v7)        |
| Language           | JavaScript (ES modules)                |
| Bundler/Dev server | Vite 7                                 |
| UI Library         | Tailwind CSS 4 + Radix UI + shadcn-ui  |
| State Management   | Redux Toolkit + React-Redux            |
| Forms & schema     | React Hook Form, Zod                   |
| API Client         | Axios (with shared `axiosInstance`)    |
| Notifications      | `react-hot-toast` + `sonner`           |
| Maps & geo         | `@react-google-maps/api`, Leaflet      |
| Charts             | `recharts`                             |
| Auth/session       | Custom JWT-like flow via backend APIs  |
| Crash reporting    | Custom `/crash-report/create` endpoint |
| Build output       | Static assets (JS, CSS, HTML)          |

---

## 3. System Architecture

### High Level Architecture

```text
AbhiCares Admin Panel (React SPA, Vite)
        |
        v
Axios HTTP Client (withCredentials, axiosInstance)
        |
        v
Backend Admin API (VITE_BACKEND_URL / VITE_APP_ADMIN_API_URL)
        |
        v
Authentication, Business Logic, Database
```

### Architecture Principles

- **SPA-first**: Single-page application with client-side routing (React Router).
- **Modular structure**: Features organized under `src/pages` and `src/components`.
- **Reusable UI**: Shared components under `src/components/ui` and `src/components/shared`.
- **API-driven**: All data access via Axios and reusable hooks (`usePostApiReq`, `usePutApiReq`, `usePatchApiReq`).
- **Permission-aware routing**: `PrivateRoute` checks `localStorage.perm` and Redux `user.isAdminAuthenticated`.
- **Error visibility**: Centralized crash reporting (`useCrashReporter`) and toasts for user feedback.

---

## 4. Project Folder Structure

### High-Level Structure

```text
abhicares-admin-panel/
  package.json
  vite.config.js
  TECHNICAL_DOCUMENTATION_TEMPLATE.md
  TECHNICAL_DOCUMENTATION.md

  src/
    main.jsx                → React + Redux root bootstrap
    App.jsx                 → React Router routes configuration

    pages/                  → Route-level pages (feature screens)
      Dashboard.jsx
      AdminLogin.jsx
      bookings/
      orders/
      category/
      services/
      partners/
      customers/
      offers/
      banners/
      crash-report/
      help-center/
      seller-cashouts/
      send-notifications/
      cities/
      globals/
      settings/
      payments/
      reviews/
      enquiry/

    components/
      layout/               → Header, SideNav, layout wrappers
      ui/                   → Reusable UI primitives (Buttons, Inputs, Cards, etc.)
      shared/               → Shared helpers (Pagination, DatePicker, AsyncEntitySelect, etc.)
      booking/
      category/
      banner/
      customer/
      partner/
      review/
      help-center/
      crash-report/
      modals/               → Dialogs and detail modals across features
      protected-route/      → `PrivateRoute.jsx`

    store/
      store.js              → Redux store configuration
      slices/
        userSlice.js        → Auth flags (user/admin) and IDs
        autorizationSlice.js→ Simple UI state for authorization modal

    hooks/
      usePostApiReq.js
      usePutApiReq.js
      usePatchApiReq.js
      useCrashReporter.js
      use-mobile.js

    utils/
      axiosInstance.js      → Shared Axios client with baseURL + credentials
      readCookie.js         → Cookie parsing helper
      buildQuery.js         → URL query helper
      generateTimeOptions.js
      fetchLookup.js

    assets/                 → Images, JSON, static assets
    schemas/                → Zod schemas (e.g. wallet credit)
    index.css, App.css      → Global styles
```

### Folder Explanation

| Folder          | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `pages`         | Route-level containers, each mapped from `App.jsx`                         |
| `components/ui` | Low-level UI primitives (buttons, inputs, cards, toasts, etc.)             |
| `components`    | Feature-related and shared React components                                |
| `components/modals` | Reusable modal/dialog components across features                       |
| `components/layout` | Admin layout shell (side nav, header, wrappers)                        |
| `components/protected-route` | Route guard for admin-only routes                             |
| `store`         | Redux store and slices for auth and UI state                               |
| `hooks`         | Reusable hooks for HTTP requests, crash reporting, and device helpers      |
| `utils`         | Axios instance, cookie utilities, query builders, and other helpers        |
| `schemas`       | Zod validation schemas for forms                                           |
| `assets`        | Static images, icons, and JSON data                                        |

---

## 5. Environment Setup

### Clone Repository

```bash
git clone <repository-url>
cd abhicares-admin-panel
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` or `.env.local` (used by Vite) in the project root:

```bash
VITE_BACKEND_URL=<base URL of main admin backend>
VITE_APP_ADMIN_API_URL=<base URL of legacy/aux admin API used for login>
VITE_APP_IMAGE_URL=<base URL for serving uploaded images>
VITE_APP_CMS_URL=<base URL for CMS/banner APIs>
VITE_GOOGLE_MAPS_KEY=<Google Maps JS API key>
```

**Variable usage:**

- **`VITE_BACKEND_URL`**: Base URL used by `axiosInstance` (`axiosInstance.js`) for most authenticated API calls (e.g. `/admin/status`, `/admin/refresh`, `/crash-report/create`).
- **`VITE_APP_ADMIN_API_URL`**: Used by `AdminLogin.jsx` for admin login (`/login-Admin`).
- **`VITE_APP_IMAGE_URL`**: Used across services, category, and banner components to render images returned by the backend.
- **`VITE_APP_CMS_URL`**: Used by banner-related components (`AppHomeBanner`, `AppCategoryBanner`, `WebsiteHomeBanner`, etc.) to fetch CMS-managed banners.
- **`VITE_GOOGLE_MAPS_KEY`**: Used by `MapContainer.jsx` (`@react-google-maps/api`) for displaying booking/partner locations.

Ensure these values are configured for each environment (development, staging, production) before running or deploying.

---

## 6. Running the Project

### Development

```bash
npm run dev
```

This starts the Vite dev server (default on `http://localhost:5173/`) with HMR.

### Production Build & Preview

```bash
npm run build      # Build static assets
npm run preview    # Preview production build via Vite
```

For real production, the `dist/` directory should be served via a static host (e.g. Nginx, S3+CloudFront, or a PaaS that supports static assets).

---

## 7. Authentication Flow

### High-Level Flow

```text
Login Page (`/`)
    |
    v
POST { VITE_APP_ADMIN_API_URL }/login-Admin (credentials)
    |
    v
Backend issues cookies (tokens) + permission map (`perm`)
    |
    v
Store:
  - `admin-status` in localStorage
  - `perm` in localStorage
  - Redux `user.isAdminAuthenticated = true`
    |
    v
React Router navigates to first allowed `/admin/*` route
    |
    v
Subsequent requests via `axiosInstance` with `withCredentials: true`
    |
    v
Token lifecycle handled via `/admin/status`, `/admin/refresh`, `/admin/logout-all`
```

### Details

- **Login UI**: Implemented in `AdminLogin.jsx`.
  - Uses Axios (`VITE_APP_ADMIN_API_URL`) to send `{ adminId, password }` to `/login-Admin`.
  - On success:
    - Saves `response.data.perm` to `localStorage.perm`.
    - Persists `localStorage["admin-status"] = true`.
    - Dispatches `changeAdminStatus({ isAdminAuthenticated: true })` to Redux.
    - Computes the first allowed feature based on the permission map and redirects to `/admin/<firstAllowed>`.

- **Session State**:
  - Redux slice `userSlice.js` holds:
    - `userId`
    - `isAuthenticated`
    - `isAdminAuthenticated`
  - LocalStorage is the source of truth across reloads:
    - `"user-status"`
    - `"admin-status"`
    - `"perm"` (permissions object from backend).

- **Route Protection**: `PrivateRoute.jsx`
  - Wraps all `/admin/...` routes.
  - Reads `isAdminAuthenticated` from Redux and `perm` from `localStorage`.
  - Parses the first path segment after `/admin/` and maps it to a permission key (e.g. `"orders"` → `"orders"`).
  - If unauthenticated **or** permission for that feature is `"none"`, navigates to `/` (login) and renders nothing.

- **Token Refresh & Logout**:
  - Implemented inside `usePostApiReq`, `usePutApiReq`, and `usePatchApiReq`:
    - On **401 Unauthorized**, calls `/admin/status` to decide whether to:
      - Log out via `/admin/logout-all`, or
      - Refresh via `/admin/refresh` with `{ adminId, role: "admin" }`.
    - On successful refresh, Redux `isAdminAuthenticated` is set to `true` again.

---

## 8. Database Schema

The database and data models are owned by the **backend service** and are not defined directly in this frontend repo. Entities inferred from API usage and UI:

- **Admin / User**: Includes at least `id`, `role`, and permissions (`perm`) used for RBAC.
- **Customer**: Contains identifiers (`customerId`), basic profile, contact info, and wallet balance.
- **Partner/Seller**: Profile, service areas, and payout-related fields (seller cashouts, cash submissions).
- **Service Catalog**:
  - **Category**: `id`, `name`, `imageUrl` or `icon`.
  - **Service**: `id`, `name`, `description`, `imageUrl`, and category linkage.
  - **Product/Package**: `id`, `name`, `imageUrl[]`, pricing fields, and relations to services.
- **Orders & Bookings**: Status, customer, partner, pricing, date/time, and service details.
- **Content Entities**: Banners, offers, CMS pages, globals, SEO entries.
- **Crash Reports**: See `useCrashReporter.js` for the payload shape sent to `/crash-report/create`.

For precise schemas, refer to the backend repository or API documentation; this frontend assumes those structures via API responses.

---

## 9. Permission System

The admin panel uses a **permission map-based access control** system provided by the backend.

### Permission Data

- On successful login, the backend returns a `perm` object like:

```js
{
  dashboard: "read" | "none" | "...",
  banners: "read" | "none" | "...",
  orders: "read" | "none" | "...",
  bookings: "read" | "none" | "...",
  services: "read" | "none" | "...",
  partners: "read" | "none" | "...",
  customers: "read" | "none" | "...",
  offers: "read" | "none" | "...",
  availableCities: "read" | "none" | "...",
  payments: "read" | "none" | "...",
  enquiry: "read" | "none" | "...",
  helpCenter: "read" | "none" | "...",
  settings: "read" | "none" | "...",
  reviews: "read" | "none" | "...",
  notifications: "read" | "none" | "...",
  sellerCashout: "read" | "none" | "..."
}
```

- This object is persisted to `localStorage.perm` by `AdminLogin.jsx`.

### Permission Enforcement Flow

```text
Admin Login
   |
   v
Receive `perm` object from backend
   |
   v
Persist to localStorage (`perm`)
   |
   v
On each `/admin/...` navigation:
   - `PrivateRoute` reads `perm`
   - Maps route segment (e.g. "orders") to perm key
   - If value === "none" → redirect to `/`
   - Else → render requested page
```

Currently, enforcement is mostly at the **route level**. Fine-grained, per-action permissions (e.g. per-button) can be layered on top by consuming the same `perm` object in individual components.

---

## 10. API Integration

### Axios Instance

- Defined in `src/utils/axiosInstance.js`:
  - `baseURL: import.meta.env.VITE_BACKEND_URL`
  - `withCredentials: true` to send cookies with each request.

The instance is used throughout the app, primarily via custom hooks.

### Custom API Hooks

- `usePostApiReq`, `usePutApiReq`, and `usePatchApiReq` provide:
  - `res`, `isLoading`, `error`
  - `fetchData(url, payload, config)`
  - Toast-based success/error messaging
  - Automatic crash reporting on failures
  - 401 handling with admin status checks, token refresh, and logout.

### Example: POST Request Pattern

```js
const { res, isLoading, fetchData, error } = usePostApiReq();

// In a component:
await fetchData("/admin/some-endpoint", payload, {
  screenName: "SomeScreen",
  severity: "MEDIUM",
  userType: "Admin",
});
```

### Key API Areas

- **Auth & session**: `/login-Admin`, `/admin/status`, `/admin/refresh`, `/admin/logout-all`.
- **Orders & bookings**: Endpoints consumed in `Orders.jsx`, `OrderDetails.jsx`, `Bookings.jsx`, `BookingDetails.jsx`.
- **Service catalog**: CRUD APIs for categories, services, products, and packages (under `pages/services` and `components/category`).
- **Banners & CMS**: APIs at `VITE_APP_CMS_URL` for fetching static banners and images.
- **Crash reports**: `/crash-report/create` through `useCrashReporter`.

---

## 11. State Management

### Redux Store

- Configured in `src/store/store.js`:
  - `user`: from `userSlice.js`
  - `auth`: from `autorizationSlice.js`

`userSlice.js`:

- Manages:
  - `userId`
  - `isAuthenticated` (end-user side, if applicable)
  - `isAdminAuthenticated`
- Syncs critical flags to `localStorage`:
  - `user-status`
  - `admin-status`

`autorizationSlice.js`:

- Holds UI state: `{ isOpen: boolean }`, used to control authorization-related UI flows (e.g. modals).

### Other State

- **Component-local state**: Managed via React hooks (`useState`, `useEffect`) for form fields, filters, pagination, etc.
- **Form state**: Many complex forms (e.g. wallet credits, service/product/package forms) integrate with React Hook Form and Zod schemas (e.g. `walletCreditSchema`).

---

## 12. UI Design System

### Color & Layout

- **Tailwind CSS**:
  - Custom theme classes (e.g. `from-main`, `to-para-3` in `AdminLogin.jsx`) define brand colors.
  - Layouts are mobile-responsive using Tailwind’s flex and grid utilities.

- **Radix UI + shadcn-style components** (under `components/ui`):
  - Buttons, Cards, Inputs, Selects, Dialogs, Dropdowns, Navigation Menu, Tabs, Accordion, etc.
  - Ensure consistent spacing, typography, and interaction patterns across the app.

### Typography

- Font families and sizes are controlled via global CSS and Tailwind classes.
- UI components (`CardTitle`, etc.) encapsulate common heading/body styles.

---

## 13. Routing Structure

Routing is defined in `src/App.jsx` using `react-router-dom`:

| Route                                   | Page / Component                 | Notes                               |
| --------------------------------------- | -------------------------------- | ----------------------------------- |
| `/`                                     | `AdminLogin`                     | Public login page                   |
| `/admin/dashboard`                      | `Dashboard`                      | Overview and stats                  |
| `/admin/orders`                         | `Orders`                         | Orders list                         |
| `/admin/orders/:id`                     | `OrderDetails`                   | Order detail view                   |
| `/admin/bookings`                       | `Bookings`                       | Bookings list                       |
| `/admin/bookings/:id`                   | `BookingDetails`                 | Booking detail view                 |
| `/admin/categories`                     | `Categories`                     | Service categories                  |
| `/admin/categories/add-category`        | `AddCategoryPage`                | Add category                        |
| `/admin/categories/:categoryId/update-category` | `UpdateCategoryPage`       | Edit category                       |
| `/admin/categories/:categoryId`         | `CategoryServices`               | Services under category             |
| `/admin/categories/:categoryId/add-service` | `AddServicePage`             | Add service                         |
| `/admin/categories/:categoryId/update-service/:serviceId` | `UpdateServicePage` | Edit service                        |
| `/admin/categories/:categoryId/product/:serviceId` | `ServiceInfoPage`        | Service detail                      |
| `/admin/categories/:categoryId/product/:serviceId/add-product` | `AddProductPage` | Add product                         |
| `/admin/categories/:categoryId/product/:serviceId/update-product/:productId` | `UpdateProductPage` | Edit product              |
| `/admin/categories/:categoryId/product/:serviceId/add-package` | `AddPackagePage` | Add package                         |
| `/admin/categories/:categoryId/product/:serviceId/update-package/:packageId` | `UpdatePackagePage` | Edit package             |
| `/admin/categories/:categoryId/product/:serviceId/info/:productId` | `ProductInfo` | Product detail                      |
| `/admin/categories/:categoryId/package/:serviceId/info/:packageId` | `PackageInfo` | Package detail                      |
| `/admin/partners`                       | `Partners`                       | Partners list                       |
| `/admin/partners/:partnerId`           | `PartnerDetails`                 | Partner detail                      |
| `/admin/partners/:partnerId/cash-submission` | `CashSubmission`          | Cash submission                     |
| `/admin/seller-cashouts`               | `SellerCashouts`                 | Seller cashouts list                |
| `/admin/seller-cashouts/:cashoutId`    | `SellerCashoutDetails`           | Seller cashout detail               |
| `/admin/customers`                     | `Customers`                      | Customers list                      |
| `/admin/customers/:customerId`        | `CustomerDetails`                | Customer detail                     |
| `/admin/customers/:customerId/wallet` | `CustomerWallet`                 | Wallet and refunds                  |
| `/admin/offers`                       | `Offers`                         | Offers list                         |
| `/admin/offers/create`                | `CreateOffer`                    | Create offer                        |
| `/admin/offers/:offerId`              | `OfferDetails`                   | Offer detail                        |
| `/admin/offers/:offerId/update`       | `UpdateOffer`                    | Edit offer                          |
| `/admin/available-cities`             | `AvailableCities`                | Cities list                         |
| `/admin/available-cities/add`         | `AddCityPage`                    | Add city                            |
| `/admin/available-cities/:cityId/update` | `UpdateCityPage`              | Edit city                           |
| `/admin/payments`                     | `Payments`                       | Payments view                       |
| `/admin/help-center`                  | `HelpCenter`                     | Tickets list                        |
| `/admin/help-center/tickets/:ticketId` | `HelpCenterTicketDetails`      | Ticket detail                       |
| `/admin/enquiries`                    | `Enquiry`                        | Enquiry list                        |
| `/admin/settings`                     | `Settings`                       | Admin settings                      |
| `/admin/settings/manage-comision`     | `MangageComision`                | Commission config                   |
| `/admin/reviews`                      | `Reviews`                        | Reviews list                        |
| `/admin/send-notifications`           | `SendNotifications`              | Broadcast notifications             |
| `/admin/banners`                      | `Banner`                         | Web banners                         |
| `/admin/banners/app`                  | `AppBanner`                      | App banners                         |
| `/admin/crash-report`                 | `CrashReports`                   | Crash list                          |
| `/admin/crash-report/:crashId`        | `CrashDetailPage`                | Crash detail                        |
| `/admin/globals`                      | `Globals`                        | Global configuration                |
| `/*`                                  | `ErrorPage`                      | 404 / fallback                      |

All `/admin/...` routes are guarded by `PrivateRoute`.

---

## 14. How to Add a New Module

### Step 1 – Add Route & Page

1. Create a new folder under `src/pages/<feature>/` and implement your page component(s), e.g.:

```text
src/pages/reports/Reports.jsx
```

2. Register the route in `App.jsx` within the `<PrivateRoute>` block:

```jsx
import Reports from "./pages/reports/Reports";
// ...
<Route path="/admin/reports" element={<Reports />} />
```

### Step 2 – Wire API Calls (Optional)

- If your module talks to the backend:
  - Use `axiosInstance` directly or via `usePostApiReq`/`usePutApiReq`/`usePatchApiReq`.
  - Pass `screenName` and `userType` into config for consistent crash reporting.

### Step 3 – Permissions (Optional but Recommended)

- Extend the `perm` mapping in `PrivateRoute.jsx` to include your new route segment:

```js
const perm = {
  // existing keys...
  reports: "reports",
};
```

- Ensure the backend returns the appropriate `perm.reports` value.

### Step 4 – Navigation

- Add a navigation item (e.g. in `SideNav.jsx`) linking to `/admin/reports`.

---

## 15. Error Handling

- **Toast notifications**:
  - `react-hot-toast` and `sonner` (via `components/ui/sonner.jsx`) surface success and error messages.
  - All custom HTTP hooks handle common API errors and show friendly messages (fallback `"An error occurred."`).

- **HTTP error handling**:
  - 4xx/5xx responses:
    - Errors are stored in `error` state where relevant.
    - Messages from `error.response.data.message` are displayed when available.
  - 401 Unauthorized:
    - Triggers `getAdminStatus` → `refreshAdminToken` or `handleAdminLogout`.

- **Crash reporting**:
  - See next section.

---

## 16. Logging & Monitoring

### Custom Crash Reporter

- Implemented in `src/hooks/useCrashReporter.js`.
- Sends structured crash reports to `/crash-report/create` via `axiosInstance`:
  - `appName`, `appVersion`
  - `environment` (from `import.meta.env.MODE`)
  - `errorName`, `errorMessage`, `stackTrace`
  - `severity` (`HIGH` by default)
  - `screenName`
  - `request` metadata (URL, method)
  - `device` info: browser UA, OS, platform
  - `userId`, `userType`
- All API hooks call `reportCrash` when `shouldReportCrash` is enabled.

### Additional Logging

- Selected network and auth state transitions (`admin status`, `refresh`, `logout`) are logged via `console.log` during development for easier debugging.

---

## 17. Deployment

### Build & Artifacts

- Build:

```bash
npm run build
```

- Output:
  - Static files in `dist/` (HTML, JS, CSS, assets).

### Typical Deployment Flow

1. Build artifacts using CI/CD or locally.
2. Upload `dist/` to a static hosting provider (e.g. Nginx, S3+CloudFront, Netlify, Vercel static, etc.).
3. Configure environment variables (`VITE_*`) at build time (and/or via `.env` in CI).
4. Point a production domain like `https://admin.abhicares.com` to the app.

Ensure that:

- The backend API is reachable from the deployed domain.
- CORS is configured to allow the admin domain and cookies (credentials).

---

## 18. Development Workflow

### Branching Strategy (Suggested)

```text
main          → Production-ready branch
develop       → Integration/staging branch
feature/*     → New features
bugfix/*      → Bug fixes
hotfix/*      → Urgent production fixes
```

Examples:

```text
feature/crash-reporting-ui
feature/customer-wallet-enhancements
bugfix/orders-pagination
```

### Recommended Practices

- Keep feature branches short-lived and focused on a single change set.
- Use pull requests with code review for all non-trivial changes.
- Run `npm run lint` and ensure the app builds before merging to `main`.

---

## 19. Coding Standards

### General Rules

- Prefer **functional components** with React hooks.
- Use **Redux Toolkit** for shared state; avoid manual Redux boilerplate.
- Centralize data fetching logic in **custom hooks** or clearly named utility functions.
- Keep presentation and data-fetching concerns separated where practical.
- Prefer **composition** over large monolithic components—use `components/ui` and `components/shared`.

### Naming Conventions

| Item        | Convention           |
| ----------- | -------------------- |
| Components  | `PascalCase`         |
| Hooks       | `useSomething`       |
| Functions   | `camelCase`          |
| Variables   | `camelCase`          |
| Redux slice | `somethingSlice.js`  |
| Files       | `PascalCase.jsx` for components, `camelCase.js` for utilities |

---

## 20. Known Issues / Considerations

This section should be kept up to date by maintainers. Examples of considerations in the current implementation:

- Some permission checks are route-level only; fine-grained action-level permissioning may still be required in components.
- Error handling relies on backend error shapes (`error.response.data.message`, `name`); inconsistent responses can degrade UX.
- Image-heavy pages (services, products, banners) depend heavily on `VITE_APP_IMAGE_URL` and may break if misconfigured.
- Several helpers log to the console for debug purposes—review before enabling verbose logging in production.

---

## 21. Future Improvements

Potential roadmap items:

- Centralized **RBAC utility** to encapsulate permissions logic and avoid `localStorage` access in multiple places.
- More extensive **unit and integration tests** (components and hooks).
- Enhanced **analytics and dashboards** (e.g. real-time updates via WebSockets).
- Improved **accessibility** (ARIA attributes, keyboard navigation for all major flows).
- Configurable **feature flags** for gradual rollout of new modules.

---


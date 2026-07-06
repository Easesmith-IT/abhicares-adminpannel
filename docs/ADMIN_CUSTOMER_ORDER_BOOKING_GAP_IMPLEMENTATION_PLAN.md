# Admin Customer Order Booking Gap Implementation Plan

## Objective
Resolve the UI/UX, workflow continuity, and trust gaps identified in:
- `docs/ADMIN_CUSTOMER_ORDER_BOOKING_UI_UX_GAP_REPORT.md`

This plan covers the full admin-side customer booking flow:
- customer profile
- create-order wizard
- cart and checkout
- order workspace and order detail
- bookings workspace and booking detail

## Delivery Principles
- Remove fake or local-only operational data first.
- Stabilize workflow state before redesigning visual polish.
- Make every visible action truthful to backend behavior.
- Keep the admin flow resumable, explicit, and safe for multi-step ops work.
- Normalize lifecycle status vocabulary across all surfaces before adding more controls.

## Workstreams

### Workstream 1: Trustworthy Order/Booking Detail Data
Goal:
- Remove simulated, fabricated, or device-local behavior from operational detail pages.

Tasks:
1. Replace mock customer stats in `src/components/orders/CustomerProfileCard.jsx` with real API-backed values.
2. Replace localStorage-backed notes in `src/components/orders/OrderNotesCard.jsx` with backend persistence.
3. Replace fabricated timeline logic in `src/components/orders/OrderTimeline.jsx` with real order/booking/payment/refund events.
4. Remove `alert(...)` and simulated notification actions from `src/components/orders/OrderHeader.jsx`.
5. Remove simulated support-ticket and escalation behaviors from `src/pages/orders/OrderDetails.jsx`.

Dependencies:
- Backend may need an order activity/timeline response shape if not already available.
- Backend may need order-note create/list endpoints if booking-note endpoints cannot be reused.

Acceptance:
- No operational insight on order detail is derived from hardcoded or local-only logic.
- Reloading the page on another machine shows the same notes and same audit trail.
- All header actions either call a real endpoint or are removed/disabled.

### Workstream 2: Stable Draft Booking State
Goal:
- Make the create-order flow resumable and robust across refresh, backtracking, and step changes.

Tasks:
1. Move selected address and booking draft context from router `state` into Redux draft state.
2. Add draft metadata:
   - `customerId`
   - selected address
   - city
   - cart items
   - slot selections
   - coupon
   - pricing snapshot
   - pricing hash
3. Refactor:
   - `src/components/customer/CustomerAddresses.jsx`
   - `src/components/customer/create-order/Categories.jsx`
   - `Services.jsx`
   - `ProductsAndPackages.jsx`
   - `Checkout.jsx`
4. Support safe recovery on refresh:
   - if draft exists for the same `customerId`, restore it
   - if draft belongs to another customer, prompt to discard or resume intentionally

Dependencies:
- Frontend-only for draft state.

Acceptance:
- Refresh on any create-order step keeps the selected address and cart.
- Direct navigation to checkout shows a valid draft or a clear recovery state.
- Backtracking never loses the draft silently.

### Workstream 3: Explicit Multi-Service Cart Experience
Goal:
- Promote mixed-service/mixed-category cart behavior from accidental to first-class.

Tasks:
1. Add a persistent draft-booking bar in the create-order shell:
   - item count
   - running total
   - selected address/city
   - `Add More Services`
   - `Review Cart`
2. Update cart sheet:
   - add `Continue Adding Services`
   - keep `Proceed to Checkout`
   - group cart items by category/service
3. Add helper copy on category/service/product/checkout screens:
   - “You can add products and packages from multiple services and categories before confirming.”
4. Add post-add feedback:
   - non-blocking success banner with `Review Cart` and `Add Another Service`
5. Make “current draft state” visible on all wizard steps.

Dependencies:
- Workstream 2 should land first.

Acceptance:
- Admin can clearly tell the draft cart supports multiple categories/services.
- There is always an obvious path to continue browsing after adding an item.
- Cart structure visibly reflects mixed-service composition.

### Workstream 4: Real Wizard Navigation
Goal:
- Make the stepper and step flow behavior consistent with what the UI suggests.

Tasks:
1. Replace the non-functional stepper click behavior in:
   - `src/pages/customers/create-order/CreateOrder.jsx`
   - `src/components/customer/create-order/Stepper.jsx`
2. Guard step navigation:
   - cannot go to categories without address
   - cannot go to checkout without cart items
   - allow returning to earlier steps without losing draft
3. Add breadcrumbs or compact path labels:
   - address
   - category
   - service
   - products/packages
   - checkout

Dependencies:
- Workstream 2.

Acceptance:
- Clickable steps either work or are visibly disabled.
- The admin always knows where they are and how to go back safely.

### Workstream 5: Checkout Hardening
Goal:
- Make checkout behavior match backend rules and failure modes.

Tasks:
1. Replace fake order-type selector with a locked COD information block.
2. Display explicit admin-flow constraints:
   - COD only
   - wallet disabled
   - pricing validated at submit
3. Store and send `pricingHash` from `caluclate-charge`.
4. Handle backend conflicts explicitly:
   - `PRICING_HASH_MISMATCH`
   - invalid/non-applicable offer
   - offer limit reached
5. Clear draft cart on successful order creation.
6. Show a post-success confirmation summary before or after redirect.

Dependencies:
- Workstream 2 for draft pricing state.
- Backend already documents the intended contract.

Acceptance:
- Checkout never presents unsupported payment options.
- Pricing conflicts give clear retry guidance.
- Successful order creation clears the draft cart.

### Workstream 6: Canonical Booking Status System
Goal:
- Use one consistent booking lifecycle vocabulary across list, filter, badge, detail, and update surfaces.

Tasks:
1. Create a shared status config module for booking lifecycle.
2. Normalize:
   - `src/pages/customers/CustomerDetails.jsx`
   - `src/pages/bookings/Bookings.jsx`
   - `src/components/booking/BookingsTable.jsx`
   - `src/pages/bookings/BookingDetails.jsx`
3. Map backend raw statuses to display statuses where needed.
4. Align update controls with only valid transitions.

Dependencies:
- Need confirmation of the canonical backend status set.

Acceptance:
- Same booking status means the same thing everywhere.
- Filters, badges, and update actions use the same status definitions.

### Workstream 7: Drill-Down and Workspace Continuity
Goal:
- Preserve context between customer, order, booking, and partner surfaces.

Tasks:
1. Fix “View Customer” and “View Partner” links in booking detail to go to exact entities.
2. Add breadcrumbs or contextual back navigation:
   - customer -> booking
   - order -> booking
   - booking -> order
3. Ensure list-to-detail and detail-to-detail transitions preserve the operator’s mental context.

Dependencies:
- Frontend-only.

Acceptance:
- All “view” actions take the admin to the intended entity detail page, not a root listing.

### Workstream 8: Workspace Filter and Action Truthfulness Cleanup
Goal:
- Remove misleading controls and ensure visible filters actually work.

Tasks:
1. Fix bookings date range filter to use both `date` and `endDate`, or collapse to a single-date filter.
2. Align booking search/filter behavior with backend query support.
3. Replace booking-detail invoice print behavior with the actual invoice flow, or label it honestly as print/export.
4. Remove dead/demo text and inconsistent operational phrasing where it implies real system integration.

Dependencies:
- Backend support if true date range filtering is not already available.

Acceptance:
- Every filter control affects results as labeled.
- Every action label matches what the system really does.

## Recommended Delivery Sequence

### Phase 1: Trust and Safety Baseline
- Workstream 1
- Workstream 8
- Workstream 7

Reason:
- Remove misleading data and actions first so the rest of the flow is safe to optimize.

### Phase 2: Draft Booking Engine
- Workstream 2
- Workstream 4
- Workstream 3

Reason:
- The create-order shell needs stable state before it can expose multi-service behavior clearly.

### Phase 3: Checkout Reliability
- Workstream 5

Reason:
- Once draft state is reliable, pricing and submit behavior can be hardened without repeated rewrites.

### Phase 4: Lifecycle Consistency
- Workstream 6

Reason:
- Status normalization touches multiple screens and should land after the core flow is stable.

## File-Level Implementation Map

### Frontend
- `src/pages/customers/create-order/CreateOrder.jsx`
- `src/components/customer/CustomerAddresses.jsx`
- `src/components/customer/create-order/Cart.jsx`
- `src/components/customer/create-order/Stepper.jsx`
- `src/components/customer/create-order/Categories.jsx`
- `src/components/customer/create-order/Services.jsx`
- `src/components/customer/create-order/ProductsAndPackages.jsx`
- `src/components/customer/create-order/Checkout.jsx`
- `src/pages/customers/CustomerDetails.jsx`
- `src/pages/bookings/Bookings.jsx`
- `src/components/booking/BookingsTable.jsx`
- `src/pages/bookings/BookingDetails.jsx`
- `src/pages/orders/OrderDetails.jsx`
- `src/components/orders/CustomerProfileCard.jsx`
- `src/components/orders/OrderHeader.jsx`
- `src/components/orders/OrderNotesCard.jsx`
- `src/components/orders/OrderTimeline.jsx`
- `src/store/slices/cartSlice.js`

### Backend touchpoints likely required
- order notes / order timeline support
- booking date range filter if not already supported
- notification/send endpoints if header actions are to remain real

## Suggested Tickets

### Epic A: Admin Create-Booking Flow Stabilization
- A1. Persist draft booking context in Redux
- A2. Implement guarded step navigation
- A3. Add persistent draft-booking bar
- A4. Upgrade cart sheet for multi-service flow
- A5. Clear cart and show success state after order creation

### Epic B: Checkout Truthfulness and Recovery
- B1. Replace order-type selector with COD-only info block
- B2. Send and recover from pricing-hash conflicts
- B3. Add offer-error recovery states

### Epic C: Orders/Bookings Detail Trust Repair
- C1. Remove fabricated customer intelligence
- C2. Replace localStorage notes with backend notes
- C3. Replace fake order timeline with server-backed audit events
- C4. Remove fake notification/support actions
- C5. Align booking invoice action with real backend flow

### Epic D: Status and Navigation Consistency
- D1. Shared booking status config
- D2. Normalize list/detail/filter/update status usage
- D3. Fix customer/partner deep links from booking detail
- D4. Fix bookings date range filter behavior

## Acceptance Checklist
- No simulated ops data remains in production admin order/booking detail pages.
- Multi-step booking drafts survive refresh and backtracking.
- Mixed-service cart behavior is explicitly visible and easy to use.
- Checkout reflects COD-only backend constraints and handles pricing conflicts.
- Successful submit clears the draft cart.
- Booking statuses are consistent everywhere.
- Customer/partner/order/booking drill-down links preserve context.
- All visible filters and actions behave as labeled.

## Recommended First Milestone
Ship this as Milestone 1:
- remove fake/local-only order detail data
- stabilize draft state
- add multi-service cart affordances
- clear cart on success

Reason:
- This gives the biggest immediate improvement in operator trust and booking-flow usability without waiting for the full lifecycle normalization pass.

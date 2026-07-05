# Admin Panel Date/Time Parsing Audit

Date: 2026-07-05
Repo: `E:\easesmith\abhicares\abhicares-adminpannel`

## Executive Summary

The admin panel has the same class of date/time bugs as the app side, and in some places it is worse because the UI mixes three different value types as if they were the same thing:

1. `date-only` values such as `bookingDate`, `validFrom`, `validTo`, `expiryDate`
2. `time/slot` values such as `bookingTime`, `slotStartAt`, `slotEndAt`
3. `instant timestamps` such as `createdAt`, `updatedAt`, `requestedAt`, `lastPaidAt`

The current codebase parses most of these using inline `new Date(...)` plus ad hoc `format(...)` or `toLocaleString(...)` calls. There is no shared admin-panel date utility. As a result:

- the same backend field is displayed differently across pages
- some date-only values can shift by one day depending on timezone and serialization path
- some slot times are treated as UTC instants instead of local business times
- "today" and "overdue" logic is based on UTC or date-only comparisons instead of slot-aware local comparisons
- one confirmed table bug shows booking time from `bookingDate` instead of `bookingTime`

Audit scope:

- `53` source files directly construct dates with `new Date(...)` or `toISOString(...)`
- `23` files are directly in booking/slot/offer/scheduling flows and are materially exposed to parsing bugs

## Confirmed Findings

### P0: Booking list shows the wrong field for time

Confirmed bug:

- `src/components/booking/BookingsTable.jsx:67-72`

Issue:

- the "date" column uses `booking.bookingDate`
- the "time" column also uses `booking.bookingDate`
- `booking.bookingTime` is never used in that table

Evidence:

```jsx
{booking?.bookingDate && format(new Date(booking?.bookingDate), "dd MMM yyyy")}
{booking?.bookingDate && format(new Date(booking?.bookingDate), "hh:mm aa")}
```

Impact:

- admins can see a fabricated slot time derived from the date field
- dispatch/support decisions can be made against the wrong visible schedule

### P0: Admin create-order flow serializes local slot selection through UTC

Confirmed bugs:

- `src/components/customer/create-order/SelectSlotSheet.jsx:18-23`
- `src/components/customer/create-order/Checkout.jsx:97-112`
- `src/components/customer/create-order/Checkout.jsx:138-139`

Issues:

- slot date list stores `fullDate` using `d.toISOString().split("T")[0]`
- checkout combines local date + time, then returns `d.toISOString()`
- both paths convert local business scheduling into UTC-derived values

Evidence:

```jsx
fullDate: d.toISOString().split("T")[0]
return d.toISOString();
bookDate: i.slot?.date,
bookTime: combineDateTime(i.slot?.date, i.slot?.time),
```

Why this is wrong:

- in IST, a local midnight date converted to ISO becomes the previous UTC day
- a user selecting a local slot is choosing a business-local schedule, not a UTC instant to be reinterpreted later

Impact:

- admin-created bookings can send the wrong service date
- slot times can shift when later rendered back with `new Date(...)`
- this is the strongest match to the issue already seen on the app side

### P1: Dashboard financial date range uses UTC "today"

Confirmed bug:

- `src/pages/Dashboard.jsx:83-84`

Evidence:

```jsx
const today = new Date().toISOString().split("T")[0];
getFinancials(`/admin/platform-financials?from=2020-01-01&to=${today}&limit=1${cityQuery}`);
```

Issue:

- `toISOString().split("T")[0]` produces a UTC date, not the admin's local business date

Impact:

- for part of the day, the dashboard can query the wrong `to` date
- daily totals and range-bound financial summaries can be off by one day

### P1: Overdue logic ignores slot time and compares date-only values to "now"

Confirmed bugs:

- `src/pages/bookings/BookingDetails.jsx:312-313`
- `src/pages/orders/OrderDetails.jsx:149-155`

Evidence:

```jsx
const bookingDateObj = new Date(booking.bookingDate);
const isOverdue = bookingDateObj < new Date() && !["completed", "cancelled"].includes(booking.status);
```

```jsx
const bDate = new Date(b.bookingDate);
const today = new Date();
today.setHours(0, 0, 0, 0);
return bDate < today;
```

Issue:

- overdue is derived from `bookingDate` only
- `bookingTime`, `slotStartAt`, and `slotEndAt` are ignored
- a booking can become "overdue" based on midnight/date boundary, not on the actual slot window

Impact:

- false overdue alerts
- wrong operational escalations
- support teams can believe a slot has passed when only the date has started

### P1: Date-only business fields are parsed as full timestamps across booking and offer flows

Affected fields:

- `bookingDate`
- `validFrom`
- `validTo`
- `expiryDate`

Representative locations:

- `src/pages/bookings/BookingDetails.jsx:449,736`
- `src/pages/customers/CustomerDetails.jsx:302,915`
- `src/pages/orders/OrderDetails.jsx:364`
- `src/components/orders/ServiceItemCard.jsx:62-64`
- `src/components/modals/MonthlyBookingModal.jsx:129-137`
- `src/components/modals/SellerOrderInfoModal.jsx:46-50`
- `src/components/modals/ReviewDetailsModal.jsx:209-220`
- `src/pages/bookings/RejectedBookingRequestDetails.jsx:184-196`
- `src/components/offer/OfferRow.jsx:80-83`
- `src/pages/offers/OfferDetails.jsx:82-89`
- `src/components/modals/AddOfferModal.jsx:53-55`
- `src/pages/offers/UpdateOffer.jsx:21-22`

Issue:

- date-only values are repeatedly fed through `new Date(...)`
- whether they render correctly depends on the exact backend shape and browser timezone

Impact:

- off-by-one-day risk in booking and offer validity views
- edit forms can preload the wrong date if the stored value is midnight UTC or a date string interpreted in local time

### P1: Slot fields are rendered inconsistently and treated as generic timestamps

Representative locations:

- `src/pages/bookings/BookingDetails.jsx:450,741`
- `src/pages/orders/OrderDetails.jsx:367`
- `src/pages/help-center/HelpCenterTicketDetails.jsx:206-212`
- `src/components/orders/ServiceItemCard.jsx:65-67`
- `src/components/modals/SellerOrderInfoModal.jsx:50`
- `src/components/rejected-requests/Request.jsx:55-60`
- `src/components/modals/ReviewDetailsModal.jsx:217-221`
- `src/pages/partners/PartnerOfferedBookingDetails.jsx:184-190`

Issue:

- `bookingTime` is displayed using a mix of `format(new Date(...), "hh:mm aa")` and `toLocaleTimeString(...)`
- some pages present booking date and booking time with two completely different parsing paths

Impact:

- the same slot can render differently across admin pages
- if `bookingTime` is stored as an instant, timezone conversion can visibly shift the displayed slot

### P1: Notification scheduling is written as explicit IST but read back with browser-local formatting

Confirmed inconsistency:

- write path: `src/components/notifications/CampaignForm.jsx:192-193`
- read paths: `src/pages/notifications/CampaignList.jsx:248`, `src/pages/notifications/CampaignDetail.jsx:158-160`

Evidence:

```jsx
formData.append("scheduled_at", `${data.scheduled_at}:00+05:30`);
```

```jsx
new Date(campaign.scheduled_at).toLocaleString()
format(new Date(item.scheduled), "dd MMM yyyy, hh:mm aa")
```

Issue:

- creation assumes IST explicitly
- display assumes browser-local timezone implicitly

Impact:

- scheduled notification time can look different depending on client locale
- operations may see a different send time than the one they entered

### P2: Support/review/rejection detail screens repeat the same booking parsing assumptions

Representative locations:

- `src/pages/help-center/HelpCenterTicketDetails.jsx:90-94,206-212`
- `src/components/modals/ReviewDetailsModal.jsx:86-88,209-221`
- `src/pages/bookings/RejectedBookingRequestDetails.jsx:92,186,196`

Issue:

- these pages display booking and audit times independently from the main booking/order views
- each page carries its own parsing/formatting logic

Impact:

- support agents can see different date/time values from the booking desk
- fixes made in one screen will not automatically fix the others

## Structural Root Cause

The bug is not in one component. The panel currently has no explicit distinction between:

- `local business date`
- `slot-local time`
- `absolute event timestamp`

Because that distinction is missing, developers repeatedly do one of these:

- `new Date(value)`
- `format(new Date(value), pattern)`
- `new Date(value).toLocaleString(...)`
- `new Date().toISOString().split("T")[0]`

This is the underlying reason the problem appears in bookings, orders, customers, partners, offers, notifications, and support flows at the same time.

## Affected Admin Surfaces

High business risk:

- create order flow
- bookings list and booking detail
- order detail
- customer booking history
- partner offered booking detail
- offer validity display/edit
- notification scheduling

Medium business risk:

- review detail modal
- help-center ticket detail
- rejected booking request detail
- monthly booking/order summary modals
- seller order info modal

Lower risk but still inconsistent:

- banner created-at displays
- category created-at displays
- cashout/request history timestamps
- crash report timestamps

## Recommended Remediation Order

### Step 1: Create one shared admin-panel date utility

Add a single utility module for all admin rendering/parsing, for example:

- `formatInstant(value)` for `createdAt`, `updatedAt`, `requestedAt`, `lastPaidAt`
- `formatDateOnly(value)` for `bookingDate`, `validFrom`, `validTo`, `expiryDate`
- `formatSlotTime(value)` for `bookingTime`, `slotStartAt`, `slotEndAt`
- `getLocalYmd(date)` for local `yyyy-mm-dd` generation without `toISOString`
- `combineLocalDateAndTime(...)` for admin create-order slot serialization

Rule:

- no page should call raw `new Date(...)` for business date fields directly

### Step 2: Fix the actual logic bugs before cleanup

First fixes should be:

1. `src/components/booking/BookingsTable.jsx`
2. `src/components/customer/create-order/SelectSlotSheet.jsx`
3. `src/components/customer/create-order/Checkout.jsx`
4. `src/pages/Dashboard.jsx`
5. `src/pages/bookings/BookingDetails.jsx`
6. `src/pages/orders/OrderDetails.jsx`

These are the places where wrong parsing affects data sent to backend or active operational decisions.

### Step 3: Normalize all booking surfaces together

Refactor these as one batch so they stop diverging:

- bookings detail/list
- order detail + service cards
- customer booking history
- review/help-center/rejection screens
- seller order / monthly booking modals

### Step 4: Normalize date-only offer/campaign flows

Refactor together:

- `OfferRow`
- `OfferDetails`
- `AddOfferModal`
- `UpdateOffer`
- notification campaign display paths

## Testing Checklist For The Future Fix

After implementation, verify with real data:

1. Create a booking from admin for a slot on the current local date after midnight IST and confirm the stored booking date stays unchanged.
2. Create a booking for a future date and confirm list view, order view, booking detail, customer detail, and partner detail show the same slot.
3. Check an overdue booking where the date is today but the slot is still upcoming; it must not be marked overdue.
4. Check an overdue booking where slot end time is past; it must be marked overdue.
5. Open an offer with `validFrom` and `validTo` around month boundaries and verify edit form preload is correct.
6. Schedule a notification for a known IST time and verify list/detail show the same time.

## Conclusion

This is a real cross-panel problem, not a one-off screen issue.

The most serious defects are:

1. a confirmed wrong-field bug in the bookings table
2. UTC-based slot/date serialization in admin create-order flow
3. UTC-based "today" on dashboard filters
4. overdue logic based on date-only values instead of actual slot timing

Everything else is cleanup around the same root cause: the panel has no shared contract for date-only vs slot-time vs event-timestamp handling.

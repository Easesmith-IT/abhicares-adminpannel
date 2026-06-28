# Live Admin Panel Audit

Date: 2026-06-28
Target: [admin.abhicares.com](https://admin.abhicares.com)
Mode: non-destructive live click-through on the authenticated production admin tab

## Scope

I audited the live admin panel route-by-route and exercised visible non-destructive controls only.

I did not submit destructive or state-changing actions on production, including:

- delete
- approve / reject
- verify / settle
- create / update form submission
- resend / send campaign actions when the intent was not explicit

## Routes Verified Live

- `/admin/dashboard`
- `/admin/orders`
- `/admin/bookings`
- `/admin/offered-bookings`
- `/admin/bookings/rejected-request`
- `/admin/categories`
- `/admin/item-categories`
- `/admin/available-cities`
- `/admin/partners`
- `/admin/partners?status=IN-REVIEW`
- `/admin/reviews`
- `/admin/customers`
- `/admin/offers`
- `/admin/offers/create`
- `/admin/banners`
- `/admin/homepage-trending`
- `/admin/notifications`
- `/admin/notifications/create`
- `/admin/notifications/:id`
- `/admin/payments`
- `/admin/seller-cashouts`
- `/admin/cash-management`
- `/admin/enquiries`
- `/admin/help-center`
- `/admin/settings`
- `/admin/rewards?tab=config`
- `/admin/globals`
- `/admin/crash-report`

## Primary Flows Exercised

- Offers: opened list and `Add Offer`
- Banners: opened list and `Create Banner` modal
- Notifications: opened campaign list, opened `Create Campaign`, opened a campaign detail page
- Settings: opened `Manage Rewards & Referrals`
- Payments: opened finance workspace
- Homepage Trending: opened city-scoped listing

## Findings

### High

1. Notification failures are present in live production data.
   Evidence:
   - `/admin/notifications` showed multiple campaigns with `failed` status on June 28, 2026.
   - One completed campaign detail opened correctly at `/admin/notifications/6a40f4c4913833433e2797f0`, so the detail screen itself is working for at least completed campaigns.

2. `Rewards & Referrals` is not discoverable from primary navigation.
   Evidence:
   - It did not appear as a command-palette navigation target during the live sweep.
   - It was reachable only by opening `/admin/settings` and clicking `Manage Rewards & Referrals`.
   Impact:
   - This is a live navigation gap, not a route-existence gap.

### Medium

3. Page-size selector is still inconsistent across paginated admin pages.
   Confirmed present:
   - Orders
   - Bookings
   - Help Center
   - Partner Payouts

   Confirmed missing or not visible while the page still exposes pagination or page counts:
   - Job Requests
   - Categories
   - Available Cities
   - Service Partners
   - Reviews
   - Customers
   - Notifications
   - Homepage Trending
   - Crash Reports

4. Job Requests is the weakest pagination UX in the live panel.
   Evidence:
   - `/admin/bookings/rejected-request` showed filtering by request status.
   - No visible pagination controls were present in the live UI during audit.

5. Item Categories live UI is still too thin for administration.
   Evidence:
   - `/admin/item-categories` exposed the list page but no page-local search control was visible.
   - No visible page-size selector was present either.

6. Payments ledger shows placeholder-looking gateway identifiers.
   Evidence:
   - `/admin/payments` rendered rows such as `PAY-UNSPECIFIED`.
   Impact:
   - This weakens finance auditability and looks like incomplete payment metadata in production data or mapping.

### Low

7. Some route access depends on secondary navigation patterns instead of direct nav visibility.
   Examples:
   - `Rewards & Referrals` required going through Settings.
   - Lower navigation routes were easier to reach through command palette than through the sidebar snapshot because the sidebar content is heavily virtualized/collapsed.

8. Banners create flow opens successfully but starts in a loading state.
   Evidence:
   - `Create Banner` opened a modal titled `Create New Marketing Banner`.
   - The modal initially showed `Loading Create Configuration`.
   Note:
   - This is not a broken flow by itself, but it is worth monitoring if users report delays or empty modal state.

## Positive Checks

- Offer creation page loads correctly.
- Banner creation modal opens correctly.
- Notification creation page loads correctly.
- Notification detail page opens correctly for a completed campaign.
- Homepage Trending page loads with city-scoped filters and URL-synced state.
- Cash Management, Help Center, Globals, Crash Reports, Customers, Partners, and Settings all rendered without console errors during the audit pass.

## Recommended Fix Order

1. Triage the failed notification campaigns in production and confirm whether failure is targeting, token, or delivery related.
2. Make `Rewards & Referrals` directly discoverable from live navigation.
3. Finish page-size selector rollout on every paginated admin listing.
4. Fix Job Requests pagination controls.
5. Add page-local search and page-size controls to Item Categories.
6. Replace `PAY-UNSPECIFIED` ledger placeholders with real gateway identifiers where available.

## Notes

- This audit was done against live production UI, so no destructive submissions were executed.
- The command palette was the most reliable route launcher for deep admin routes during the audit.

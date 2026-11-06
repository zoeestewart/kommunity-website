# kommunity-website
Community website project

Site-wide email addresses and venue details are maintained in [`src/siteConfig.js`](./src/siteConfig.js).

## VIP table bookings

The contact page includes an in-app booking grid showing booked and available Friday/Saturday slots for the 9pm–midnight (Brisbane time) VIP booking. It displays remaining table capacity without showing customer details, supports up to three overlapping bookings, and writes confirmed bookings to Google Calendar. VIP packages start at $350. Visitors can refresh availability before choosing. Private functions and call-back requests remain email enquiries. If the API is unavailable, the form offers the Google booking page as a fallback.

The API is `public/api/bookings.php`. It requires PHP 8.1+ with cURL and OpenSSL on the existing cPanel host. The Vite build copies it to `/api/bookings.php` for the current FTP deployment.

### Connect Google Calendar

1. In Google Cloud, enable the Google Calendar API and create a service account with a JSON key.
2. Share the calendar used by the Google booking page with the service account's `client_email`, granting permission to make changes to events. Use that calendar's ID from its settings. Keep the calendar dedicated to bookings if possible; overlapping events in it each count toward the three-table limit.
3. After deploying, copy `/api/config.example.php` to a private `kommunity-calendar-config.php` file in the directory above `public_html`. Set the calendar ID in that file and place the service-account JSON beside it as `kommunity-google-service-account.json`. The config and key must remain outside the public web directory.
4. Confirm PHP has cURL and OpenSSL enabled, then test availability and a booking. Confirmation appears on the website, and the customer's contact details are saved in the event; Google does not email an invitation.

The time slot and capacity are enforced in `public/api/bookings.php` and displayed from `src/siteConfig.js`; keep them aligned if booking rules change. Google booking-page bookings and in-app bookings should use the same calendar. The server serializes in-app bookings to protect the capacity limit.

### Test bookings locally

The booking API reads `kommunity-calendar-config.php` from the project root; `public/api/config.example.php` is only an example and is not loaded by the endpoint. For local testing, put the private config and service-account JSON in the project root, and make sure `serviceAccountFile` points to that JSON file. Both files are ignored by Git.

The online booking form is disabled by default in each browser. To enable it for local testing, open the browser developer console on the website, run `localStorage.setItem("kommunityVipBookingApiEnabled", "true")`, then reload. To disable it again, run `localStorage.removeItem("kommunityVipBookingApiEnabled")` and reload. This browser-side flag only controls whether the form calls the API; it is not server-side access control.

With PHP 8.1+ and the cURL and OpenSSL extensions enabled, open two terminals in the project root:

1. Run `php -S 127.0.0.1:8000 -t public`.
2. Run `npm run dev` and open the local Vite URL.

Vite forwards `/api` requests to the local PHP server. Check availability first. Submitting a booking creates a real event in the configured Google Calendar, so use a dedicated test calendar or avoid submitting a booking.

## Instagram feed

The homepage loads the six latest posts from the Instagram Graph API through `public/api/instagram.php`. The access token stays on the server and is cached for 15 minutes. The endpoint is included in the Vite build and requires PHP 8.1+ with cURL on the cPanel host.

To configure it, create `kommunity-instagram-config.php` in the directory above `public_html` and return an array with the same keys as `public/api/instagram-config.example.php`. Set the Instagram Business or Creator account ID, a Meta access token with the required Instagram permissions, and a currently supported Graph API version. The Instagram account must be connected to a Facebook Page. Keep the token private and renew it before it expires. Alternatively, set `META_INSTAGRAM_USER_ID`, `META_INSTAGRAM_ACCESS_TOKEN`, and `META_GRAPH_API_VERSION` as server environment variables.

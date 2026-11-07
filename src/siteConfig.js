const siteConfig = {
  instagram: {
    profileUrl: "https://www.instagram.com/kommunitybne/?hl=en",
    apiUrl: "/api/instagram.php",
  },
  emails: {
    bookings: "manager@kommunity.com.au",
    marketing: "marketing@kommunity.com.au",
    manager: "manager@kommunity.com.au",
  },
  venue: {
    streetAddress: "243 Brunswick Street",
    suburb: "Fortitude Valley",
    locality: "Fortitude Valley, Brisbane QLD",
    openingDays: "Friday and Saturday",
    openingHours: "9pm till late",
  },
  enquiry: {
    // Emails the enquiry form to emails.bookings (set in public/api/enquiry.php).
    apiUrl: "/api/enquiry.php",
  },
  guestlist: {
    // Free entry form linked from the Instagram bio.
    url: "https://tally.so/r/XxBpre",
    night: "Friday",
    closes: "9pm",
    freeUntil: "11pm",
  },
  bookings: {
    // Set to false to hide the online VIP booking form and send visitors to the enquiry form instead.
    onlineEnabled: true,
    apiUrl: "/api/bookings.php",
    vipStartTime: "9:00pm",
    vipEndTime: "12:00am",
    vipDurationHours: 3,
    vipCapacity: 3,
    vipStartingPrice: 350,
    // Keep aligned with MIN_BOOKING_NOTICE_DAYS in public/api/bookings.php.
    minNoticeDays: 7,
  },
};

export default siteConfig;

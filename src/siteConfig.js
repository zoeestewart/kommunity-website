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
  bookings: {
    googleBookingUrl: "https://calendar.app.google/2MMBUoyCtDr5pL2Y7",
    apiUrl: "/api/bookings.php",
    vipStartTime: "9:00pm",
    vipEndTime: "12:00am",
    vipDurationHours: 3,
    vipCapacity: 2,
  },
};

export default siteConfig;

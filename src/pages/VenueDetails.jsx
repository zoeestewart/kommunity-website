import siteConfig from "../siteConfig";

// Address, hours and contact details shown beside the booking and enquiry forms.
export default function VenueDetails() {
  return (
    <aside className="space-y-8">
      <section>
        <h2 className="font-bold">Visit us</h2>
        <p className="mt-2 leading-7 text-white/65">{siteConfig.venue.streetAddress}<br />{siteConfig.venue.locality}</p>
      </section>
      <section>
        <h2 className="font-bold">Opening hours</h2>
        <p className="mt-2 leading-7 text-white/65">{siteConfig.venue.openingDays}<br />{siteConfig.venue.openingHours}</p>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Free {siteConfig.guestlist.night} entry until {siteConfig.guestlist.freeUntil} via the{" "}
          <a className="text-pink-300 hover:text-pink-200" href={siteConfig.guestlist.url} rel="noreferrer" target="_blank">guestlist</a>.
        </p>
      </section>
      <section>
        <h2 className="font-bold">Email</h2>
        <p className="mt-2 leading-7"><a className="text-pink-300 hover:text-pink-200" href={`mailto:${siteConfig.emails.bookings}`}>{siteConfig.emails.bookings}</a></p>
      </section>
    </aside>
  );
}

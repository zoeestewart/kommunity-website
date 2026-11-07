import siteConfig from "../siteConfig";
import VipBookingForm from "./VipBookingForm";

function sendEnquiry(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name");
  const email = formData.get("email");
  const enquiryType = formData.get("enquiryType");
  const message = formData.get("message");
  const subject = `Kommunity ${enquiryType} enquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Enquiry: ${enquiryType}`,
    "",
    message,
  ].join("\n");

  window.location.href = `mailto:${siteConfig.emails.bookings}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">Get in touch</p>
        <h1 className="text-4xl font-black sm:text-6xl">Let's make <span className="text-pink-500">plans.</span></h1>
        <p className="mt-5 text-lg leading-7 text-white/65">Enquire about a VIP table, a private function or a call-back.</p>
      </header>
      <div className="grid gap-12 border-t border-white/10 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-16">
        <VipBookingForm />
        <aside className="space-y-8">
          <section>
            <h2 className="font-bold">Visit us</h2>
            <p className="mt-2 leading-7 text-white/65">{siteConfig.venue.streetAddress}<br />{siteConfig.venue.locality}</p>
          </section>
          <section>
            <h2 className="font-bold">Opening hours</h2>
            <p className="mt-2 leading-7 text-white/65">{siteConfig.venue.openingDays}<br />{siteConfig.venue.openingHours}</p>
          </section>
          <section>
            <h2 className="font-bold">Email</h2>
            <p className="mt-2 leading-7"><a className="text-pink-300 hover:text-pink-200" href={`mailto:${siteConfig.emails.bookings}`}>{siteConfig.emails.bookings}</a></p>
          </section>
        </aside>
      </div>
      <div className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
        <section className="scroll-mt-24" id="enquiry">
          <h2 className="font-bold">VIP tables, private functions and call-backs</h2>
          <form className="mt-4 space-y-4" onSubmit={sendEnquiry}>
            <label className="block text-sm font-semibold" htmlFor="enquiry-name">
              Your name
              <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="enquiry-name" name="name" autoComplete="name" required />
            </label>
            <label className="block text-sm font-semibold" htmlFor="enquiry-email">
              Email address
              <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="enquiry-email" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="block text-sm font-semibold" htmlFor="enquiry-type">
              Enquiry type
              <select className="mt-2 block w-full border border-white/20 bg-[#171317] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="enquiry-type" name="enquiryType">
                <option>VIP table</option>
                <option>Private function</option>
                <option>Call back</option>
                <option>General enquiry</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block text-sm font-semibold" htmlFor="enquiry-message">
              Tell us what you need
              <textarea className="mt-2 block min-h-36 w-full resize-y border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="enquiry-message" name="message" rows="5" required />
            </label>
            <button className="bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300" type="submit">Email your enquiry</button>
            <p className="text-sm text-white/50">This opens your email app with your enquiry addressed to {siteConfig.emails.bookings}.</p>
          </form>
        </section>
      </div>
    </section>
  );
}
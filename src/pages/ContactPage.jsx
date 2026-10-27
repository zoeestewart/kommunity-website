function sendEnquiry(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name");
  const email = formData.get("email");
  const enquiryType = formData.get("enquiryType");
  const date = formData.get("date") || "Not specified";
  const guests = formData.get("guests") || "Not specified";
  const message = formData.get("message");
  const subject = `Kommunity ${enquiryType} enquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Enquiry: ${enquiryType}`,
    `Preferred date: ${date}`,
    `Number of guests: ${guests}`,
    "",
    message,
  ].join("\n");

  window.location.href = `mailto:market@kommunity.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">Get in touch</p>
        <h1 className="text-4xl font-black sm:text-6xl">Let's make <span className="text-pink-500">plans.</span></h1>
        <p className="mt-5 text-lg leading-7 text-white/65">For bookings, VIP enquiries, and functions, our team is ready to help.</p>
      </header>
      <div className="grid gap-12 border-t border-white/10 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-16">
        <form className="space-y-6" onSubmit={sendEnquiry}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold" htmlFor="name">
              Your name
              <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 focus:border-pink-400 focus:outline-none" id="name" name="name" autoComplete="name" required />
            </label>
            <label className="block text-sm font-semibold" htmlFor="email">
              Email address
              <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 focus:border-pink-400 focus:outline-none" id="email" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="block text-sm font-semibold" htmlFor="enquiryType">
              Enquiry type
              <select className="mt-2 block w-full border border-white/20 bg-[#171317] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="enquiryType" name="enquiryType">
                <option>General booking</option>
                <option>VIP booking</option>
                <option>Private function</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block text-sm font-semibold" htmlFor="date">
              Preferred date
              <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white [color-scheme:dark] focus:border-pink-400 focus:outline-none" id="date" name="date" type="date" />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2" htmlFor="guests">
              Number of guests
              <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 focus:border-pink-400 focus:outline-none" id="guests" name="guests" type="number" min="1" placeholder="e.g. 12" />
            </label>
          </div>
          <label className="block text-sm font-semibold" htmlFor="message">
            Tell us about your plans
            <textarea className="mt-2 block min-h-36 w-full resize-y border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 focus:border-pink-400 focus:outline-none" id="message" name="message" rows="5" required />
          </label>
          <button className="bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300" type="submit">
            Email your enquiry
          </button>
          <p className="text-sm text-white/50">This opens your email app with your enquiry addressed to market@kommunity.com.au.</p>
        </form>
        <aside className="space-y-8 lg:border-l lg:border-white/10 lg:pl-10">
          <section>
            <h2 className="font-bold">Visit us</h2>
            <p className="mt-2 leading-7 text-white/65">243 Brunswick Street<br />Fortitude Valley, Brisbane QLD</p>
          </section>
          <section>
            <h2 className="font-bold">Opening hours</h2>
            <p className="mt-2 leading-7 text-white/65">Friday and Saturday<br />9pm till late</p>
          </section>
          <section>
            <h2 className="font-bold">Email</h2>
            <p className="mt-2 leading-7"><a className="text-pink-300 hover:text-pink-200" href="mailto:market@kommunity.com.au">market@kommunity.com.au</a></p>
          </section>
        </aside>
      </div>
      <div className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
        <section>
          <h2 className="font-bold">Bookings</h2>
          <p className="mt-2 leading-7 text-white/65">Include your preferred date, group size, and the kind of night you're planning.</p>
        </section>
      </div>
    </section>
  );
}
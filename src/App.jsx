// src/App.jsx
import React from "react";

const navItems = ["What’s On", "VIP Booths", "Functions", "Contact"];

const heroImage =
  "https://drive.google.com/uc?export=view&id=YOUR_GOOGLE_DRIVE_FILE_ID";

const eventCards = [
  {
    title: "Saturday Night Pulse",
    date: "Sat 9:00pm",
    description: "The hottest late-night house and club energy in town.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?...",
  },
  {
    title: "Birthday Sessions",
    date: "Fri 9:00pm",
    description: "Private party vibes with premium DJ energy.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?...",
  },
  {
    title: "Sunset Social",
    date: "Sun 7:00pm",
    description: "A more relaxed but still high-energy nightlife experience.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?...",
  },
];

const footerLinks = [
  { label: "Careers", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Privately owned", href: "#" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-logo.svg"
              alt="Kommunity"
              className="h-10 w-auto"
            />
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-white/80 transition hover:text-pink-400"
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="rounded-full bg-[#fe008b] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-500"
          >
            Bookings
          </a>
        </div>
      </header>

      <main>
        <section
          className="relative isolate overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(5,5,12,0.45), rgba(5,5,12,0.7)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-pink-300">
                Fortitude Valley
              </p>

              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                This is your{" "}
                <span className="text-[#fe008b]">Kommunity</span>
              </h1>

              <h2 className="mt-6 max-w-xl text-lg text-white/80 sm:text-xl">
                Get ready to dance your heart out all night long with the
                hottest Kommunity in town.
              </h2>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#events"
                  className="rounded-full bg-[#fe008b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
                >
                  Events
                </a>
                <a
                  href="#vip"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Bottle Service
                </a>
                <a
                  href="#functions"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Functions
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-300">
              Entertainment
            </p>
            <h3 className="mt-3 text-3xl font-black sm:text-5xl">
              What’s <span className="text-[#fe008b]">On</span>
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {eventCards.map((event) => (
              <article
                key={event.title}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
                    {event.date}
                  </p>
                  <h4 className="mt-3 text-2xl font-bold">{event.title}</h4>
                  <p className="mt-3 text-white/70">{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="vip" className="bg-[#121219] py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-300">
                Premium night out
              </p>
              <h3 className="mt-4 text-3xl font-black sm:text-5xl">
                Get our <span className="text-[#fe008b]">VIP Experience</span>
              </h3>

              <div className="mt-6 h-px w-24 bg-pink-500" />

              <p className="mt-6 max-w-xl text-lg text-white/70">
                The VIP booths & bottles service at Kommunity nightclub is the
                epitome of luxury and exclusivity, providing a lavish night out
                to party-goers.
              </p>

              <a
                href="#contact"
                className="mt-8 inline-flex w-fit rounded-full bg-[#fe008b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
              >
                VIP Booths
              </a>
            </div>

            <div className="flex items-center justify-center">
              <img
                src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-vip-booths-bottle-service.png"
                alt="VIP booths"
                className="max-h-[620px] w-full max-w-xl object-contain"
              />
            </div>
          </div>
        </section>

        <section id="functions" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#17171d] to-[#0f0f14] p-8 sm:p-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-300">
                  Private bookings
                </p>
                <h3 className="mt-4 text-3xl font-black sm:text-5xl">
                  Host your next event with us
                </h3>
              </div>

              <div className="flex items-center justify-end">
                <a
                  href="#contact"
                  className="rounded-full border border-pink-500/60 bg-pink-500/10 px-6 py-3 text-sm font-semibold text-pink-200 transition hover:bg-pink-500/20"
                >
                  Enquire now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#0b0b0f]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <img
              src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-logo.svg"
              alt="Kommunity"
              className="h-12 w-auto"
            />
            <p className="mt-6 max-w-md text-white/70">
              Thanks for partying with our Kommunity! Keep an eye out for
              upcoming events and follow us on social media for news and
              updates. See you soon!
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-pink-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div id="contact" className="space-y-5">
            <h4 className="text-2xl font-bold">Get In Touch</h4>

            <div className="space-y-4 text-white/70">
              <p>243 Brunswick Street<br />Fortitude Valley, Brisbane QLD</p>
              <p>Friday & Saturday: 9pm - Til Late</p>
              <p>marketing@kommunity.com.au</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-white/50 sm:px-6 lg:px-8">
            © All Rights Reserved. Kommunity Nightclub 2026.
          </div>
        </div>
      </footer>
    </div>
  );
}
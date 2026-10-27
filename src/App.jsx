const navItems = [
  { label: 'What’s On', href: '#events' },
  { label: 'VIP Booths', href: '#vip' },
  { label: 'Functions', href: '#functions' },
  { label: 'Contact', href: '#contact' },
];

const eventCards = [
  {
    title: 'House Party Nights',
    date: 'Friday 9:00 PM',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    tag: 'Live DJs',
  },
  {
    title: 'Saturday Sessions',
    date: 'Saturday 9:30 PM',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    tag: 'Premium Beats',
  },
  {
    title: 'Private Functions',
    date: 'Book Your Night',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    tag: 'Events',
  },
];

const getDriveImageUrl = (input) => {
  if (!input) {
    return 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80';
  }

  if (input.includes('drive.google.com')) {
    const match = input.match(/(?:id=|d\/)([a-zA-Z0-9_-]{10,})/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return input;
  }

  return input;
};

const mainPageImage = getDriveImageUrl(import.meta.env.VITE_MAIN_IMAGE_URL);

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-pink-500 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Kommunity home">
            <img
              src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-logo.svg"
              alt="Kommunity Nightclub"
              className="h-10 w-auto"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.2em] text-slate-200 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-brand-pink">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-brand-pink hover:text-brand-pink"
            >
              Bookings
            </a>
          </div>
        </div>
      </header>

      <main>
        <section
          className="relative isolate overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(9,9,15,0.76), rgba(9,9,15,0.42)), url(${mainPageImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(254,0,139,0.24),_transparent_45%)]" />
          <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-8">
              <p className="text-sm uppercase tracking-[0.4em] text-pink-200">Fortitude Valley • Brisbane</p>
              <h1 className="text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
                This is your <span className="text-brand-pink">Kommunity</span>
              </h1>
              <h2 className="max-w-xl text-xl text-slate-200 md:text-2xl">
                Get ready to dance your heart out all night long with the hottest Kommunity in town.
              </h2>

              <div className="flex flex-wrap gap-4 pt-3">
                <a
                  href="#events"
                  className="rounded-full bg-brand-pink px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-glow transition hover:scale-[1.02]"
                >
                  Events
                </a>
                <a
                  href="#vip"
                  className="rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-brand-pink hover:text-brand-pink"
                >
                  Bottle Service
                </a>
                <a
                  href="#functions"
                  className="rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-brand-pink hover:text-brand-pink"
                >
                  Functions
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between gap-4">
            <h3 className="text-4xl font-black text-white">
              What’s <span className="text-brand-pink">On</span>
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {eventCards.map((event) => (
              <article
                key={event.title}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/50"
              >
                <div
                  className="h-72 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="space-y-3 p-6">
                  <span className="inline-block rounded-full border border-brand-pink/60 bg-brand-pink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-200">
                    {event.tag}
                  </span>
                  <h4 className="text-2xl font-bold text-white">{event.title}</h4>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{event.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="vip" className="bg-[#111827] py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-pink">VIP Experience</p>
              <h3 className="mb-6 text-4xl font-black text-white">
                Get our <span className="text-brand-pink">VIP Experience</span>
              </h3>
              <div className="mb-6 h-px w-24 bg-brand-pink" />
              <p className="max-w-xl text-lg text-slate-300">
                The VIP booths and bottle service at Kommunity nightclub is the epitome of luxury and exclusivity,
                providing a lavish night out to party-goers.
              </p>
              <div className="mt-8">
                <a
                  href="#contact"
                  className="inline-flex rounded-full bg-brand-pink px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:scale-[1.02]"
                >
                  VIP Booths
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-vip-booths-bottle-service.png"
                alt="VIP booth and bottle service"
                className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950 object-cover shadow-2xl shadow-pink-950/20"
              />
            </div>
          </div>
        </section>

        <section id="functions" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-brand-pink">Private Events</p>
                <h3 className="text-4xl font-black text-white">Host your next unforgettable night.</h3>
                <p className="mt-4 max-w-xl text-lg text-slate-300">
                  From birthdays to corporate nights, Kommunity offers a premium venue experience designed for memorable evenings.
                </p>
              </div>

              <div className="rounded-3xl border border-brand-pink/30 bg-brand-pink/10 p-6 text-slate-100">
                <p className="text-sm uppercase tracking-[0.24em] text-pink-200">Need a booking?</p>
                <p className="mt-3 text-2xl font-bold">Book your event today.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <img
              src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-logo.svg"
              alt="Kommunity Nightclub"
              className="h-12 w-auto"
            />
            <p className="max-w-md text-slate-300">
              Thanks for partying with our Kommunity! Keep an eye out for upcoming events and follow us on social media for news and updates. See you soon!
            </p>
            <div className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.2em] text-slate-300">
              <a href="#" className="transition hover:text-brand-pink">Careers</a>
              <a href="#" className="transition hover:text-brand-pink">Privacy Policy</a>
              <a href="#" className="transition hover:text-brand-pink">Privately owned</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-white">Get in touch</h4>
            <ul className="space-y-4 text-slate-300">
              <li>243 Brunswick Street, Fortitude Valley, Brisbane QLD</li>
              <li>Friday &amp; Saturday: 9pm - Til Late</li>
              <li>marketing@kommunity.com.au</li>
            </ul>
            <div className="flex gap-4 text-brand-pink">
              <a href="https://www.facebook.com/kommunitybrisbane" target="_blank" rel="noreferrer" aria-label="Facebook">Facebook</a>
              <a href="https://www.instagram.com/kommunitybne/" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
            © All Rights Reserved. Kommunity Nightclub 2026.
          </div>
        </div>
      </footer>
    </div>
  );
}

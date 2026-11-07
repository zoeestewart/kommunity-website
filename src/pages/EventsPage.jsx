import siteConfig from "../siteConfig";

const { guestlist } = siteConfig;

// One-off events with a `date` (YYYY-MM-DD) disappear after that day.
const events = [
  {
    title: "P.L.X. NRG: 90s Rave NRG Returns",
    date: "2026-11-21",
    when: "Saturday 21 November 2026",
    description:
      "Rhythmiic Productions presents Peace, Love, XTC with Human Resource: The Dominator. Guestlist offers don't apply to this event.",
    image: "/images/plx-nrg-2026-11-21.jpg",
    alt: "P.L.X. NRG poster: Human Resource, The Dominator, 21 November, Kommunity Club Brisbane, 90s Rave NRG returns",
  },
  {
    title: "Fridays at Kommunity",
    when: `Every Friday · ${siteConfig.venue.openingHours}`,
    description: `Free entry via the guestlist until ${guestlist.freeUntil}. Get your name down before ${guestlist.closes}.`,
    image: "/images/fridays.jpg",
    alt: "Fridays at Kommunity poster: 9pm til late, free entry via guestlist, Fortitude Valley",
    guestlist: true,
  },
  {
    title: "Saturdays at Kommunity",
    when: `Every Saturday · ${siteConfig.venue.openingHours}`,
    description: "BIGDOG on the decks from 9pm til late. A packed dancefloor in the heart of the Valley.",
    image: "/images/saturdays-bigdog.jpg",
    alt: "Saturdays at Kommunity poster with DJ BIGDOG, 9pm til late",
  },
];

function isUpcoming(event) {
  if (!event.date) return true;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Brisbane" });
  return event.date >= today;
}

export default function EventsPage() {
  const upcomingEvents = events.filter(isUpcoming);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <header className="mb-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">Entertainment</p>
        <h1 className="text-4xl font-black sm:text-6xl">What's <span className="text-pink-500">on</span></h1>
        <p className="mt-4 max-w-xl text-lg leading-7 text-white/65">Your next night out starts here. Join us in Fortitude Valley every weekend.</p>
      </header>
      <div className="mb-10 flex flex-col gap-4 border-l-2 border-pink-500 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Free entry</p>
          <p className="mt-2 text-lg font-bold">Join the {guestlist.night} guestlist</p>
          <p className="mt-1 text-sm leading-6 text-white/65">
            Free entry until {guestlist.freeUntil}. Guestlist closes at {guestlist.closes}. Enter the draw to win a VIP wristband.
          </p>
        </div>
        <a
          className="shrink-0 self-start bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300 sm:self-auto"
          href={guestlist.url}
          rel="noreferrer"
          target="_blank"
        >
          Get on the guestlist
        </a>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {upcomingEvents.map((event) => (
          <article className="flex flex-col overflow-hidden border border-white/10 bg-white/[0.04]" key={event.title}>
            <img className="aspect-[4/5] w-full object-cover" src={event.image} alt={event.alt} loading="lazy" />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-300">{event.when}</p>
              <h2 className="mt-3 text-2xl font-bold">{event.title}</h2>
              <p className="mt-3 leading-6 text-white/65">{event.description}</p>
              {event.guestlist && (
                <a
                  className="mt-4 self-start font-bold text-pink-300 transition hover:text-pink-200"
                  href={guestlist.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Get on the guestlist →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

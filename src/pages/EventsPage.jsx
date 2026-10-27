const events = [
  {
    title: "Saturday Night",
    date: "Every Saturday · 9pm till late",
    description: "A packed dancefloor, late-night DJs, and the best of Brisbane's club scene.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
    alt: "Crowd enjoying a live music event",
  },
  {
    title: "Birthday Sessions",
    date: "Fridays · 9pm till late",
    description: "Bring your people together for a birthday night with room to celebrate.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
    alt: "Festival crowd beneath stage lights",
  },
  {
    title: "Weekend at Kommunity",
    date: "Friday & Saturday",
    description: "Meet up, find the music, and make the most of your weekend in the Valley.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
    alt: "People dancing together at a concert",
  },
];

export default function EventsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <header className="mb-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">Entertainment</p>
        <h1 className="text-4xl font-black sm:text-6xl">What's <span className="text-pink-500">on</span></h1>
        <p className="mt-4 max-w-xl text-lg leading-7 text-white/65">Your next night out starts here. Join us in Fortitude Valley every weekend.</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <article className="overflow-hidden border border-white/10 bg-white/[0.04]" key={event.title}>
            <img className="aspect-[4/3] w-full object-cover" src={event.image} alt={event.alt} loading="lazy" />
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-300">{event.date}</p>
              <h2 className="mt-3 text-2xl font-bold">{event.title}</h2>
              <p className="mt-3 leading-6 text-white/65">{event.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
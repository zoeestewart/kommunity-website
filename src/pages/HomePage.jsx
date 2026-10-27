import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section
        className="relative flex min-h-[68vh] items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(10,8,10,.88), rgba(10,8,10,.18)), url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=85)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">
            Fortitude Valley, Brisbane
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
            This is your <span className="text-pink-500">Kommunity.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-white/80">
            Big nights, great music, and the people you came to see. Find your next night out in the heart of the Valley.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300" to="/events">
              Explore what's on
            </Link>
            <Link className="border border-white/40 px-6 py-3 font-bold transition hover:border-pink-400 hover:bg-white/10" to="/vip">
              Book VIP
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <Link className="border-l-2 border-pink-500 bg-white/[0.04] p-7 transition hover:bg-white/[0.08]" to="/vip">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Private bookings</p>
          <h2 className="mt-3 text-2xl font-bold">Bring your people together</h2>
          <p className="mt-3 text-white/65">Make your next celebration a night in the Valley.</p>
        </Link>
        <Link className="border-l-2 border-pink-500 bg-white/[0.04] p-7 transition hover:bg-white/[0.08]" to="/contact">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Find us</p>
          <h2 className="mt-3 text-2xl font-bold">Meet us on Brunswick Street</h2>
          <p className="mt-3 text-white/65">243 Brunswick Street, Fortitude Valley.</p>
        </Link>
      </section>
    </>
  );
}
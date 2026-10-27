import { Link } from "react-router-dom";

export default function FunctionsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">Private bookings</p>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl">Bring your <span className="text-pink-500">people together.</span></h1>
        <p className="mt-5 text-lg leading-7 text-white/65">Planning a birthday, work party, or a reason to celebrate? Make Kommunity your setting for a big night in the Valley.</p>
      </header>
      <div className="flex flex-col items-start justify-between gap-6 border-l-2 border-pink-500 bg-white/[0.05] p-7 sm:flex-row sm:items-center sm:p-9">
        <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">Tell us what you're planning and we'll help bring it to life.</h2>
        <Link className="shrink-0 bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300" to="/contact">Enquire now</Link>
      </div>
    </section>
  );
}
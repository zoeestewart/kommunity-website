import { Link } from "react-router-dom";

export default function VIPPage() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">A little extra</p>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl">Your night, <span className="text-pink-500">elevated.</span></h1>
        <p className="mt-5 max-w-xl text-lg leading-7 text-white/65">
          Settle into a VIP booth with bottle service and space for your crew. Make the night yours from the moment you arrive.
        </p>
        <Link className="mt-7 inline-flex bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300" to="/contact">
          Enquire about VIP
        </Link>
      </div>
      <img
        className="max-h-[560px] w-full object-contain"
        src="https://kommunity.com.au/wp-content/uploads/2023/10/kommunity-vip-booths-bottle-service.png"
        alt="VIP booth and bottle service at Kommunity"
        loading="lazy"
      />
    </section>
  );
}
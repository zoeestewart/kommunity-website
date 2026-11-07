import { Link } from "react-router-dom";
import siteConfig from "../siteConfig";
import VenueDetails from "./VenueDetails";
import VipBookingForm from "./VipBookingForm";

export default function VIPPage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">A little extra</p>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">Your night, <span className="text-pink-500">elevated.</span></h1>
          <p className="mt-5 max-w-xl text-lg leading-7 text-white/65">
            Settle into a VIP booth with bottle service and space for your crew. Make the night yours from the moment you arrive.
          </p>
          <p className="mt-4 text-lg font-bold text-pink-300">
            VIP packages from ${siteConfig.bookings.vipStartingPrice}
          </p>
          <Link className="mt-7 inline-flex bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300" to="/vip#book">
            Book a VIP table
          </Link>
        </div>
        <img
          className="max-h-[560px] w-full object-contain"
          src="/images/vip-booths.jpg"
          alt="Kommunity VIP booth with champagne and vodka on ice, offering bottle display with mixers, a dedicated bottle staff member and VIP entry wristbands"
        />
      </section>
      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24" id="book">
        <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-16">
          <VipBookingForm />
          <div className="space-y-8">
            <p className="leading-7 text-white/65">
              Planning a private function or need a call-back?{" "}
              <Link className="text-pink-300 hover:text-pink-200" to="/contact#enquiry">Send us an enquiry</Link>.
            </p>
            <VenueDetails />
          </div>
        </div>
      </section>
    </>
  );
}

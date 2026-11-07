import { useState } from "react";
import { Link } from "react-router-dom";
import siteConfig from "../siteConfig";
import VenueDetails from "./VenueDetails";

const fallbackError = `Your enquiry could not be sent. Please email ${siteConfig.emails.bookings} instead.`;

function useEnquiry() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function sendEnquiry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const response = await fetch(siteConfig.enquiry.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.sent) {
        throw new Error(result.error || fallbackError);
      }

      form.reset();
      setStatus("sent");
    } catch (sendError) {
      setError(sendError instanceof Error && sendError.message !== "Failed to fetch" ? sendError.message : fallbackError);
      setStatus("idle");
    }
  }

  return { status, error, sendEnquiry, reset: () => setStatus("idle") };
}

export default function ContactPage() {
  const enquiry = useEnquiry();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-pink-300">Get in touch</p>
        <h1 className="text-4xl font-black sm:text-6xl">Let's make <span className="text-pink-500">plans.</span></h1>
        <p className="mt-5 text-lg leading-7 text-white/65">
          Planning a private function or want us to call you back? Send us a message and we'll get back to you.
          Looking for a VIP table?{" "}
          <Link className="text-pink-300 hover:text-pink-200" to="/vip#book">Book online</Link>.
        </p>
      </header>
      <div className="grid gap-12 border-t border-white/10 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-16">
        <section className="scroll-mt-24 border border-white/10 bg-white/[0.04] p-6 sm:p-8" id="enquiry">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Enquiries</p>
          <h2 className="text-2xl font-bold">Private functions and call-backs</h2>
          {enquiry.status === "sent" ? (
            <div className="mt-4 border-l-2 border-pink-500 bg-white/[0.04] p-6" role="status">
              <p className="text-lg font-bold">Thanks, your enquiry has been sent.</p>
              <p className="mt-2 text-white/65">We'll get back to you by email as soon as we can.</p>
              <button className="mt-4 font-semibold text-pink-300 transition hover:text-pink-200" onClick={enquiry.reset} type="button">
                Send another enquiry
              </button>
            </div>
          ) : (
          <form className="mt-4 space-y-4" onSubmit={enquiry.sendEnquiry}>
            <input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1} />
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
                <option>Private function</option>
                <option>Call back</option>
                <option>VIP table</option>
                <option>General enquiry</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block text-sm font-semibold" htmlFor="enquiry-message">
              Tell us what you need
              <textarea className="mt-2 block min-h-36 w-full resize-y border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="enquiry-message" name="message" rows="5" required />
            </label>
            {enquiry.error && <p aria-live="assertive" className="text-sm text-red-300">{enquiry.error}</p>}
            <button
              className="bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={enquiry.status === "sending"}
              type="submit"
            >
              {enquiry.status === "sending" ? "Sending…" : "Send enquiry"}
            </button>
          </form>
          )}
        </section>
        <VenueDetails />
      </div>
    </section>
  );
}
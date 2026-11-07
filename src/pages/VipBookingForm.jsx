import { useEffect, useRef, useState } from "react";
import siteConfig from "../siteConfig";

class BookingApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const brisbaneDate = () => {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const addDays = (date, days) => {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
};

const bookingDates = (startDate, days) => Array.from({ length: days + 1 }, (_, index) => addDays(startDate, index))
  .filter((date) => [5, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay()));

const formatBookingDate = (date) => new Intl.DateTimeFormat("en-AU", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
}).format(new Date(`${date}T12:00:00Z`));

async function readResponse(response) {
  let result;
  try {
    result = await response.json();
  } catch {
    throw new BookingApiError("The booking service returned an invalid response.", response.status);
  }

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new BookingApiError("The booking service returned an invalid response.", response.status);
  }
  if (!response.ok) {
    throw new BookingApiError(
      typeof result.message === "string" ? result.message : "The booking request could not be completed.",
      response.status,
    );
  }
  return result;
}

export default function VipBookingForm() {
  const today = brisbaneDate();
  const isBookingApiEnabled = siteConfig.bookings.onlineEnabled;
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState({});
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [showContactFallback, setShowContactFallback] = useState(false);
  const [availabilityRefresh, setAvailabilityRefresh] = useState(0);
  const confirmationRef = useRef(null);
  const earliestDate = addDays(today, siteConfig.bookings.minNoticeDays);
  const bookingDateOptions = bookingDates(earliestDate, 90 - siteConfig.bookings.minNoticeDays);
  const availability = date ? slots[date] : null;

  useEffect(() => {
    if (!isBookingApiEnabled) {
      setIsChecking(false);
      setShowContactFallback(true);
      return undefined;
    }

    const controller = new AbortController();
    setIsChecking(true);
    setShowContactFallback(false);

    fetch(`${siteConfig.bookings.apiUrl}?from=${encodeURIComponent(earliestDate)}&to=${encodeURIComponent(addDays(today, 90))}`, {
      signal: controller.signal,
    })
      .then(readResponse)
      .then((result) => {
        if (!result.slots || typeof result.slots !== "object" || Array.isArray(result.slots)) {
          throw new BookingApiError("The booking service returned an invalid availability grid.");
        }
        setSlots(result.slots);
        setShowContactFallback(false);
        setAvailabilityMessage("Choose a Friday or Saturday. Availability is shown in Brisbane time.");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setSlots({});
          setAvailabilityMessage(error.message || "We couldn't check availability. Please try again.");
          setShowContactFallback(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsChecking(false);
        }
      });

    return () => controller.abort();
  }, [availabilityRefresh, today, earliestDate, isBookingApiEnabled]);

  // Bring the confirmation into view when a booking succeeds.
  useEffect(() => {
    if (bookingMessage) {
      confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [bookingMessage]);

  async function submitBooking(event) {
    event.preventDefault();
    setBookingMessage("");
    setBookingError("");

    if (!isBookingApiEnabled) {
      setBookingError("Online bookings are currently unavailable. Please send us an enquiry instead.");
      setShowContactFallback(true);
      return;
    }

    if (!availability?.available || !date) {
      setBookingError("Choose an available Friday or Saturday from the booking grid.");
      return;
    }

    // Keep a reference to the form: event.currentTarget is cleared once we await.
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);

    try {
      const response = await fetch(siteConfig.bookings.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          guests: formData.get("guests"),
          date,
          time: "21:00",
          website: formData.get("website"),
        }),
      });
      const result = await readResponse(response);
      const guests = Number(formData.get("guests"));
      setBookingMessage(
        `Your VIP table is booked for ${formatBookingDate(date)}, ${siteConfig.bookings.vipStartTime}–${siteConfig.bookings.vipEndTime}, for ${guests} ${guests === 1 ? "guest" : "guests"}. See you there!`,
      );
      setSlots((currentSlots) => ({
        ...currentSlots,
        [date]: {
          available: result.slotsRemaining > 0,
          slotsRemaining: result.slotsRemaining,
        },
      }));
      form.reset();
      setDate("");
    } catch (error) {
      setBookingError(error.message || "We couldn't complete the booking. Please try again.");
      if (error.status === undefined || error.status >= 500) {
        setShowContactFallback(true);
      }
      if (error.status === 409) {
        setSlots((currentSlots) => ({
          ...currentSlots,
          [date]: { available: false, slotsRemaining: 0 },
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Book online</p>
      <h2 className="text-2xl font-bold">VIP table</h2>
      <p className="mt-3 leading-6 text-white/65">
        VIP packages start at ${siteConfig.bookings.vipStartingPrice}. Pick a Friday or Saturday. Bookings start at{" "}
        {siteConfig.bookings.vipStartTime} and run for {siteConfig.bookings.vipDurationHours} hours. Please book at least one week ahead.
      </p>
      {!isBookingApiEnabled ? (
        <div className="mt-6">
          <p className="text-sm leading-6 text-white/65">
            To book a VIP table, send us an enquiry with your preferred date and number of guests and we’ll get back to you.
          </p>
          <a
            className="mt-4 inline-flex bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300"
            href="#enquiry"
          >
            Enquire about a VIP table
          </a>
        </div>
      ) : <form className="mt-6 space-y-5" onSubmit={submitBooking}>
        <fieldset>
          <legend className="text-sm font-semibold">Choose a date and time</legend>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="min-h-6 text-sm text-white/65">
              {isChecking ? "Loading available bookings…" : availabilityMessage}
            </p>
            <button
              className="text-xs font-semibold text-pink-200 underline decoration-white/30 underline-offset-4 transition hover:text-white disabled:opacity-50"
              disabled={isChecking || isSubmitting}
              onClick={() => setAvailabilityRefresh((current) => current + 1)}
              type="button"
            >
              Refresh availability
            </button>
          </div>
          <div aria-label="VIP table availability by date" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {bookingDateOptions.map((bookingDate) => {
              const slot = slots[bookingDate];
              const isAvailable = !isChecking && slot?.available;
              const isSelected = date === bookingDate;
              const slotLabel = isChecking
                ? "Checking"
                : !slot
                  ? "Unavailable"
                  : slot.slotsRemaining === 0
                    ? "Fully booked"
                    : `${slot.slotsRemaining} ${slot.slotsRemaining === 1 ? "table left" : "tables available"}`;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 disabled:cursor-not-allowed disabled:opacity-55 ${
                    isSelected
                      ? "border-pink-400 bg-pink-500/15"
                      : isAvailable
                        ? "border-green-400/40 hover:border-green-300"
                        : "border-white/10"
                  }`}
                  disabled={!isAvailable || isSubmitting}
                  key={bookingDate}
                  onClick={() => {
                    setDate(bookingDate);
                    setBookingMessage("");
                    setBookingError("");
                  }}
                  type="button"
                >
                  <span className="block font-semibold">{formatBookingDate(bookingDate)}</span>
                  <span className="mt-1 block text-xs text-white/55">
                    {siteConfig.bookings.vipStartTime} · {siteConfig.bookings.vipDurationHours} hours
                  </span>
                  <span className={`mt-2 block text-xs font-semibold ${slot?.slotsRemaining > 0 ? "text-green-300" : "text-white/45"}`}>
                    {slotLabel}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/55">
            <span><span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-green-300" />Available</span>
            <span><span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-white/40" />Fully booked</span>
          </div>
        </fieldset>
        {date && availability?.available && (
          <p className="text-sm text-pink-200">
            Selected: {formatBookingDate(date)}, {siteConfig.bookings.vipStartTime}–{siteConfig.bookings.vipEndTime}
          </p>
        )}
        <label className="block text-sm font-semibold" htmlFor="vip-name">
          Your name
          <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="vip-name" name="name" autoComplete="name" maxLength="100" required />
        </label>
        <label className="block text-sm font-semibold" htmlFor="vip-email">
          Email address
          <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="vip-email" name="email" type="email" autoComplete="email" maxLength="254" required />
          <span className="mt-2 block text-xs font-normal text-white/50">Your email is saved with the calendar booking. Confirmation appears on this page.</span>
        </label>
        <label className="block text-sm font-semibold" htmlFor="vip-guests">
          Number of guests
          <input className="mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white focus:border-pink-400 focus:outline-none" id="vip-guests" name="guests" type="number" min="1" max="999" required />
        </label>
        <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden" htmlFor="vip-website">
          Leave this field empty
          <input autoComplete="off" id="vip-website" name="website" tabIndex="-1" />
        </label>
        {bookingMessage && (
          <div
            className="border border-green-400/40 bg-green-500/10 p-4"
            ref={confirmationRef}
            role="status"
          >
            <p className="font-semibold text-green-300">Booking confirmed</p>
            <p className="mt-1 text-sm leading-6 text-white/80">{bookingMessage}</p>
          </div>
        )}
        {bookingError && <p aria-live="assertive" className="text-sm text-red-300">{bookingError}</p>}
        {showContactFallback && (
          <a
            className="inline-flex border border-white/30 px-5 py-3 font-semibold transition hover:border-pink-400 hover:text-pink-300"
            href="#enquiry"
          >
            Send us an enquiry instead
          </a>
        )}
        <button
          className="block bg-pink-500 px-6 py-3 font-bold text-black transition hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting || isChecking || !availability?.available || !date}
          type="submit"
        >
          {isSubmitting ? "Booking…" : "Book VIP table"}
        </button>
      </form>}
    </section>
  );
}

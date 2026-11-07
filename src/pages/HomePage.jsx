import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import siteConfig from "../siteConfig";

export default function HomePage() {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [instagramFeedState, setInstagramFeedState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadInstagramPosts() {
      try {
        const response = await fetch(siteConfig.instagram.apiUrl, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Instagram feed request failed.");
        }

        const feed = await response.json();
        if (!Array.isArray(feed.posts)) {
          throw new Error("Instagram feed response was invalid.");
        }

        setInstagramPosts(feed.posts);
        setInstagramFeedState("loaded");
      } catch (error) {
        if (error.name !== "AbortError") {
          setInstagramFeedState("error");
        }
      }
    }

    loadInstagramPosts();
    return () => controller.abort();
  }, []);

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
            <Link className="border border-white/40 px-6 py-3 font-bold transition hover:border-pink-400 hover:bg-white/10" to="/vip#book">
              Book VIP
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <a
          className="border-l-2 border-pink-500 bg-white/[0.04] p-7 transition hover:bg-white/[0.08]"
          href={siteConfig.guestlist.url}
          rel="noreferrer"
          target="_blank"
        >
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Free entry</p>
          <h2 className="mt-3 text-2xl font-bold">Get on the guestlist</h2>
          <p className="mt-3 text-white/65">
            {siteConfig.guestlist.night}s, free until {siteConfig.guestlist.freeUntil}. Guestlist closes at {siteConfig.guestlist.closes}.
          </p>
        </a>
        <Link className="border-l-2 border-pink-500 bg-white/[0.04] p-7 transition hover:bg-white/[0.08]" to="/vip#book">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Private bookings</p>
          <h2 className="mt-3 text-2xl font-bold">Bring your people together</h2>
          <p className="mt-3 text-white/65">Make your next celebration a night in the Valley.</p>
        </Link>
        <Link className="border-l-2 border-pink-500 bg-white/[0.04] p-7 transition hover:bg-white/[0.08]" to="/contact">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">Find us</p>
          <h2 className="mt-3 text-2xl font-bold">Meet us on Brunswick Street</h2>
          <p className="mt-3 text-white/65">{siteConfig.venue.streetAddress}, {siteConfig.venue.suburb}.</p>
        </Link>
      </section>
      <section aria-labelledby="instagram-posts-heading" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-300">From our Instagram</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl" id="instagram-posts-heading">The latest from the Kommunity</h2>
            </div>
            <a
              className="inline-flex shrink-0 items-center gap-2 self-start border border-white/30 px-5 py-3 font-bold transition hover:border-pink-400 hover:text-pink-300 sm:self-auto"
              href={siteConfig.instagram.profileUrl}
              rel="noreferrer"
              target="_blank"
            >
              <FaInstagram aria-hidden="true" size={20} />
              Follow @kommunitybne
            </a>
          </div>
          {instagramFeedState === "loading" && (
            <div aria-label="Loading latest Instagram posts" aria-live="polite" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6" role="status">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="aspect-square animate-pulse bg-white/10" key={index} />
              ))}
            </div>
          )}
          {instagramFeedState === "error" && (
            <p className="border border-white/10 px-5 py-6 text-white/65" role="status">
              Instagram posts are temporarily unavailable. Visit our profile for the latest.
            </p>
          )}
          {instagramFeedState === "loaded" && instagramPosts.length === 0 && (
            <p className="border border-white/10 px-5 py-6 text-white/65" role="status">
              No Instagram posts to show just yet. Check back soon.
            </p>
          )}
          {instagramFeedState === "loaded" && instagramPosts.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {instagramPosts.map((post) => {
                const imageUrl = post.thumbnail_url || post.media_url;
                const caption = typeof post.caption === "string" ? post.caption : "";

                return (
                  <a
                    className="group overflow-hidden border border-white/10 bg-black/20 transition hover:border-pink-400"
                    href={post.permalink}
                    key={post.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {imageUrl ? (
                      <img
                        alt={caption ? caption.slice(0, 120) : "Instagram post from @kommunitybne"}
                        className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                        src={imageUrl}
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-white/5 px-4 text-center text-sm text-white/60">
                        View post on Instagram
                      </div>
                    )}
                    {caption && <p className="line-clamp-3 p-3 text-sm leading-5 text-white/75">{caption}</p>}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
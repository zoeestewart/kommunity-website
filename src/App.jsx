import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink, Outlet } from "react-router-dom";

const navigation = [
  { label: "Home", to: "/" },
  { label: "What's on", to: "/events" },
  { label: "VIP", to: "/vip" },
  { label: "Contact", to: "/contact" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const focusableElements = drawerRef.current.querySelectorAll("a[href], button:not([disabled])");
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    firstElement?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      } else if (event.key === "Tab" && event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      menuButtonRef.current?.focus();
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-[#100d10] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100d10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Kommunity home">
            <img className="h-9 w-auto" src="/kommunity-logo.svg" alt="Kommunity" />
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 sm:flex">
            {navigation.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `whitespace-nowrap text-sm transition hover:text-pink-300 ${isActive ? "text-pink-300" : "text-white/75"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link className="bg-[#ff2c8a] px-4 py-2 text-sm font-bold text-black transition hover:bg-pink-300" to="/contact">Bookings</Link>
            <button
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex size-10 items-center justify-center border border-white/20 text-white transition hover:border-pink-400 hover:text-pink-300 sm:hidden"
              onClick={() => setIsMenuOpen(true)}
              ref={menuButtonRef}
              type="button"
            >
              <FiMenu aria-hidden="true" size={21} />
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 h-full w-full bg-black/70"
            onClick={() => setIsMenuOpen(false)}
            type="button"
          />
          <aside
            aria-label="Mobile navigation"
            aria-modal="true"
            className="absolute inset-y-0 right-0 flex w-[min(84vw,360px)] flex-col border-l border-white/10 bg-[#151015] p-6 shadow-2xl"
            id="mobile-navigation"
            ref={drawerRef}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">Menu</span>
              <button
                aria-label="Close navigation menu"
                className="inline-flex size-10 items-center justify-center border border-white/20 text-white transition hover:border-pink-400 hover:text-pink-300"
                onClick={() => setIsMenuOpen(false)}
                type="button"
              >
                <FiX aria-hidden="true" size={21} />
              </button>
            </div>
            <nav aria-label="Mobile navigation links" className="flex flex-col py-5">
              {navigation.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `border-b border-white/10 py-4 text-lg font-semibold transition hover:text-pink-300 ${isActive ? "text-pink-300" : "text-white/80"}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <Link
              className="mt-auto bg-[#ff2c8a] px-5 py-3 text-center font-bold text-black transition hover:bg-pink-300"
              onClick={() => setIsMenuOpen(false)}
              to="/contact"
            >
              Bookings
            </Link>
          </aside>
        </div>
      )}
      <main className="min-h-[55vh]"><Outlet /></main>
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-lg font-bold">Kommunity</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">Brisbane nights, made for your Kommunity.</p>
          </div>
          <div className="text-sm leading-7 text-white/65 md:text-right">
            <p className="font-semibold text-white">243 Brunswick Street</p>
            <p>Fortitude Valley, Brisbane QLD</p>
            <a className="transition hover:text-white" href="mailto:marketing@kommunity.com.au">marketing@kommunity.com.au</a>
          </div>
        </div>
        <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45">© 2026 Kommunity Nightclub</p>
      </footer>
    </div>
  );
}
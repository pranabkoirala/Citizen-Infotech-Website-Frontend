import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/inside", label: "Life at Citizen Infotech" },
  { to: "/team", label: "Team" },
  { to: "/careers", label: "Careers" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { logoVariant } = useTheme();

  return (
    <>
      {/* Nav bar — explicit h-16 locks its height; nothing inside can make it grow */}
      <nav className="site-navbar fixed left-0 right-0 top-0 z-50 h-16 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="site-navbar__inner flex h-full w-full min-w-0 items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center text-foreground transition-colors hover:text-primary md:-ml-2"
            aria-label="Citizen Infotech home"
          >
            {logoVariant === "png" ? (
              <img
                src="/citizen-infotech-logo.png"
                alt="Citizen Infotech"
                className="h-10 w-auto md:h-12"
              />
            ) : (
              <span className="theme-logo" aria-hidden="true" />
            )}
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm transition-colors hover:text-primary ${pathname === l.to ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Get in touch
            </Link>
            <ThemeSwitcher />
          </div>

          {/* Mobile toggle */}
          <div className="site-navbar__mobile-actions flex shrink-0 items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <button
              onClick={() => setOpen((current) => !current)}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/*
        Mobile menu lives OUTSIDE <nav> entirely — a separate fixed element
        pinned to top-16 (= nav height). The nav's blur/border/background are
        fully isolated and cannot be affected by AnimatePresence mount/unmount.
        z-40 keeps it below the nav bar (z-50) so the bar always sits on top.
      */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="site-mobile-menu fixed inset-x-0 top-16 z-40 max-w-full overflow-x-hidden border-b border-border bg-background md:hidden"
          >
            <div className="box-border flex w-full flex-col gap-2 px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`py-2 text-sm transition-colors ${pathname === l.to ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

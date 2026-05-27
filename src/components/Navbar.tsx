import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";


const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/inside", label: "Life at citizen infotech" },
  { to: "/team", label: "Team" },
  { to: "/careers", label: "Careers" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container-tight flex h-16 items-center justify-between px-6">
        <Link to="/" className="-ml-2 flex items-center text-foreground transition-colors hover:text-primary" aria-label="Citizen Infotech home">
          <span className="theme-logo" aria-hidden="true" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition-colors hover:text-primary ${
                pathname === l.to ? "text-primary font-medium" : "text-muted-foreground"
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
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm ${pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

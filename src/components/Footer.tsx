import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container-tight section-padding !py-16">
      <div className="grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-heading text-lg font-bold text-foreground">Citizen Infotech</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Citizen Infotech provides innovative, scalable solutions to drive business growth and efficiency.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Company</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/about", label: "About us" },
              { to: "/team", label: "Our team" },
              { to: "/careers", label: "Careers" },
              { to: "/work", label: "Our work" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="mailto:info@citizeninfotechnepal.com" className="flex items-center gap-2 hover:text-primary">
              <Mail size={14} /> info@citizeninfotechnepal.com
            </a>
            <a href="tel:+9779768770259" className="flex items-center gap-2 hover:text-primary">
              <Phone size={14} /> +977-9768770259
            </a>
            <span className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> Pashupati Colony, Mid Baneshwor, Kathmandu, Nepal
            </span>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 Citizen Infotech. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

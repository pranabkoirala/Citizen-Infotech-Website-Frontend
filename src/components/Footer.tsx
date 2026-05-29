import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin } from "lucide-react";
import { settingsApi } from "@/lib/api";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  const email = settings?.contact_email || "info@citizeninfotechnepal.com";
  const phone = settings?.contact_phone || "+977-9768770259";
  const address = settings?.contact_address || "Pashupati Colony, Mid Baneshwor, Kathmandu, Nepal";
  const phoneHref = phone.replace(/[^\d+]/g, "");

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-tight section-padding !py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img
              src="/citizen-infotech-logo.png"
              alt="Citizen Infotech"
              className="mb-4 h-14 w-auto object-contain"
            />
            {/* <h3 className="mb-3 font-heading text-lg font-bold text-foreground">Citizen Infotech</h3> */}
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
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail size={14} /> {email}
              </a>
              <a href={`tel:${phoneHref}`} className="flex items-center gap-2 hover:text-primary">
                <Phone size={14} /> {phone}
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" /> {address}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Citizen Infotech. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;


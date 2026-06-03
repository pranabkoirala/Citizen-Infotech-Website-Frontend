import { motion } from "framer-motion";
import { mediaUrl } from "@/lib/api";

export type MarqueeItem = { name: string; logo_url?: string | null };

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const Marquee = ({ items }: { items: MarqueeItem[] }) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        className="marquee-track flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -50 * items.length] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={`${item.name}-${i}`} className="marquee-item flex items-center gap-3 text-lg font-heading font-semibold text-muted-foreground/70">
            <span className="marquee-logo flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-xs font-bold text-primary">
              {item.logo_url ? (
                <img src={mediaUrl(item.logo_url)} alt={`${item.name} logo`} className="h-full w-full object-contain p-1.5" />
              ) : (
                initials(item.name)
              )}
            </span>
            <span className="marquee-name">{item.name}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;

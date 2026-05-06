import { motion } from "framer-motion";

const Marquee = ({ items }: { items: string[] }) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -50 * items.length] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-lg font-heading font-semibold text-muted-foreground/40">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;

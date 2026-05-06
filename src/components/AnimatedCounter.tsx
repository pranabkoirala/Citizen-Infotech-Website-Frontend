import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  value: string;
  label: string;
}

const AnimatedCounter = ({ value, label }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Split the string into numeric and non-numeric segments
    const segments = value.split(/(\d+)/).filter(Boolean).map(part => {
      if (/\d+/.test(part)) {
        return { type: 'number' as const, value: parseInt(part, 10) };
      }
      return { type: 'string' as const, value: part };
    });

    // If there are no numeric segments, just display the value
    if (!segments.some(seg => seg.type === 'number')) {
      setDisplay(value);
      return;
    }

    let step = 0;
    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplay(value); // Ensure it ends exactly on the original string
        clearInterval(timer);
      } else {
        const progress = step / steps;
        const currentDisplay = segments.map(seg => {
          if (seg.type === 'number') {
            return Math.floor(seg.value * progress).toString();
          }
          return seg.value;
        }).join('');
        setDisplay(currentDisplay);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card group relative overflow-hidden rounded-xl p-6 text-center transition-all hover:border-primary/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative font-heading text-3xl font-bold text-primary">{display}</div>
      <div className="relative mt-1 text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export default AnimatedCounter;

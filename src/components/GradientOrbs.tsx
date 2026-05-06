import { motion } from "framer-motion";

const orbs = [
  { color: "hsl(199 89% 48% / 0.12)", size: 500, x: "10%", y: "-10%", duration: 20 },
  { color: "hsl(217 91% 60% / 0.08)", size: 400, x: "70%", y: "20%", duration: 25 },
  { color: "hsl(199 89% 48% / 0.06)", size: 350, x: "40%", y: "60%", duration: 18 },
];

const GradientOrbs = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {orbs.map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          background: orb.color,
          width: orb.size,
          height: orb.size,
          left: orb.x,
          top: orb.y,
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: orb.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default GradientOrbs;

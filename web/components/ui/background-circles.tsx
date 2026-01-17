"use client";

import { motion } from "motion/react";
import { clsx } from "clsx";

interface BackgroundCirclesProps {
  className?: string;
  variant?: keyof typeof COLOR_VARIANTS;
}

const COLOR_VARIANTS = {
  silkroad: {
    border: [
      "border-[#00E500]/60", // Neon Green
      "border-emerald-500/50",
      "border-green-900/30",
    ],
    gradient: "from-[#00E500]/30",
  },
} as const;

const AnimatedGrid = () => (
  <motion.div
    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%"],
    }}
    transition={{
      duration: 40,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    }}
  >
    <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#00E500_0%,#00E500_1px,transparent_1px,transparent_4%)] opacity-10" />
  </motion.div>
);

export function BackgroundCircles({
  className,
  variant = "silkroad",
}: BackgroundCirclesProps) {
  const variantStyles = COLOR_VARIANTS[variant];

  return (
    <div
      className={clsx(
        "absolute inset-0 flex items-center justify-center overflow-hidden -z-10",
        className
      )}
    >
      <AnimatedGrid />
      <motion.div className="absolute h-[600px] w-[600px]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx(
              "absolute inset-0 rounded-full",
              "border-2 bg-gradient-to-br to-transparent",
              variantStyles.border[i],
              variantStyles.gradient
            )}
            animate={{
              rotate: 360,
              scale: [1, 1.05 + i * 0.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div
              className={clsx(
                "absolute inset-0 rounded-full mix-blend-screen",
                `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient.replace(
                  "from-",
                  ""
                )}/10%,transparent_70%)]`
              )}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#00E500/10%,transparent_70%)] blur-[120px]" />
      </div>
    </div>
  );
}
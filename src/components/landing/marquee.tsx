
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const motionRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden [--duration:40s] [--gap:1rem]",
        className
      )}
      {...props}
    >
      <motion.div
        ref={motionRef}
        className={cn("flex w-max items-stretch gap-[--gap]", {
          "flex-row": !vertical,
          "flex-col": vertical,
        })}
        animate={{
          [vertical ? "y" : "x"]: [
            "0%",
            reverse ? "100%" : "-100%",
          ],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          animationPlayState: pauseOnHover ? "paused" : "running",
        }}
        onHoverStart={() => {
          if (pauseOnHover && motionRef.current) {
            motionRef.current.style.animationPlayState = "paused";
          }
        }}
        onHoverEnd={() => {
          if (pauseOnHover && motionRef.current) {
            motionRef.current.style.animationPlayState = "running";
          }
        }}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <React.Fragment key={`marquee-repeat-${i}`}>{children}</React.Fragment>
          ))}
      </motion.div>
    </div>
  );
}

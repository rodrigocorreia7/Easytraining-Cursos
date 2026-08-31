'use client';

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "../../lib/utils";

export interface FloatingDockItem {
  id: string;
  title: string;
  count?: number;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full my-4">
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </div>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  return (
    <div className={cn("flex lg:hidden items-center justify-start sm:justify-center gap-1.5 p-2 bg-slate-100/90 backdrop-blur-md rounded-full border border-slate-200/80 shadow-sm max-w-full overflow-x-auto w-full", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer",
            item.active
              ? "bg-[#052e7f] text-white shadow-md shadow-[#052e7f]/25 scale-105"
              : "text-slate-700 hover:text-slate-950 hover:bg-white/90"
          )}
        >
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {item.icon}
          </span>
          <span className="whitespace-nowrap">{item.title}</span>
          {item.count !== undefined && (
            <span
              className={cn(
                "px-1.5 py-0.2 text-[10px] rounded-full font-black",
                item.active ? "bg-[#00B060] text-white" : "bg-slate-200 text-slate-700"
              )}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "hidden lg:flex h-16 gap-3.5 items-end rounded-full bg-white/95 backdrop-blur-md px-5 pb-3 border border-slate-200/90 shadow-[0_10px_30px_rgba(5,46,127,0.08)]",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.id} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  count,
  icon,
  active,
  onClick,
}: FloatingDockItem & {
  mouseX: any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [46, 76, 46]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [46, 76, 46]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 34, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 34, 20]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 160,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 160,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 160,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 160,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center relative cursor-pointer transition-colors shadow-sm",
          active
            ? "bg-[#052e7f] text-white ring-2 ring-[#00B060] ring-offset-2 shadow-lg shadow-[#052e7f]/30"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-3.5 py-1.5 whitespace-pre rounded-lg bg-[#0A2540] text-white backdrop-blur-md absolute left-1/2 -top-11 w-fit text-[12px] font-bold shadow-xl border border-white/15 z-50 pointer-events-none flex items-center gap-2"
            >
              <span>{title}</span>
              {count !== undefined && (
                <span className="bg-[#00B060] text-white px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {count}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
}

import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function LogoIcon({ size = 36, className = "", priority = false }: LogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="SnapPost AI Logo"
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(124,58,237,0.45)]"
        priority={priority}
      />
    </div>
  );
}

export function BrandLogo({
  size = 36,
  textClassName = "text-lg font-bold tracking-tight text-white",
  priority = false,
}: {
  size?: number;
  textClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} priority={priority} />
      <span className={textClassName}>
        SnapPost <span className="text-violet-400">AI</span>
      </span>
    </div>
  );
}


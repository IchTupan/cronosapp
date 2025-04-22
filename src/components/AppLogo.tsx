
import * as React from "react";

export function AppLogo({ size = 40 }: { size?: number }) {
  // Container limpo, sem blur!
  return (
    <div
      className="flex items-center gap-2 select-none bg-transparent"
      style={{ minWidth: size, minHeight: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 42 42"
        fill="none"
        style={{
          filter: "none",
          background: "transparent",
          zIndex: 10,
          position: "relative"
        }}
      >
        <circle cx="21" cy="21" r="18" stroke="#8B5CF6" strokeWidth="4" fill="#fff" />
        <line
          x1="21"
          y1="21"
          x2="21"
          y2="8"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="21"
          y1="21"
          x2="32"
          y2="21"
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight" style={{ letterSpacing: '-1px', filter: "none", zIndex: 10 }}>
        Crono
      </span>
    </div>
  );
}

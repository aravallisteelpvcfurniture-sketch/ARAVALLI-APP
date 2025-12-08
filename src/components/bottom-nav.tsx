"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

const navItems = [
  { 
    href: "/dashboard", 
    label: "Home",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                stroke={isActive ? "white" : "#6b7280"} 
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" 
                stroke={isActive ? "white" : "#6b7280"} 
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  },
  { 
    href: "/visitors", 
    label: "Visitors",
    icon: (isActive: boolean) => (
      <Users className={cn("h-6 w-6", isActive ? "text-white" : "text-gray-500")} />
    )
  },
  { 
    href: "/scan", 
    label: "Scan",
    icon: (isActive: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7V4C3 3.44772 3.44772 3 4 3H7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 3H20C20.5523 3 21 3.44772 21 4V7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 17V20C21 20.5523 20.5523 21 20 21H17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 21H4C3.44772 21 3 20.5523 3 20V17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 12H17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  { 
    href: "/more", 
    label: "More",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="19" cy="12" r="1" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="5" cy="12" r="1" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden sticky bottom-0 left-0 z-50 w-full h-16 bg-card border-t shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const IconComponent = item.icon;
          const isSpecial = item.href === "/dashboard" || item.href === "/visitors";

          return (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 group"
            >
              <div className={cn(
                "flex items-center justify-center w-12 h-12 transition-colors duration-200 ease-in-out rounded-full",
                isActive && isSpecial ? "bg-primary" : ""
              )}>
                 {IconComponent(isActive)}
              </div>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

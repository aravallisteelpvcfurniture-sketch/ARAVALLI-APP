"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    href: "/dashboard", 
    label: "Home",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={isActive ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke={isActive ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  },
  { 
    href: "/catalogue", 
    label: "Catalogue",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3H8C9.65685 3 11 4.34315 11 6V21H4C2.89543 21 2 20.1046 2 19V3Z" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 3H16C14.3431 3 13 4.34315 13 6V21H20C21.1046 21 22 20.1046 22 19V3Z" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  },
  { 
    href: "/scan", 
    label: "Scan",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7H4V4" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 7H20V4" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 17H4V20" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 17H20V20" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  },
  { 
    href: "/visitors", 
    label: "Visitors",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9992 18.1132 22.7054 17.2523 22.1614 16.5523C21.6173 15.8522 20.8545 15.3512 20 15.13" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.5052 3.32199 16.9634 3.59865 17.3503 3.94533C17.7372 4.29201 18.0423 4.70054 18.25 5.15" stroke={isActive ? '#22c55e' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  },
  { 
    href: "/more", 
    label: "More",
    icon: (isActive: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1" fill={isActive ? '#22c55e' : '#9ca3af'} stroke={isActive ? '#22c55e' : '#9ca3af'} stroke-width="2" stroke-linecap="round"/>
            <circle cx="19" cy="12" r="1" fill={isActive ? '#22c55e' : '#9ca3af'} stroke={isActive ? '#22c55e' : '#9ca3af'} stroke-width="2" stroke-linecap="round"/>
            <circle cx="5" cy="12" r="1" fill={isActive ? '#22c55e' : '#9ca3af'} stroke={isActive ? '#22c55e' : '#9ca3af'} stroke-width="2" stroke-linecap="round"/>
        </svg>
    )
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden sticky bottom-0 left-0 z-50 w-full h-16 bg-card border-t shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn("flex items-center justify-center w-12 h-12 transition-transform duration-200 ease-in-out", isActive && item.href === "/dashboard" ? "bg-primary rounded-full scale-110" : "scale-100")}>
                 {item.icon(isActive)}
              </div>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

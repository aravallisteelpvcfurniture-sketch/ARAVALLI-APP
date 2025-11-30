"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    href: "/dashboard", 
    label: "Home",
    icon: (isActive: boolean) => isActive 
      ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 22V12H15V22" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 12.5L12 3.5L21.5 12.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12H15V22" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
  { 
    href: "/catalogue", 
    label: "Catalogue",
    icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 19Z" fill="#9ca3af"/><path d="M22 19H2V5H22V19Z" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round"/><path d="M16 2V5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/><path d="M8 2V5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/><path d="M2 10H22" stroke="#9ca3af" strokeWidth="2"/></svg>
  },
  { 
    href: "/scan", 
    label: "Scan",
    icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12H15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/><path d="M12 9V15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/><path d="M4 16V8C4 5.79086 5.79086 4 8 4H16C18.2091 4 20 5.79086 20 8V16C20 18.2091 18.2091 20 16 20H8C5.79086 20 4 18.2091 4 16Z" stroke="#9ca3af" strokeWidth="2"/></svg>
  },
  { href: "/visitors", icon: Users, label: "Visitors" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
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
              <div className={cn("flex items-center justify-center w-16 h-12 transition-colors", isActive && item.href === "/dashboard" ? "rounded-full bg-green-100" : "")}>
                 {React.isValidElement(IconComponent) ? IconComponent : <IconComponent isActive={isActive} />}
              </div>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

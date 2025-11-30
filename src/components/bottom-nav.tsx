"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, User, MoreHorizontal, ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/catalogue", icon: Folder, label: "Catalogue" },
  { href: "/scan", icon: ScanSearch, label: "Scan" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden sticky bottom-0 left-0 z-50 w-full h-16 bg-card border-t shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
                {isActive ? (
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                            <item.icon className="w-6 h-6" />
                        </div>
                    </div>
                ) : (
                    <item.icon className="w-6 h-6" />
                )}
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

    
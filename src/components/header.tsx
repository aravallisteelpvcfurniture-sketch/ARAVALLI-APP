"use client";

import { Mountain } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "./auth-button";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0 bg-card">
      <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
        <Mountain className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold text-primary">Aravalli Configurator</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <AuthButton />
      </nav>
    </header>
  );
}

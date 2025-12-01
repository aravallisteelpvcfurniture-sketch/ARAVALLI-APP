"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Aravalli Configurator" }: HeaderProps) {
  return (
    <header 
      className="px-4 lg:px-6 h-16 flex items-center border-b shrink-0 bg-primary text-primary-foreground"
    >
      <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
        <span className="text-xl font-semibold">{title}</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <AuthButton />
      </nav>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { Code2, Menu, X } from "lucide-react";
import { NavbarAuthActions } from "@/components/navbar-auth-actions";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/20 transition-colors">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            Developer Snippet Vault
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        {/* Desktop CTA Buttons / Auth State */}
        <NavbarAuthActions />

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 pt-2 text-sm">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
            >
              How It Works
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
            >
              Dashboard
            </Link>
          </nav>
          <NavbarAuthActions mobile onItemClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

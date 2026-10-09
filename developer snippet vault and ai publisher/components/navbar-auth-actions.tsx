"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface NavbarAuthActionsProps {
  onItemClick?: () => void;
  mobile?: boolean;
}

export function NavbarAuthActions({
  onItemClick,
  mobile = false,
}: NavbarAuthActionsProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Check current auth status on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      if (onItemClick) onItemClick();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  // Render a minimal placeholder while checking initial session to prevent layout jumps
  if (loading) {
    if (mobile) {
      return (
        <div className="pt-3 border-t border-border/50 flex flex-col space-y-2">
          <div className="h-9 rounded-md bg-muted/40 animate-pulse w-full" />
        </div>
      );
    }
    return (
      <div className="hidden md:flex items-center space-x-3">
        <div className="h-9 w-20 rounded-md bg-muted/40 animate-pulse" />
        <div className="h-9 w-28 rounded-md bg-muted/40 animate-pulse" />
      </div>
    );
  }

  // Authenticated State: Show Dashboard and Logout
  if (user) {
    if (mobile) {
      return (
        <div className="pt-3 border-t border-border/50 flex flex-col space-y-2">
          <Link href="/dashboard" onClick={onItemClick}>
            <Button variant="outline" className="w-full justify-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>Logout</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          className="gap-1.5 hover:text-destructive hover:border-destructive/40"
        >
          {loggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          <span>Logout</span>
        </Button>
      </div>
    );
  }

  // Unauthenticated State: Show Sign In and Get Started
  if (mobile) {
    return (
      <div className="pt-3 border-t border-border/50 flex flex-col space-y-2">
        <Link href="/login" onClick={onItemClick}>
          <Button variant="outline" className="w-full justify-center">
            Sign In
          </Button>
        </Link>
        <Link href="/register" onClick={onItemClick}>
          <Button className="w-full justify-center gap-1.5">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-3">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm" className="gap-1.5">
          <span>Get Started</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

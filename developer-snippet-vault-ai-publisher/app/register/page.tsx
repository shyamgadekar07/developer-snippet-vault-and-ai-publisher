"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft, Loader2, AlertCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedFullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMessage("An account with this email already exists. Please sign in instead.");
        } else if (error.message.includes("Password should be")) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(error.message || "Failed to create account. Please try again.");
        }
        return;
      }

      // Check if email confirmation is required:
      // If user is created but session is null, email confirmation is enabled on Supabase.
      if (data?.user && !data?.session) {
        setVerificationRequired(true);
        return;
      }

      // If auto-confirm is enabled or session exists, navigate to /dashboard
      if (data?.session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMessage("A network or configuration error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-border/80 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create an Account
            </CardTitle>
            <CardDescription>
              Start saving and AI-enriching your code snippets today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {verificationRequired ? (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <MailCheck className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Check your email
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We sent a confirmation link to{" "}
                  <strong className="text-foreground">{email}</strong>.
                  Please click the link in your inbox to confirm your account and sign in.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Go to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 p-3.5 text-xs sm:text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="fullName"
                      className="text-xs font-medium text-foreground"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={loading}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="w-full h-10 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium text-foreground"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@example.com"
                      className="w-full h-10 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-foreground"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full h-10 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-medium text-foreground"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full h-10 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 border-t border-border/50 text-center text-xs text-muted-foreground pt-4">
            <div>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { AuthApis } from "@/lib/api/auth.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { initializeUser, loginSuccess } from "@/store/slices/auth.slice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn) {
      router.replace("/");
    }
  }, [loggedIn, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await AuthApis.login(email, password);
    if (response?.success && response?.data?.token) {
      dispatch(loginSuccess({ token: response.data.token }));
      router.push("/");
    } else {
      setError(response?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-text-muted text-center max-w-sm">
            Sign in to your account to manage the On-Demand Service Application.
          </p>
        </div>

        <div className="mt-8 bg-surface py-8 px-4 sm:px-10 shadow-xl shadow-border/50 rounded-2xl border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="block w-full appearance-none rounded-lg border border-border px-3 py-2.5 placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm bg-background transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full appearance-none rounded-lg border border-border px-3 py-2.5 placeholder-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm bg-background transition-all"
              />
            </div>

            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

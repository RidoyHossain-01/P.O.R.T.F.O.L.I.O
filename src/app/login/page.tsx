"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        // Redirection on successful sign-in
        router.push("/admin");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-background text-foreground font-mono">
      {/* Return home link */}
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Site
      </Link>

      <div className="w-full max-w-sm border border-border-custom bg-card rounded-lg p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <span className="inline-block p-2.5 rounded-full bg-primary/10 text-primary mb-3">
            AG
          </span>
          <h1 className="text-xl uppercase tracking-widest font-bold">Admin Portal</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            Access credentials required
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 border border-red-500/20 bg-red-500/10 text-red-500 rounded p-3 text-xs mb-6 font-sans">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary transition-colors font-sans"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-background border border-border-custom rounded focus:outline-none focus:border-primary transition-colors font-sans"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-primary text-primary-foreground font-semibold rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Authorizing...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[9px] text-muted-foreground uppercase tracking-widest border-t border-border-custom pt-4">
          Secured Workspace Access
        </div>
      </div>
    </div>
  );
}

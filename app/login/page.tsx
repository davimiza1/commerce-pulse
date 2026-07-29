"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, LockKeyhole, Mail, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "reset";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const supabase = createClient();

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      });
      setLoading(false);
      setSuccess(!error);
      setMessage(error?.message ?? "Check your email for the password reset link.");
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      setSuccess(!error);
      setMessage(error?.message ?? "Account created. Check your email to confirm your address.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage("");
    setSuccess(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="auth-brand"><span><TrendingUp size={20} /></span>Commerce<strong>Pulse</strong></div>
        <div className="auth-copy">
          <span className="auth-eyebrow"><BarChart3 size={15} /> E-commerce intelligence</span>
          <h1>Know your store.<br />Grow with clarity.</h1>
          <p>All your revenue, orders, customers, and inventory insights in one focused workspace.</p>
        </div>
        <div className="auth-stat"><span>Monthly revenue</span><strong>$248,920</strong><small>↑ 18.2% this period</small></div>
      </section>

      <section className="auth-form-panel">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-mobile-brand"><TrendingUp size={18} />CommercePulse</div>
          <span className="auth-lock"><LockKeyhole size={19} /></span>
          <h2>{mode === "login" ? "Welcome back" : mode === "signup" ? "Create your workspace" : "Reset your password"}</h2>
          <p>{mode === "login" ? "Sign in to continue to your dashboard." : mode === "signup" ? "Start exploring your commerce data today." : "We’ll email you a secure reset link."}</p>

          {mode === "signup" && <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Muhammad Dawood" required /></label>}
          <label>Email address<div className="auth-input"><Mail size={16} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label>
          {mode !== "reset" && <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required /></label>}

          {message && <div className={success ? "auth-message success" : "auth-message"}>{message}</div>}
          <button className="auth-submit" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}<ArrowRight size={16} /></button>

          {mode === "login" && <button type="button" className="auth-link" onClick={() => changeMode("reset")}>Forgot your password?</button>}
          <div className="auth-switch">{mode === "login" ? <>New to CommercePulse? <button type="button" onClick={() => changeMode("signup")}>Create an account</button></> : <>Already have an account? <button type="button" onClick={() => changeMode("login")}>Sign in</button></>}</div>
        </form>
      </section>
    </main>
  );
}

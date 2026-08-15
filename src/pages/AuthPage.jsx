import React, { useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { KeyRound, User, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import GoogleSignInButton from "../components/GoogleSignInButton";

function Field({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-3.5 bg-ink border border-border" style={{ height: 44 }}>
      <Icon size={15} className="text-faint" />
      <input {...props} className="flex-1 bg-transparent outline-none text-[13.5px] text-text" />
    </div>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const navigate = useNavigate();
  const { signup, login, googleAuth } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim() || (isSignup && !fullName.trim())) {
      setError("Fill in every field to continue.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        await signup({ fullName: fullName.trim(), email: email.trim().toLowerCase(), password });
      } else {
        await login({ email: email.trim().toLowerCase(), password });
      }
      navigate("/dashboard/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (idToken) => {
      setError("");
      setSubmitting(true);
      try {
        await googleAuth(idToken);
        navigate("/dashboard/products");
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [googleAuth, navigate]
  );

  return (
    <div className="w-full flex items-center justify-center bg-ink" style={{ minHeight: "100vh", padding: "48px 24px" }}>
      <div className="w-full" style={{ maxWidth: 360 }}>
        <Link to="/" className="text-[12.5px] mb-6 inline-block text-faint">
          &larr; Back to Logson
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3 border-2 border-brass">
            <KeyRound size={18} className="text-brass" />
          </div>
          <span className="font-display font-semibold text-[20px] text-text">Logson</span>
          <p className="text-[13px] mt-1 text-muted">{isSignup ? "Create your account" : "Welcome back"}</p>
        </div>

        {isSignup && (
          <div className="flex items-start gap-2.5 rounded-lg px-3.5 py-3 mb-4 border border-border" style={{ background: "#20180D" }}>
            <ShieldAlert size={15} className="text-brass shrink-0 mt-0.5" />
            <p className="text-[12px] text-muted leading-relaxed">
              If no accounts exist yet on this store, this signup becomes the admin automatically.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-panel p-6">
          <div className="space-y-3">
            {isSignup && <Field icon={User} placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />}
            <Field icon={Mail} placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field icon={Lock} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-[12px] mt-3" style={{ color: "#D8433F" }}>{error}</p>}

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full mt-5 rounded-lg flex items-center justify-center gap-2 bg-brass text-brassDark font-semibold disabled:opacity-60"
            style={{ height: 44 }}
          >
            {submitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>

          <p className="text-center text-[12.5px] mt-4 text-faint">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link to={isSignup ? "/signin" : "/signup"} className="text-brass font-semibold">
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-border" />
            <span className="text-[11px] text-faint">or continue with</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <GoogleSignInButton onCredential={handleGoogleCredential} onError={setError} />
        </div>
      </div>
    </div>
  );
}

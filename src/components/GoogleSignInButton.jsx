import React, { useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Renders Google's own sign-in button via the Identity Services script
 * loaded in index.html. When the person picks an account, Google hands us
 * a signed ID token -- we never see their password, and the backend is
 * the one that actually verifies the token (see app/service/google_oauth.py).
 */
export default function GoogleSignInButton({ onCredential, onError }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response?.credential) onCredential(response.credential);
          else onError?.("Google didn't return a credential.");
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 312,
        shape: "pill",
      });
    };

    if (window.google?.accounts?.id) {
      render();
    } else {
      // The GSI script loads with `defer`, so it may not be ready yet on
      // first mount -- poll briefly until it is.
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          render();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [onCredential, onError]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-[11.5px] text-faint text-center">
        Google sign-in isn't configured (set VITE_GOOGLE_CLIENT_ID).
      </p>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
}

import { useState } from "react";
import authApi from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";

/**
 * Helper to decode the JWT and extract claims like role and userId
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/* ---------- UI-only helpers ---------- */
const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const HIGHLIGHTS = [
  "Track and manage all your bookings",
  "Pay securely and get your pickup code",
  "Owners can manage listings and requests",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      localStorage.clear();

      const res = await authApi.post("/api/auth/login", { email, password });

      const token = res.data.accessToken;
      localStorage.setItem("accessToken", token);

      const decoded = parseJwt(token);

      const rawRole =
        decoded?.role ||
        decoded?.roles?.[0] ||
        decoded?.authorities?.[0] ||
        decoded?.scope;

      if (!rawRole) throw new Error("User role not found in token");

      const role = rawRole.replace("ROLE_", "");
      const userId = decoded?.userId || decoded?.sub || res.data.id;
      if (!userId) throw new Error("User ID not found");

      const userObj = { id: userId, role, email };
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("role", role);

      const roleRoutes = {
        USER: "/",
        OWNER: "/owner/home",
        ADMIN: "/admin",
      };

      navigate(roleRoutes[role] || "/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      const msg =
        err.response?.data?.message || "Login failed. Check credentials.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* LEFT: BRAND PANEL (desktop only) */}
      <aside className="relative hidden w-[42%] overflow-hidden bg-slate-900 lg:flex lg:flex-col lg:justify-center">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 max-w-md px-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Welcome back to <span className="text-indigo-400">BEAOWNER</span>
          </h1>
          <p className="mt-4 text-base text-slate-400">
            Log in to manage your bookings, listings and account in one place.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((text) => (
              <li key={text} className="flex items-start gap-3 text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-[15px]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* RIGHT: FORM */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Log in to manage your bookings and fleet
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputBase}
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputBase}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                )}
                {loading ? "Verifying..." : "Login to Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
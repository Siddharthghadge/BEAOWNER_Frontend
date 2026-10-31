import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../../api/authApi";

/* ---------- UI-only helpers ---------- */
const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const Field = ({ label, htmlFor, children, className = "" }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    {children}
  </div>
);

const BENEFITS = [
  "List your items or vehicles in a few minutes",
  "Manage listings, availability and bookings in one place",
  "Reach renters looking for what you offer",
];

export default function WantToEarn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "OWNER", // ✅ Fixed OWNER
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await authApi.post("/api/auth/register", form);
      alert("Owner registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Owner Register Error:", err.response?.data);

      const errorMsg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Owner registration failed";

      alert(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* LEFT: BRAND PANEL (desktop only) */}
      <aside className="relative hidden w-[42%] overflow-hidden bg-slate-900 lg:flex lg:flex-col lg:justify-center">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 max-w-md px-12">
          <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-sm font-medium text-indigo-200">
            For owners
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white">
            Start earning from what you already own.
          </h1>
          <p className="mt-4 text-base text-slate-400">
            Create your owner account and list your items or vehicles for renters to book.
          </p>

          <ul className="mt-8 space-y-4">
            {BENEFITS.map((text) => (
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
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Become an owner
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Register as an owner and start earning by listing your items or vehicles.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    className={inputBase}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field label="Email address" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputBase}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>

              <Field label="Password" htmlFor="password">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className={inputBase}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Phone number" htmlFor="phone">
                <input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  className={inputBase}
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Address" htmlFor="address">
                <textarea
                  id="address"
                  name="address"
                  placeholder="Your address"
                  className={`${inputBase} min-h-[90px] resize-y`}
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* ✅ Role fixed for OWNER */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-500">Registering as</span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                  Owner
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98]"
              >
                Register as owner
              </button>
            </form>

            <div className="mt-7 space-y-2 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
              <p>
                Want to rent products as a customer?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  Customer register
                </Link>
              </p>
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
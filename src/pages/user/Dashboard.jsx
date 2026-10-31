// src/pages/Dashboard.jsx
import React from "react";
import useAuth from "../../auth/useAuth";

export default function Dashboard(){
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* PAGE HEADER */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-14 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-xl text-base text-slate-400">
            Your account overview and quick actions.
          </p>
        </div>
      </header>

      {/* ACCOUNT CARD */}
      <main className="relative z-20 mx-auto -mt-16 max-w-5xl px-6 pb-16 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold uppercase text-indigo-700">
                {user?.email?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Welcome back</p>
                <p className="truncate text-lg font-semibold text-slate-900" title={user?.email}>
                  {user?.email}
                </p>
                <span className="mt-1.5 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                  Role: {user?.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
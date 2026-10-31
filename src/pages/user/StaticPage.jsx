import React from "react";
import { Link } from "react-router-dom";

/* ======================================================
   EDIT THIS FIRST: your real business details.
   These are placeholders until you replace them.
====================================================== */
const SITE = {
  name: "RentAll Marketplace",
  email: "support@yourdomain.com", // TODO: replace with your real support email
  phone: "+91-00000 00000", // TODO: replace with your real phone number
  address: "Plot Number 000, Sector 00, Pune, Maharashtra 411001", // TODO: replace
};

const mail = (subject) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

/* ======================================================
   PAGE CONTENT
   type "sections": headings + paragraphs
   type "faq": questions + answers
   cta (optional): a button that opens the visitor's email app
====================================================== */
const PAGES = {
  about: {
    title: "About us",
    intro: `${SITE.name} helps people rent what they need instead of buying it, and helps owners earn from items they are not using.`,
    sections: [
      {
        heading: "What we do",
        body: "We connect renters with owners across many categories, including properties, furniture, home appliances, electronics and more. Renters can browse, compare and book. Owners can list items and manage bookings from one place.",
      },
      {
        heading: "Why rent instead of buy",
        body: "Renting lets you use a product for a day, a week or a year without the cost of owning it. It is a simple way to save money and avoid storage and maintenance.",
      },
      {
        heading: "Our approach",
        body: "We aim to keep pricing clear, bookings simple and handover secure, so both renters and owners know what to expect.",
      },
    ],
  },

  partner: {
    title: "Partner with us",
    intro: "Want to work with us? We are open to partnerships with businesses, dealers and service providers.",
    sections: [
      {
        heading: "Who can partner",
        body: "Rental businesses, dealers, equipment suppliers, property managers and local service providers who want to reach more renters.",
      },
      {
        heading: "How to get started",
        body: "Send us a short note about your business, the items or services you offer and your city. Our team will get back to you.",
      },
    ],
    cta: { label: "Email us about a partnership", href: mail("Partnership enquiry") },
  },

  rfp: {
    title: "Submit requirement / RFP",
    intro: "Looking for bulk rentals or a custom requirement? Tell us what you need and we will help find the right options.",
    sections: [
      {
        heading: "What to include",
        body: "The type of items you need, quantity, rental duration, delivery or pickup location, and your preferred start date.",
      },
      {
        heading: "What happens next",
        body: "We review your requirement and get back to you with available options.",
      },
    ],
    cta: { label: "Email your requirement", href: mail("Rental requirement / RFP") },
  },

  contact: {
    title: "Contact us",
    intro: "Questions about a booking, a listing or your account? We are happy to help.",
    contact: true,
    cta: { label: "Send us an email", href: mail("Support request") },
  },

  complaint: {
    title: "Raise a complaint",
    intro: "If something went wrong with a booking or a listing, let us know so we can look into it.",
    sections: [
      {
        heading: "What to include",
        body: "Your booking number, the email you registered with, a short description of the problem, and any photos or details that help.",
      },
      {
        heading: "What happens next",
        body: "We review each complaint and get back to you as soon as we can.",
      },
    ],
    cta: { label: "Email your complaint", href: mail("Complaint") },
  },

  /* ---- LEGAL PAGES: basic starting text. Have a lawyer review before launch. ---- */
  terms: {
    title: "Terms of use",
    intro: `By using ${SITE.name}, you agree to these terms. Please read them carefully.`,
    sections: [
      {
        heading: "Using the platform",
        body: "You must provide accurate information when you register and keep your login details secure. You are responsible for activity on your account.",
      },
      {
        heading: "Bookings and payments",
        body: "Rentals are agreed between renters and owners through the platform. Payments are processed online. A security deposit may apply to some items.",
      },
      {
        heading: "Listings",
        body: "Owners must describe their items honestly and only list items they have the right to rent out.",
      },
      {
        heading: "Responsibilities",
        body: "Renters should use items with care and return them on time and in the agreed condition. Owners should hand over items as described.",
      },
      {
        heading: "Changes",
        body: "We may update these terms from time to time. Continued use of the platform means you accept the updated terms.",
      },
    ],
  },

  privacy: {
    title: "Privacy policy",
    intro: `This page explains what information ${SITE.name} collects and how it is used.`,
    sections: [
      {
        heading: "Information we collect",
        body: "Details you give us when you register or book, such as your name, email, phone number and address, along with booking and listing information.",
      },
      {
        heading: "How we use it",
        body: "To create your account, process bookings and payments, verify handovers, provide support and improve the platform.",
      },
      {
        heading: "Sharing",
        body: "Relevant booking details are shared between the renter and the owner so the rental can happen. Payments are handled by our payment provider.",
      },
      {
        heading: "Your choices",
        body: `You can contact us at ${SITE.email} to ask about your information or request changes.`,
      },
    ],
  },

  faq: {
    title: "Frequently asked questions",
    intro: "Quick answers to common questions.",
    faq: [
      {
        q: "How do I rent an item?",
        a: "Create an account, log in, choose a category, pick an item and reserve it for the dates you need.",
      },
      {
        q: "How do I list my own item?",
        a: "Register as an owner, add your item with photos, price and location, and publish it. You can edit or remove it any time from your inventory.",
      },
      {
        q: "How do payments work?",
        a: "Payments are made online through our payment provider when you complete your booking.",
      },
      {
        q: "How does pickup work?",
        a: "After your booking is confirmed you receive a pickup code. Share it with the owner at handover so they can verify and complete the booking.",
      },
      {
        q: "Can I cancel a booking?",
        a: "You can cancel a pending booking from the My Bookings page.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Use the Forgot password link on the login page. We will email you a code to reset it.",
      },
    ],
  },
};

const StaticPage = ({ pageKey }) => {
  const page = PAGES[pageKey];

  if (!page) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <Link to="/" className="mt-4 font-semibold text-indigo-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-12 lg:px-8">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{page.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-400">{page.intro}</p>
        </div>
      </header>

      {/* BODY */}
      <main className="relative z-20 mx-auto -mt-12 max-w-4xl px-6 pb-20 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">

          {/* Text sections */}
          {page.sections && (
            <div className="space-y-8">
              {page.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="text-lg font-semibold text-slate-900">{s.heading}</h2>
                  <p className="mt-2 leading-relaxed text-slate-600">{s.body}</p>
                </section>
              ))}
            </div>
          )}

          {/* FAQ */}
          {page.faq && (
            <div className="divide-y divide-slate-100">
              {page.faq.map((item) => (
                <details key={item.q} className="group py-4 first:pt-0 last:pb-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-slate-900">
                    {item.q}
                    <svg className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" clipRule="evenodd" />
                    </svg>
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          )}

          {/* Contact details */}
          {page.contact && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Email</p>
                <a href={`mailto:${SITE.email}`} className="mt-1 block break-all font-semibold text-indigo-600 hover:underline">
                  {SITE.email}
                </a>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Phone</p>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="mt-1 block font-semibold text-slate-900 hover:text-indigo-600">
                  {SITE.phone}
                </a>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Address</p>
                <p className="mt-1 font-semibold text-slate-900">{SITE.address}</p>
              </div>
            </div>
          )}

          {/* Call to action */}
          {page.cta && (
            <div className={page.sections || page.contact ? "mt-8 border-t border-slate-100 pt-8" : ""}>
              <a
                href={page.cta.href}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                {page.cta.label}
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StaticPage;
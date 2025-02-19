"use client";

import Link from "next/link";

export default function Header({ isActive, user }) {
  return (
    <header className="sticky top-0 flex items-center bg-sky-950 px-6 py-3 h-16 z-50 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-3xl text-amber-400 font-bold">
        zoeacount
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 flex justify-center gap-6 hidden md:flex">
        <NavItem href="/timeline" label="Timeline" />
        <NavItem href="/capture" label="Capture" />
      </nav>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {isActive ? (
          <div className="text-right">
            <Link
              href="/profile"
              className="text-lg text-amber-400 font-medium hover:text-amber-500 transition"
            >
              Welcome, {user}
            </Link>
            <Link
              href="/logout"
              className="text-sm text-amber-300 hover:text-amber-500 transition block"
            >
              Log out
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-lg text-amber-400 hover:text-amber-500 transition"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}

// Reusable Nav Item Component
function NavItem({ href, label }) {
  return (
    <Link
      href={href}
      className="text-lg text-amber-400 hover:text-amber-500 transition"
    >
      {label}
    </Link>
  );
}

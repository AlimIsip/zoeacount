"use client";

import Link from "next/link";

export default function Header({ isActive, user }) {
  return (
    <div className="sticky top-0 flex align-middle bg-sky-950 p-5 h-14 z-50">
      <div className="flex-auto h-18 flex items-center justify-between">
        <Link href="/">
          <p className="text-4xl text-amber-400"> zoeacount </p>
        </Link>
      </div>

      <div className="flex-none h-18 px-5 flex items-center justify-between">
        <Link href="/timeline">
          <p className="text-4xl text-amber-400"> timeline</p>
        </Link>
      </div>
      
      <div className="flex-none h-18 px-5 flex items-center justify-between">
        <Link href="/capture">
          <p className="text-4xl text-amber-400"> capture </p>
        </Link>
      </div>

      <div className="flex-none pl-4 flex items-center">
        {isActive ? (
          <div>
            <Link href="/logout">
              <p className="text-2xl text-amber-400 text-right">Welcome, {user} </p>
            </Link>
            <Link href="/logout">
              <p className="text-1xl text-amber-400 text-right">Log out</p>
            </Link>
          </div>
        ) : (
          <Link href="/login">
            <p className="text-5xl text-amber-400 text-right">log in</p>
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { isActive } from "@/lib/sessiondetails";
import { deleteSession } from "@/lib/session";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function Header({ user }) {
  const [authenticated, setAuthenticated] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [redirectPath, setRedirectPath] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const status = await isActive();
      setAuthenticated(status);
    }
    checkAuth();
  }, []);

  const handleProtectedClick = (e, path) => {
    if (!authenticated) {
      e.preventDefault();
      setRedirectPath(path);
      onOpen();
    }
  };

  const handleLogout = async () => {
    await deleteSession();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 flex items-center bg-sky-950 px-6 py-3 h-16 z-50 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-3xl text-amber-400 font-bold">
        zoeacount
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 flex justify-center gap-6 hidden md:flex">
        <NavItem href="/timeline" label="Timeline" onClick={handleProtectedClick} authenticated={authenticated} />
        <NavItem href="/capture" label="Capture" onClick={handleProtectedClick} authenticated={authenticated} />
      </nav>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {authenticated ? (
          <div className="text-right">
            <Link
              href="/profile"
              className="text-lg text-amber-400 font-medium hover:text-amber-500 transition"
            >
              Welcome, {user}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-amber-300 hover:text-amber-500 transition block"
            >
              Log out
            </button>
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

      {/* Modal for authentication requirement */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Authentication Required</ModalHeader>
              <ModalBody>
                <p>You need to log in to access this page.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => (window.location.href = "/login")}> 
                  Log In
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
}

// Reusable Nav Item Component
function NavItem({ href, label, onClick, authenticated }) {
  return (
    <Link
      href={href}
      className="text-lg text-amber-400 hover:text-amber-500 transition"
      onClick={(e) => onClick && onClick(e, href)}
    >
      {label}
    </Link>
  );
}
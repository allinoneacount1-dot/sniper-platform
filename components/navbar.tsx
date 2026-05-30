"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Terminal } from "lucide-react";

const navLinks = [
  { href: "/", label: "[HOME]" },
  { href: "/dashboard", label: "[DASHBOARD]" },
  { href: "/docs", label: "[DOCS]" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(5,5,16,0.98)] border-b border-[rgba(82,255,120,0.2)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative w-8 h-8 border border-[rgba(82,255,120,0.5)] flex items-center justify-center"
            >
              <Terminal className="w-4 h-4 text-[rgb(82,255,120)]" />
            </motion.div>
            <span className="text-lg font-black tracking-tight text-[rgb(82,255,120)]">
              SNIPER-PLATFORM
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm text-[rgba(82,255,120,0.7)] hover:text-[rgb(82,255,120)] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[rgb(82,255,120)] group-hover:w-full transition-all duration-300" />
                </motion.button>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link href="/dashboard" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-bold border border-[rgba(82,255,120,0.5)] text-[rgb(82,255,120)] hover:bg-[rgba(82,255,120,0.1)] transition-all"
            >
              [START SCAN]
            </motion.button>
          </Link>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[rgb(82,255,120)]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-[rgba(5,5,16,0.98)] pt-24 px-6 md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl text-[rgb(82,255,120)] font-bold border-b border-[rgba(82,255,120,0.2)] py-4"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <button className="w-full mt-4 px-6 py-3 border border-[rgba(82,255,120,0.5)] text-[rgb(82,255,120)] font-bold text-lg">
                [START SCAN]
              </button>
            </Link>
          </nav>
        </motion.div>
      )}
    </>
  );
}

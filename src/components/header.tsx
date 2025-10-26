"use client";

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";

import Image from "next/image";

const Header = () => {
    const { isSignedIn } = useUser();
  return (
    <motion.header 
      className="h-16 fixed top-2 left-1/2 transform -translate-x-1/2 w-[calc(100%-1rem)] max-w-7xl bg-white/80 dark:bg-neutral-800 backdrop-blur-md z-50 border dark:border-gray-700 rounded-full flex items-center"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="w-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-8">
        <Link href={isSignedIn ? "/dashboard" : "/"} className="flex items-center">
          <Image
            src={"/logo-sm.png"}
            alt="Welth Logo"
            width={200}
            height={60}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle  />
          
          <SignedOut>
            <SignInButton fallbackRedirectUrl="/dashboard">
              <Button variant="link">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;

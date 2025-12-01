"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cat, Sparkles, Menu, X, Map, LogOut } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faUsers,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Hide admin button on landing page
  const isLandingPage = pathname === "/";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setAuthChecked(true);

      if (currentUser && currentUser.email) {
        try {
          const response = await fetch("/api/users");
          if (response.ok) {
            const usersData = await response.json();
            const currentUserData = usersData.find(
              (u: any) => u.email === currentUser.email
            );
            setIsAdmin(currentUserData?.role === "Admin");
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="py-5 fixed inset-x-0 top-0 z-50 bg-gradient-to-br from-[#3d1f0f] to-[#2a1508] backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* LOGO – CLICKABLE → HOME PAGE */}
        <Link href="/" className="pt-3">
         
             <img 
              src="/image/Logo.svg"
              alt="Meowvrick Logo"
              
              className="w-50 h-50 hover:opacity-80 transition-opacity"
            />
          
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/about"
            className="flex items-center space-x-2 hover:text-[#847570] transition-all duration-300 hover:scale-105"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
            <span className="font-medium">About</span>
          </Link>
          <a
            href="https://www.acmuta.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-[#847570] transition-all duration-300 hover:scale-105"
          >
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
            <span className="font-medium">ACM</span>
          </a>
          {!isLandingPage && authChecked && isAuthenticated && isAdmin && (
            <Link
              href="/admin"
              className="flex items-center space-x-2 hover:text-[#847570] transition-all duration-300 hover:scale-105"
            >
              <FontAwesomeIcon icon={faGauge} className="w-5 h-5" />
              <span className="font-medium">Admin Dashboard</span>
            </Link>
          )}

          {/* Maps link - only when logged in */}
          {authChecked && isAuthenticated && (
            <Link
              href="/main/map"
              className="flex items-center space-x-2 hover:text-[#847570] transition-all duration-300 hover:scale-105"
            >
              <Map className="w-5 h-5" />
              <span className="font-medium">Maps</span>
            </Link>
          )}

          {/* Logout button - only when logged in */}
          {authChecked && isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-[#847570] hover:bg-[#6B5D59] text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 hover:shadow-[#847570]/50"
            >
              <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4 bg-[#2a1508]/95 backdrop-blur-sm border-t border-white/10">
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 text-white hover:text-[#847570] transition-all duration-200 hover:pl-2"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
            <span className="font-medium">About</span>
          </Link>
          <a
            href="https://www.acmuta.com/about"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 text-white hover:text-[#847570] transition-all duration-200 hover:pl-2"
          >
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
            <span className="font-medium">ACM</span>
          </a>
          {!isLandingPage && authChecked && isAuthenticated && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 text-white hover:text-[#847570] transition-all duration-200 hover:pl-2"
            >
              <FontAwesomeIcon icon={faGauge} className="w-5 h-5" />
              <span className="font-medium">Admin Dashboard</span>
            </Link>
          )}

          {/* Maps link - mobile */}
          {authChecked && isAuthenticated && (
            <Link
              href="/main/map"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 text-white hover:text-[#847570] transition-all duration-200 hover:pl-2"
            >
              <Map className="w-5 h-5" />
              <span className="font-medium">Maps</span>
            </Link>
          )}

          {/* Logout button - mobile, only when logged in */}
          {authChecked && isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-start space-x-2 px-4 py-2 rounded-lg bg-[#847570] hover:bg-[#6B5D59] transition-all duration-300 text-white font-medium hover:shadow-lg hover:shadow-[#847570]/50"
            >
              <LogOut className="w-4 h-4 transition-transform duration-300 hover:translate-x-1" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

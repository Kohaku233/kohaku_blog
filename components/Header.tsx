import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/blog", text: "Blog" },
  { href: "/dashboard", text: "Dashboard" },
  { href: "/projects", text: "Projects" },
  { href: "/about", text: "About" },
];

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="py-6 animate-slide-down">
      <nav className="flex items-center justify-between relative">
        <Link href="/">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            K
          </span>
        </Link>
        <div className="hidden sm:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {link.text}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            )}
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleMenu}
              className="sm:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              ) : (
                <Menu className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              )}
            </button>
            {isMenuOpen && (
              <div className="sm:hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

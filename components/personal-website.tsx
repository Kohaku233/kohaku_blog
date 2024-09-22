'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Sun, Moon, Menu, X, PenTool } from 'lucide-react'

export function PersonalWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const dropdownRef = useRef(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-[64rem] mx-auto px-4">
          <header className="py-6">
            <nav className="flex items-center justify-between relative">
              <Link href="/">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">K</span>
              </Link>
              <div className="hidden sm:flex items-center space-x-4">
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Blog
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Dashboard
                </Link>
                <Link href="/projects" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Projects
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  About
                </Link>
              </div>
              <div className="flex items-center">
                <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 mr-2">
                  {isDarkMode ? <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" /> : <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />}
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleMenu} className="sm:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    {isMenuOpen ? <X className="h-5 w-5 text-gray-800 dark:text-gray-200" /> : <Menu className="h-5 w-5 text-gray-800 dark:text-gray-200" />}
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                      <Link href="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        Blog
                      </Link>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        Dashboard
                      </Link>
                      <Link href="/projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        Projects
                      </Link>
                      <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        About
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </header>
          <main className="py-12">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="sm:w-2/3">
                <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                  I am Kohaku
                </h1>
                <p className="text-xl sm:text-2xl mb-4 text-gray-800 dark:text-gray-200">
                  an amateur programming enthusiast and a practitioner of long-termism.
                </p>
              </div>
              <div className="sm:w-1/3 mt-8 sm:mt-0 hidden sm:block">
                <div className="w-48 h-48 bg-black rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white text-6xl font-bold" style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>K</span>
                </div>
              </div>
            </div>
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Latest Articles</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <img src="/placeholder.svg?height=200&width=400" alt="Web Design Websites" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <PenTool className="h-4 w-4 mr-1" />
                      <span>Blog</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Top 8 Attractive Web Design Websites</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Explore 8 outstanding web design websites that captivate and inspire. Elevate your design game with these top-notch platforms.</p>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>August 22, 2023</span>
                      <span>831 likes • 3976 views</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <img src="/placeholder.svg?height=200&width=400" alt="Next.js and MDX" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <PenTool className="h-4 w-4 mr-1" />
                      <span>Blog</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">How to build a blog with Next.js and MDX</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Using Next.js to build a blog is very easy! Learn how to create a powerful and flexible blog using Next.js and MDX.</p>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>August 22, 2022</span>
                      <span>788 likes • 4657 views</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Selected Projects</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Project</h3>
                    <p className="text-gray-600 dark:text-gray-400">Project description goes here.</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Project</h3>
                    <p className="text-gray-600 dark:text-gray-400">Project description goes here.</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background with bubble effect */}
      <div className="bubble-bg" />

      {/* Navigation */}
      <nav className="glass-effect fixed top-0 w-full z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="PongBros Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-[var(--font-size-headline)] font-[var(--font-weight-bold)] foam-text">
              PongBros
            </span>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="secondary-button">
              Bar Login
            </Link>
            <Link href="/register" className="primary-button">
              Register Your Bar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-[var(--font-size-large-title)] md:text-6xl font-[var(--font-weight-bold)] foam-text mb-6">
              Welcome to PongBros<br />Bar Management Portal
            </h1>
            <p className="text-[var(--font-size-title)] opacity-80 mb-8">
              Manage your beer pong tables, bookings, and customers all in one place.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register" className="primary-button">
                Register Your Bar
              </Link>
              <Link href="/login" className="secondary-button">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text mb-12 text-center">
            Why Choose PongBros?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:scale-[1.02]">
              <div className="h-2 bg-gradient-to-r from-[var(--beer-amber)] to-[var(--beer-golden)] rounded-t-[20px] -mt-4 -mx-4 mb-6" />
              <h3 className="text-[var(--font-size-title3)] font-[var(--font-weight-semibold)] mb-4">
                Easy Booking Management
              </h3>
              <p className="text-[var(--font-size-body)] opacity-80">
                Handle reservations, check-ins, and manage your tables all in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:scale-[1.02]">
              <div className="h-2 bg-gradient-to-r from-[var(--beer-red-cup)] to-[var(--beer-amber)] rounded-t-[20px] -mt-4 -mx-4 mb-6" />
              <h3 className="text-[var(--font-size-title3)] font-[var(--font-weight-semibold)] mb-4">
                Real-time Updates
              </h3>
              <p className="text-[var(--font-size-body)] opacity-80">
                Get instant notifications for new bookings and stay on top of your business.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:scale-[1.02]">
              <div className="h-2 bg-gradient-to-r from-[var(--beer-golden)] to-[var(--beer-foam)] rounded-t-[20px] -mt-4 -mx-4 mb-6" />
              <h3 className="text-[var(--font-size-title3)] font-[var(--font-weight-semibold)] mb-4">
                Analytics & Insights
              </h3>
              <p className="text-[var(--font-size-body)] opacity-80">
                Track usage, popular times, and optimize your beer pong operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bubbles Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="loading-container absolute top-1/4 left-1/4">
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
        </div>
        <div className="loading-container absolute top-2/3 right-1/3">
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
        </div>
      </div>
    </div>
  );
}

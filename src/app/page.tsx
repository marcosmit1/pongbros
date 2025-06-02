'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Background with bubble effect */}
      <div className="bubble-bg" />

      {/* Logo and Hero Section */}
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/pong-bros-logo.png"
                alt="Pong Bros Logo"
                width={180}
                height={180}
                className="mx-auto logo-glow hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h1 className="mt-6 text-[var(--font-size-display)] font-[var(--font-weight-bold)] foam-text">
              Pong Bros
            </h1>
            <p className="mt-3 text-[var(--font-size-title)] font-[var(--font-weight-medium)] text-beer-foam">
              Manage Your Beer Pong Empire
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/login"
              className="primary-button text-center w-[200px] flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="secondary-button text-center w-[200px] flex items-center justify-center"
            >
              Register Your Bar
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="mt-16 text-center">
            <h2 className="text-[var(--font-size-title2)] font-[var(--font-weight-semibold)] foam-text">
              Welcome to Pong Bros<br />Bar Management Portal
            </h2>
            <p className="mt-4 text-[var(--font-size-headline)] text-beer-foam max-w-2xl mx-auto">
              Take control of your beer pong tables, manage bookings, and grow your business.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 mb-8">
          <h3 className="text-[var(--font-size-title3)] font-[var(--font-weight-semibold)] foam-text text-center mb-8">
            Why Choose Pong Bros?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div className="card">
              <h4 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] mb-2">
                Easy Booking Management
              </h4>
              <p className="text-[var(--font-size-body)] opacity-80">
                Streamline your table bookings and keep track of all reservations in one place.
              </p>
            </div>
            <div className="card">
              <h4 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] mb-2">
                Real-time Updates
              </h4>
              <p className="text-[var(--font-size-body)] opacity-80">
                Get instant notifications and manage your tables in real-time.
              </p>
            </div>
            <div className="card">
              <h4 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] mb-2">
                Analytics & Insights
              </h4>
              <p className="text-[var(--font-size-body)] opacity-80">
                Track your venue&apos;s performance and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

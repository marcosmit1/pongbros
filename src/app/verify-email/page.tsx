'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.emailVerified) {
      router.push('/bars/add');
      return;
    }

    // Check email verification status every 5 seconds
    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          router.push('/bars/add');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, router]);

  useEffect(() => {
    if (countdown > 0 && loading) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setLoading(false);
      setCountdown(60);
    }
  }, [countdown, loading]);

  const handleResendVerification = async () => {
    if (!user || loading) return;

    try {
      setLoading(true);
      setError('');
      await sendEmailVerification(user);
      setSuccess('Verification email sent! Please check your inbox.');
      setCountdown(60);
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to send verification email. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background with bubble effect */}
      <div className="bubble-bg" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/pong-bros-logo.png"
              alt="Pong Bros Logo"
              width={120}
              height={120}
              className="mx-auto logo-glow hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
          <h2 className="mt-6 text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text">
            Verify Your Email
          </h2>
          <p className="mt-2 text-[var(--font-size-subheadline)] text-beer-foam opacity-80">
            Check your inbox for a verification link
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="card mx-4 sm:mx-0">
          <div className="space-y-6">
            {error && (
              <div className="status-badge error">
                {error}
              </div>
            )}
            {success && (
              <div className="status-badge success">
                {success}
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-[var(--font-size-body)]">
                We&apos;ve sent a verification email to:
                <br />
                <span className="font-semibold">{user?.email}</span>
              </p>
              <p className="text-[var(--font-size-body)] opacity-80">
                Click the link in the email to verify your account.
                <br />
                Don&apos;t see it? Check your spam folder.
              </p>
            </div>

            <div>
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="primary-button w-full flex justify-center items-center min-h-[48px]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-container scale-75">
                      <div className="loading-bubble"></div>
                      <div className="loading-bubble"></div>
                      <div className="loading-bubble"></div>
                    </div>
                    <span>Wait {countdown}s</span>
                  </div>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/login" className="text-link">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
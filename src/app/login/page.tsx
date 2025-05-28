'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      
      // After successful sign in, check if user has any bars
      const venuesRef = collection(db, 'venues');
      const q = query(venuesRef, where('ownerId', '==', auth.currentUser!.uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        router.push('/bars/add');
      } else if (querySnapshot.size === 1) {
        router.push(`/dashboard/${querySnapshot.docs[0].id}`);
      } else {
        router.push('/bars');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in. Please check your credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative">
      {/* Background with bubble effect */}
      <div className="bubble-bg">
        <div className="loading-container">
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Pong Bros Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h2 className="mt-6 text-[var(--font-size-large-title)] font-[var(--font-weight-bold)] foam-text">
            Welcome Back
          </h2>
          <p className="mt-2 text-[var(--font-size-subheadline)] opacity-80">
            Sign in to manage your venues
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="card mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="status-badge live w-full justify-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[var(--font-size-subheadline)] font-[var(--font-weight-medium)] mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[var(--font-size-subheadline)] font-[var(--font-weight-medium)] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="primary-button w-full flex justify-center"
              >
                {loading ? (
                  <div className="loading-container scale-75">
                    <div className="loading-bubble"></div>
                    <div className="loading-bubble"></div>
                    <div className="loading-bubble"></div>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/register" 
              className="text-[var(--font-size-subheadline)] hover:opacity-80 transition-opacity"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
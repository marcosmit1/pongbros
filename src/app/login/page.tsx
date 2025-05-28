'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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
      
      // First try to get venue by user ID directly
      const venueDoc = await getDoc(doc(db, 'venues', auth.currentUser!.uid));
      
      if (venueDoc.exists()) {
        console.log('Found venue by user ID:', venueDoc.id);
        router.push(`/dashboard/${venueDoc.id}`);
        return;
      }
      
      console.log('No venue found by user ID, checking ownerId field...');
      
      // If not found, try the old query method
      const venuesRef = collection(db, 'venues');
      const q = query(venuesRef, where('ownerId', '==', auth.currentUser!.uid));
      const querySnapshot = await getDocs(q);
      
      console.log('Query results:', {
        empty: querySnapshot.empty,
        size: querySnapshot.size,
        docs: querySnapshot.docs.map(d => ({ id: d.id, data: d.data() }))
      });
      
      if (querySnapshot.empty) {
        console.log('No venues found at all, redirecting to add bar page');
        router.push('/bars/add');
      } else if (querySnapshot.size === 1) {
        const venueId = querySnapshot.docs[0].id;
        console.log('Found one venue by ownerId, redirecting to dashboard:', venueId);
        router.push(`/dashboard/${venueId}`);
      } else {
        console.log('Multiple venues found, redirecting to bars page');
        router.push('/bars');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in. Please check your credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background with bubble effect */}
      <div className="bubble-bg">
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/pong-bros-logo.png"
              alt="Pong Bros Logo"
              width={120}
              height={120}
              className="mx-auto logo-glow hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="mt-6 text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text">
            Welcome Back
          </h2>
          <p className="mt-2 text-[var(--font-size-subheadline)] text-beer-foam opacity-80">
            Sign in to your bar account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="card mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="status-badge error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
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
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
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
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="primary-button w-full flex justify-center items-center min-h-[48px]"
              >
                {loading ? (
                  <div className="loading-container scale-75">
                    <div className="loading-bubble"></div>
                    <div className="loading-bubble"></div>
                    <div className="loading-bubble"></div>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/register" className="text-link">
                Don&apos;t have an account? Register your bar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
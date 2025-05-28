'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

interface Bar {
  id: string;
  name: string;
  address: string;
  imageURL: string;
  status: 'active' | 'inactive';
  lastBooking?: string;
}

export default function BarsPage() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBars = async () => {
      try {
        const venuesRef = collection(db, 'venues');
        const q = query(venuesRef, where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedBars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Bar[];

        // Update any bars without a status to be active
        for (const bar of fetchedBars) {
          if (!bar.status) {
            await updateDoc(doc(db, 'venues', bar.id), {
              status: 'active',
              updatedAt: new Date()
            });
            bar.status = 'active';
          }
        }

        setBars(fetchedBars);
      } catch (error) {
        console.error('Error fetching bars:', error);
        setError('Failed to load your bars. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-container">
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with bubble effect */}
      <div className="bubble-bg" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text">
              Your Bars
            </h1>
            <p className="text-[var(--font-size-subheadline)] opacity-80 mt-2">
              Manage your venues and view their dashboards
            </p>
          </div>
          <Link
            href="/bars/add"
            className="primary-button"
          >
            Add New Bar
          </Link>
        </div>

        {error && (
          <div className="status-badge live w-full justify-center mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bars.map((bar) => (
            <div
              key={bar.id}
              className="card flex flex-col"
            >
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                {bar.imageURL ? (
                  <Image
                    src={bar.imageURL}
                    alt={bar.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--beer-amber)] to-[var(--beer-dark-brown)] opacity-50" />
                )}
              </div>
              
              <div className="flex flex-col flex-grow space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] truncate">
                    {bar.name}
                  </h3>
                  <span className={`status-badge ${bar.status === 'active' ? 'live' : 'error'} whitespace-nowrap`}>
                    {bar.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-[var(--font-size-subheadline)] opacity-80 line-clamp-2">
                  {bar.address}
                </p>
                
                {bar.lastBooking && (
                  <p className="text-[var(--font-size-caption)] opacity-60">
                    Last booking: {bar.lastBooking}
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <Link
                    href={`/dashboard/${bar.id}`}
                    className="secondary-button w-full text-center block"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bars.length === 0 && (
          <div className="card text-center py-12">
            <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
              No bars yet
            </h3>
            <p className="text-[var(--font-size-subheadline)] opacity-80 mt-2 mb-6">
              Get started by adding your first bar.
            </p>
            <Link
              href="/bars/add"
              className="primary-button inline-flex"
            >
              Add New Bar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 
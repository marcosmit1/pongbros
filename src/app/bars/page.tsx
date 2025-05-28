'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

interface Bar {
  id: string;
  name: string;
  address: string;
  imageURL: string;
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Bars</h1>
            <Link
              href="/bars/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Add New Bar
            </Link>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bars.map((bar) => (
              <div
                key={bar.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                {bar.imageURL && (
                  <div className="h-48 w-full relative">
                    <Image
                      src={bar.imageURL}
                      alt={bar.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{bar.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{bar.address}</p>
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/${bar.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Dashboard →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {bars.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bars yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first bar.
              </p>
              <div className="mt-6">
                <Link
                  href="/bars/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add New Bar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
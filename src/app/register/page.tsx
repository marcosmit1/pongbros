'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    pricePerHour: '',
    numberOfTables: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in the user
      await signIn(formData.email, formData.password);

      // Create bar document
      const barData = {
        name: formData.name,
        address: formData.address,
        pricePerHour: Number(formData.pricePerHour),
        tables: Array.from({ length: Number(formData.numberOfTables) }, (_, i) => ({
          tableNumber: i + 1,
          capacity: 6
        })),
        openingHours: {
          Monday: { opens: '10:00', closes: '22:00' },
          Tuesday: { opens: '10:00', closes: '22:00' },
          Wednesday: { opens: '10:00', closes: '22:00' },
          Thursday: { opens: '10:00', closes: '22:00' },
          Friday: { opens: '10:00', closes: '00:00' },
          Saturday: { opens: '10:00', closes: '00:00' },
          Sunday: { opens: '10:00', closes: '22:00' },
        },
        createdAt: new Date(),
      };

      if (!auth.currentUser) {
        throw new Error('No user found after sign in');
      }

      await setDoc(doc(db, 'bars', auth.currentUser.uid), barData);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register your bar
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Bar Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">
                Price per Hour (R)
              </label>
              <input
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="numberOfTables" className="block text-sm font-medium text-gray-700">
                Number of Beer Pong Tables
              </label>
              <input
                id="numberOfTables"
                name="numberOfTables"
                type="number"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.numberOfTables}
                onChange={(e) => setFormData({ ...formData, numberOfTables: e.target.value })}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
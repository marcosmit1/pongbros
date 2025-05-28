'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GeoPoint } from 'firebase/firestore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    capacity: '',
    pricePerHour: '',
    imageFile: null as File | null,
    email: '',
    password: '',
    // Default location (can be updated later)
    latitude: '-33.908084',
    longitude: '18.409139'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in the user
      await signIn(formData.email, formData.password);

      if (!auth.currentUser) {
        throw new Error('No user found after sign in');
      }

      let imageURL = '';
      if (formData.imageFile) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `bar_images/${formData.imageFile.name}`);
        await uploadBytes(imageRef, formData.imageFile);
        imageURL = await getDownloadURL(imageRef);
      }

      // Create venue document
      const venueData = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        capacity: Number(formData.capacity),
        pricePerHour: Number(formData.pricePerHour),
        imageURL: imageURL,
        location: new GeoPoint(
          Number(formData.latitude),
          Number(formData.longitude)
        ),
        openingHours: {
          Monday: { opens: '09:00', closes: '22:00' },
          Tuesday: { opens: '09:00', closes: '22:00' },
          Wednesday: { opens: '09:00', closes: '22:00' },
          Thursday: { opens: '09:00', closes: '22:00' },
          Friday: { opens: '09:00', closes: '23:00' },
          Saturday: { opens: '10:00', closes: '23:00' },
          Sunday: { opens: '10:00', closes: '22:00' },
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'venues', auth.currentUser.uid), venueData);
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
          Register your venue
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
                Venue Name
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Beer Pong Table Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Venue Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                className="mt-1 block w-full py-2 px-3"
                onChange={handleImageChange}
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
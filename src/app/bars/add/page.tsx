'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GeoPoint } from 'firebase/firestore';

export default function AddBarPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    capacity: '',
    pricePerHour: '',
    imageFile: null as File | null,
    // Default location (can be updated later)
    latitude: '-33.908084',
    longitude: '18.409139'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate a new ID for the venue
      const venueId = doc(collection(db, 'venues')).id;
      
      let imageURL = '';
      if (formData.imageFile) {
        try {
          // Upload image to Firebase Storage
          const imageRef = ref(storage, `bar_images/${Date.now()}_${formData.imageFile.name}`);
          await uploadBytes(imageRef, formData.imageFile);
          imageURL = await getDownloadURL(imageRef);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload venue image. Please try again.');
        }
      }

      // Create venue document
      const venueData = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        capacity: Number(formData.capacity),
        pricePerHour: Number(formData.pricePerHour),
        imageURL: imageURL,
        ownerId: user.uid,
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

      await setDoc(doc(db, 'venues', venueId), venueData);
      router.push('/bars');
    } catch (error) {
      console.error('Error adding bar:', error);
      setError('Failed to add bar. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Bar</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
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
                  Price per 30 min (R)
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
                  Bar Image
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  {loading ? 'Adding Bar...' : 'Add Bar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
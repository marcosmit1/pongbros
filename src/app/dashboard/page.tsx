'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { GeoPoint } from 'firebase/firestore';
import Image from 'next/image';

interface Booking {
  id: string;
  userId: string;
  tableNumber: number;
  date: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface VenueData {
  name: string;
  address: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  imageURL: string;
  location: GeoPoint;
  openingHours: {
    [key: string]: { opens: string; closes: string };
  };
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch venue data
        const venueDoc = await getDoc(doc(db, 'venues', user.uid));
        if (!venueDoc.exists()) {
          setError('Venue not found. Please contact support.');
          return;
        }
        
        setVenueData(venueDoc.data() as VenueData);

        // Fetch today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('venueId', '==', user.uid),
          where('date', '>=', today),
          where('date', '<', tomorrow)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedBookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as Booking[];

        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load venue data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!venueData || !user) return;

    try {
      const updatedData = { ...venueData };

      if (imageFile) {
        // Upload new image
        const imageRef = ref(storage, `bar_images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageURL = await getDownloadURL(imageRef);
        updatedData.imageURL = imageURL;
      }

      // Update venue document
      await updateDoc(doc(db, 'venues', user.uid), {
        ...updatedData,
        updatedAt: new Date()
      });

      setSuccess('Venue details updated successfully!');
      setEditMode(false);
      setImageFile(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating venue:', error);
      setError('Failed to update venue details');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PongBros Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Venue Management Section */}
        <div className="mb-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Venue Details</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {venueData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={venueData.name}
                          onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{venueData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={venueData.address}
                          onChange={(e) => setVenueData({ ...venueData, address: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{venueData.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      {editMode ? (
                        <textarea
                          value={venueData.description}
                          onChange={(e) => setVenueData({ ...venueData, description: e.target.value })}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{venueData.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price per Hour</label>
                      {editMode ? (
                        <input
                          type="number"
                          value={venueData.pricePerHour}
                          onChange={(e) => setVenueData({ ...venueData, pricePerHour: Number(e.target.value) })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">R{venueData.pricePerHour}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capacity</label>
                      {editMode ? (
                        <input
                          type="number"
                          value={venueData.capacity}
                          onChange={(e) => setVenueData({ ...venueData, capacity: Number(e.target.value) })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{venueData.capacity} tables</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Venue Image</label>
                      {editMode ? (
                        <div className="mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                      ) : (
                        venueData.imageURL && (
                          <div className="mt-1 relative h-48 w-full">
                            <Image
                              src={venueData.imageURL}
                              alt={venueData.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Bookings</h2>
            
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings for today</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white overflow-hidden shadow rounded-lg border"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            Table {booking.tableNumber}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {booking.date.toLocaleTimeString()} ({booking.duration} hours)
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Status: {booking.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="flex space-x-3">
                        <button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => {/* TODO: Implement confirm booking */}}
                        >
                          Confirm
                        </button>
                        <button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => {/* TODO: Implement cancel booking */}}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
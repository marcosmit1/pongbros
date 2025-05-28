'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useParams } from 'next/navigation';
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
  const params = useParams();

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const venueId = params?.venueId as string || user.uid;
        console.log('Attempting to fetch venue data for:', venueId);

        // Fetch venue data
        const venueDoc = await getDoc(doc(db, 'venues', venueId));
        
        if (!venueDoc.exists()) {
          console.error('Venue not found:', venueId);
          setError('Venue not found. Please contact support.');
          return;
        }
        
        console.log('Found venue data:', venueDoc.data());
        setVenueData(venueDoc.data() as VenueData);

        // Fetch today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('venueId', '==', venueId),
          where('date', '>=', today),
          where('date', '<', tomorrow)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedBookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as Booking[];

        console.log('Fetched bookings:', fetchedBookings);
        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load venue data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router, params]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!venueData || !user) return;

    try {
      const venueId = params?.venueId as string || user.uid;
      const updatedData = { ...venueData };

      if (imageFile) {
        // Upload new image
        const imageRef = ref(storage, `bar_images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageURL = await getDownloadURL(imageRef);
        updatedData.imageURL = imageURL;
      }

      // Update venue document
      await updateDoc(doc(db, 'venues', venueId), {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-container">
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
          <div className="loading-bubble"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="status-badge error mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/bars')}
          className="secondary-button"
        >
          Go to Bars List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text">
                {venueData?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/bars')}
                className="secondary-button"
              >
                All Bars
              </button>
              <button
                onClick={handleSignOut}
                className="secondary-button"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {success && (
          <div className="status-badge live mb-4">
            {success}
          </div>
        )}

        {/* Venue Management Section */}
        <div className="mb-8">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[var(--font-size-title3)] font-[var(--font-weight-semibold)]">
                Venue Details
              </h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="secondary-button"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {venueData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={venueData.name}
                        onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                        className="text-input"
                      />
                    ) : (
                      <p className="text-[var(--font-size-body)] opacity-90">{venueData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Address</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={venueData.address}
                        onChange={(e) => setVenueData({ ...venueData, address: e.target.value })}
                        className="text-input"
                      />
                    ) : (
                      <p className="text-[var(--font-size-body)] opacity-90">{venueData.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Description</label>
                    {editMode ? (
                      <textarea
                        value={venueData.description}
                        onChange={(e) => setVenueData({ ...venueData, description: e.target.value })}
                        rows={3}
                        className="text-input"
                      />
                    ) : (
                      <p className="text-[var(--font-size-body)] opacity-90">{venueData.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Price per Hour</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={venueData.pricePerHour}
                        onChange={(e) => setVenueData({ ...venueData, pricePerHour: Number(e.target.value) })}
                        className="text-input"
                      />
                    ) : (
                      <p className="text-[var(--font-size-body)] opacity-90">R{venueData.pricePerHour}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Capacity</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={venueData.capacity}
                        onChange={(e) => setVenueData({ ...venueData, capacity: Number(e.target.value) })}
                        className="text-input"
                      />
                    ) : (
                      <p className="text-[var(--font-size-body)] opacity-90">{venueData.capacity} tables</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Venue Image</label>
                    {editMode ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                 file:text-sm file:font-semibold file:bg-primary file:text-beer-dark-brown
                                 hover:file:bg-opacity-80"
                      />
                    ) : (
                      venueData.imageURL && (
                        <div className="relative h-48 w-full">
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
                      className="primary-button"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="card">
          <h2 className="text-[var(--font-size-title3)] font-[var(--font-weight-semibold)] mb-4">
            Today&apos;s Bookings
          </h2>
          
          {bookings.length === 0 ? (
            <p className="text-[var(--font-size-body)] opacity-80">No bookings for today</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="card"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                        Table {booking.tableNumber}
                      </h3>
                      <span className={`status-badge ${booking.status === 'confirmed' ? 'live' : 'error'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-[var(--font-size-body)] opacity-80">
                      {booking.date.toLocaleTimeString()} ({booking.duration} hours)
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      className="primary-button flex-1"
                      onClick={() => {/* TODO: Implement confirm booking */}}
                    >
                      Confirm
                    </button>
                    <button
                      className="secondary-button flex-1"
                      onClick={() => {/* TODO: Implement cancel booking */}}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
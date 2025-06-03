'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { GeoPoint } from 'firebase/firestore';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface Booking {
  id: string;           // Auto-generated Firestore document ID
  barId: string;        // Reference to the venue/bar in the 'venues' collection
  userId: string;       // Firebase Auth user ID of the person making the booking
  startTime: any;       // Firebase Timestamp of when the booking starts
  endTime: any;         // Firebase Timestamp of when the booking ends (30 mins after start)
  tableNumber: number;  // The table number that was booked
  status: string;       // Can be "pending", "confirmed", or "cancelled"
  createdAt: any;      // Firebase Timestamp of when the booking was created
}

interface VenueData {
  id: string;
  name: string;
  address: string;
  description: string;
  numberOfTables: number;
  pricePerHour: number;
  imageURL: string;
  location: GeoPoint;
  ownerId: string;
  status: 'active' | 'inactive';
  openingHours: {
    [key: string]: { opens: string; closes: string };
  };
}

function LoadingFallback() {
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

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function VenueDashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [isEditing, setIsEditing] = useState(false);
  const [editedVenue, setEditedVenue] = useState<Partial<VenueData>>({});
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const venueId = params?.venueId as string;

  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'cancel') => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: action === 'confirm' ? 'confirmed' : 'cancelled',
        updatedAt: new Date()
      });

      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: action === 'confirm' ? 'confirmed' : 'cancelled' }
            : booking
        )
      );

      setSuccess(`Booking ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      setError(`Failed to ${action} booking. Please try again.`);
    }
  };

  const fetchBookings = useCallback(async (date: string) => {
    try {
      const selectedDateObj = new Date(date);
      selectedDateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('barId', '==', venueId),
        where('startTime', '>=', selectedDateObj),
        where('startTime', '<', nextDay)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Booking[];

      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try refreshing the page.');
    }
  }, [venueId]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueData || !editedVenue) return;

    try {
      setLoading(true);
      setError('');
      
      await updateDoc(doc(db, 'venues', venueId), {
        ...editedVenue,
        updatedAt: new Date()
      });

      setVenueData({ ...venueData, ...editedVenue });
      setSuccess('Venue information updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating venue:', error);
      setError('Failed to update venue information');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedVenue({});
    setError('');
  };

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

        // Fetch venue data
        const venueDoc = await getDoc(doc(db, 'venues', venueId));
        
        if (!venueDoc.exists()) {
          console.error('Venue not found:', venueId);
          setError('Venue not found. Please check the URL or contact support.');
          return;
        }

        // Verify ownership
        const venueData = {
          id: venueDoc.id,
          ...venueDoc.data()
        } as VenueData;

        if (venueData.ownerId !== user.uid) {
          setError('You do not have permission to view this venue.');
          return;
        }
        
        setVenueData(venueData);
        await fetchBookings(selectedDate);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load venue data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchData();
    }
  }, [user, router, venueId, selectedDate, fetchBookings]);

  if (loading) {
    return <LoadingFallback />;
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
          Back to Bars
        </button>
      </div>
    );
  }

  if (!venueData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text">
                {venueData.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/bars')}
                className="secondary-button"
              >
                All Bars
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="status-badge live mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="status-badge error mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Stats */}
          <div className="card">
            <h2 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] mb-4">
              Bookings Stats
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[var(--font-size-subheadline)] opacity-80">Total Bookings</p>
                <p className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] text-primary">
                  {bookings.length}
                </p>
              </div>
              <div>
                <p className="text-[var(--font-size-subheadline)] opacity-80">Active Tables</p>
                <p className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] text-primary">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                Bookings
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-input py-1 px-2"
              />
            </div>
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(booking => (
                  <div key={booking.id} className="p-4 glass-effect rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[var(--font-size-body)] font-[var(--font-weight-medium)]">
                          Table {booking.tableNumber}
                        </p>
                        <p className="text-[var(--font-size-caption)] opacity-60">
                          Time: {booking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {booking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`status-badge ${
                          booking.status === 'confirmed' ? 'success' : 
                          booking.status === 'pending' ? 'warning' : 
                          'error'
                        }`}>
                          {booking.status}
                        </span>
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'confirm')}
                              className="primary-button text-xs py-1 px-2"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, 'cancel')}
                              className="secondary-button text-xs py-1 px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 glass-effect rounded-lg">
                  <p className="text-[var(--font-size-body)] opacity-60">No bookings for this date</p>
                </div>
              )}
            </div>
          </div>

          {/* Venue Info */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                Venue Information
              </h2>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedVenue(venueData || {});
                    }}
                    className="secondary-button py-2 px-4 text-sm"
                  >
                    Edit Venue
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditCancel}
                      className="secondary-button py-2 px-4 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSubmit}
                      className="primary-button py-2 px-4 text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="text-input"
                    value={editedVenue.name || ''}
                    onChange={(e) => setEditedVenue({ ...editedVenue, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  {isEditing ? (
                    <AddressAutocomplete
                      onSelect={(address, latitude, longitude) => {
                        setEditedVenue({
                          ...editedVenue,
                          address,
                          location: new GeoPoint(latitude, longitude)
                        });
                      }}
                      defaultValue={editedVenue.address || ''}
                      className="text-input"
                    />
                  ) : (
                    <p className="text-[var(--font-size-body)] opacity-90">{editedVenue.address}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Number of Tables</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedVenue.numberOfTables || ''}
                      onChange={(e) => setEditedVenue({ ...editedVenue, numberOfTables: Number(e.target.value) })}
                      className="text-input"
                    />
                  ) : (
                    <p className="text-[var(--font-size-body)] opacity-90">{venueData?.numberOfTables} tables</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Price per 30 min (R)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={editedVenue.pricePerHour || ''}
                    onChange={(e) => setEditedVenue({ ...editedVenue, pricePerHour: Number(e.target.value) })}
                    required
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-[var(--font-size-subheadline)] opacity-80">Name</p>
                  <p className="text-[var(--font-size-body)]">{venueData?.name}</p>
                </div>
                <div>
                  <p className="text-[var(--font-size-subheadline)] opacity-80">Address</p>
                  <p className="text-[var(--font-size-body)]">{venueData?.address}</p>
                </div>
                <div>
                  <p className="text-[var(--font-size-subheadline)] opacity-80">Number of Tables</p>
                  <p className="text-[var(--font-size-body)]">{venueData?.numberOfTables} tables</p>
                </div>
                <div>
                  <p className="text-[var(--font-size-subheadline)] opacity-80">Price per 30 min</p>
                  <p className="text-[var(--font-size-body)]">R{venueData?.pricePerHour}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VenueDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VenueDashboardContent />
    </Suspense>
  );
} 
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, doc, getDoc, updateDoc, onSnapshot, Timestamp, getDocs } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { GeoPoint } from 'firebase/firestore';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { debounce } from 'lodash';

interface Player {
  username: string;
  userId: string;
  checkedInAt: Timestamp;
  validated: boolean;
  teamName?: string;
}

interface ValidatedPlayer {
  username: string;
  userId: string;
  validated: boolean;
  teamName?: string;
}

interface BookingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface Booking {
  id: string;
  barId: string;
  userId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  tableNumber: number;
  status: string;
  createdAt: Timestamp;
  userDetails?: BookingUser;
  notes?: string;
  totalPrice: number;
  checkedIn?: boolean;
  checkedInAt?: Timestamp;
  players?: Player[];
  gameMode?: '1v1' | '2v2';
  team1Name?: string;
  team2Name?: string;
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

interface BookingDisplay extends Omit<Booking, 'startTime' | 'endTime' | 'createdAt' | 'checkedInAt'> {
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  checkedInAt?: Date;
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
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<BookingDisplay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'1v1' | '2v2'>('2v2');
  const [players, setPlayers] = useState<ValidatedPlayer[]>([
    { username: '', userId: '', validated: false, teamName: '' },
    { username: '', userId: '', validated: false, teamName: '' },
    { username: '', userId: '', validated: false, teamName: '' },
    { username: '', userId: '', validated: false, teamName: '' }
  ]);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [isSearching, setIsSearching] = useState<boolean[]>([false, false, false, false]);
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

  const searchUser = async (username: string, playerIndex: number) => {
    if (!username.trim()) {
      setPlayers(prev => {
        const updated = [...prev];
        updated[playerIndex] = { username: '', userId: '', validated: false };
        return updated;
      });
      return;
    }

    setIsSearching(prev => {
      const updated = [...prev];
      updated[playerIndex] = true;
      return updated;
    });

    try {
      console.log('Searching for username:', username.trim().toLowerCase());
      const usersRef = collection(db, 'users');
      const searchTerm = username.trim().toLowerCase();
      
      // Log the query we're about to make
      console.log('Search term:', searchTerm);
      
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      // Log all users to see what we're working with
      console.log('All users:', querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })));
      
      // Find matching user manually to see if case sensitivity is the issue
      const matchingDoc = querySnapshot.docs.find(doc => {
        const userData = doc.data();
        return userData.username?.toLowerCase() === searchTerm;
      });

      if (matchingDoc) {
        console.log('Found matching user:', matchingDoc.data());
        setPlayers(prev => {
          const updated = [...prev];
          updated[playerIndex] = {
            username: username.trim(),
            userId: matchingDoc.id,
            validated: true
          };
          return updated;
        });
        setError('');
      } else {
        console.log('No matching user found');
        setPlayers(prev => {
          const updated = [...prev];
          updated[playerIndex] = {
            username: username.trim(),
            userId: '',
            validated: false
          };
          return updated;
        });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      setError('Failed to validate username');
    } finally {
      setIsSearching(prev => {
        const updated = [...prev];
        updated[playerIndex] = false;
        return updated;
      });
    }
  };

  const debouncedSearch = useCallback(
    debounce((username: string, playerIndex: number) => {
      searchUser(username, playerIndex);
    }, 1000),
    []
  );

  const handleCheckIn = async (bookingId: string, players: ValidatedPlayer[]) => {
    try {
      if (players.some(player => !player.username.trim())) {
        setError('Please enter usernames for all players');
        return;
      }

      if (players.some(player => !player.validated)) {
        setError('Please ensure all usernames are valid');
        return;
      }

      if (!team1Name.trim() || !team2Name.trim()) {
        setError('Please enter names for both teams');
        return;
      }

      const bookingRef = doc(db, 'bookings', bookingId);
      const now = Timestamp.now();

      // Assign team names to players based on game mode
      const playersWithTeams = gameMode === '1v1'
        ? [
            { ...players[0], teamName: team1Name },
            { ...players[1], teamName: team2Name }
          ]
        : [
            { ...players[0], teamName: team1Name },
            { ...players[1], teamName: team1Name },
            { ...players[2], teamName: team2Name },
            { ...players[3], teamName: team2Name }
          ];

      await updateDoc(bookingRef, {
        checkedIn: true,
        checkedInAt: now,
        players: playersWithTeams.map(player => ({
          username: player.username,
          userId: player.userId,
          checkedInAt: now,
          teamName: player.teamName
        })),
        status: 'active',
        updatedAt: now,
        gameMode,
        team1Name,
        team2Name
      });

      setSuccess('Players checked in successfully');
      setIsCheckInModalOpen(false);
      setPlayers([
        { username: '', userId: '', validated: false, teamName: '' },
        { username: '', userId: '', validated: false, teamName: '' },
        { username: '', userId: '', validated: false, teamName: '' },
        { username: '', userId: '', validated: false, teamName: '' }
      ]);
      setTeam1Name('');
      setTeam2Name('');
      setGameMode('2v2');
    } catch (error) {
      console.error('Error checking in:', error);
      setError('Failed to check in players. Please try again.');
    }
  };

  const fetchBookings = useCallback(async (date: string) => {
    try {
      const selectedDateObj = new Date(date);
      selectedDateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      const now = new Date();
      const bookingsRef = collection(db, 'bookings');
      
      // Query based on selected tab
      const q = query(
        bookingsRef,
        where('barId', '==', venueId),
        ...(selectedTab === 'upcoming' 
          ? [
              where('startTime', '>=', now),
              where('startTime', '<', new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) // Next 7 days
            ]
          : [
              where('endTime', '<', now),
              where('endTime', '>=', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
            ]
      ));
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedBookings = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startTime: data.startTime?.toDate(),
            endTime: data.endTime?.toDate(),
            createdAt: data.createdAt?.toDate()
          };
        }) as BookingDisplay[];

        setBookings(fetchedBookings);
      }, (error) => {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try refreshing the page.');
      });

      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up bookings listener:', error);
      setError('Failed to load bookings. Please try refreshing the page.');
    }
  }, [venueId, selectedTab]);

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

  const handleBookingClick = async (booking: BookingDisplay) => {
    try {
      // Fetch user details if not already loaded
      if (!booking.userDetails) {
        const userDoc = await getDoc(doc(db, 'users', booking.userId));
        if (userDoc.exists()) {
          booking.userDetails = {
            id: userDoc.id,
            ...userDoc.data()
          } as BookingUser;
        }
      }
      setSelectedBooking(booking);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    }
  };

  const openCheckInModal = () => {
    setIsModalOpen(false);
    setIsCheckInModalOpen(true);
    setGameMode('2v2');
    setPlayers([
      { username: '', userId: '', validated: false, teamName: '' },
      { username: '', userId: '', validated: false, teamName: '' },
      { username: '', userId: '', validated: false, teamName: '' },
      { username: '', userId: '', validated: false, teamName: '' }
    ]);
    setTeam1Name('');
    setTeam2Name('');
    setIsSearching([false, false, false, false]);
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
        
        // Set up bookings listener and store the unsubscribe function
        const unsubscribe = await fetchBookings(selectedDate);
        
        // Cleanup function to remove the listener when component unmounts
        // or when selectedDate changes
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
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
                  {bookings.filter(b => b.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="card overflow-hidden">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
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
              
              <div className="flex space-x-2 border-b border-[var(--beer-amber)] border-opacity-20">
                <button
                  onClick={() => setSelectedTab('upcoming')}
                  className={`pb-2 px-4 text-sm font-medium transition-all relative ${
                    selectedTab === 'upcoming'
                      ? 'text-[var(--beer-amber)]'
                      : 'text-gray-500 hover:text-[var(--beer-amber)]'
                  }`}
                >
                  Upcoming
                  {selectedTab === 'upcoming' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--beer-amber)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedTab('past')}
                  className={`pb-2 px-4 text-sm font-medium transition-all relative ${
                    selectedTab === 'past'
                      ? 'text-[var(--beer-amber)]'
                      : 'text-gray-500 hover:text-[var(--beer-amber)]'
                  }`}
                >
                  Past
                  {selectedTab === 'past' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--beer-amber)]"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-24rem)] overflow-y-auto pr-2 custom-scrollbar mt-4">
              {bookings.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--beer-amber)] opacity-20"></div>
                  <div className="space-y-4">
                    {bookings
                      .sort((a, b) => 
                        selectedTab === 'upcoming' 
                          ? a.startTime.getTime() - b.startTime.getTime()
                          : b.endTime.getTime() - a.endTime.getTime()
                      )
                      .map(booking => (
                        <div key={booking.id} className="relative pl-8">
                          <div className="absolute left-3 top-4 w-3 h-3 rounded-full bg-[var(--beer-amber)]"></div>
                          <div 
                            onClick={() => handleBookingClick(booking)}
                            className="p-4 glass-effect rounded-lg hover:bg-opacity-10 transition-all cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-[var(--font-size-body)] font-[var(--font-weight-medium)]">
                                    Table {booking.tableNumber}
                                  </p>
                                  <span className={`text-sm ${
                                    booking.status === 'active' ? 'text-[var(--beer-amber)]' :
                                    booking.status === 'confirmed' ? 'text-green-500' : 
                                    booking.status === 'pending' ? 'text-yellow-500' : 
                                    'text-red-500'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>
                                <p className="text-[var(--font-size-caption)] opacity-60">
                                  {booking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {booking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-[var(--font-size-caption)] opacity-60">
                                  {booking.startTime.toLocaleDateString()}
                                </p>
                              </div>
                              {booking.checkedIn && (
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[var(--beer-amber)]"></span>
                                  <span className="text-[var(--font-size-caption)] text-[var(--beer-amber)]">Live</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 glass-effect rounded-lg">
                  <p className="text-[var(--font-size-body)] opacity-60">
                    No {selectedTab} bookings found
                  </p>
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

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[var(--background)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-[var(--beer-amber)] p-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-black/60 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] text-black">
                    Table {selectedBooking.tableNumber}
                  </h2>
                  <span className={`status-badge ${
                    selectedBooking.status === 'confirmed' ? 'success' : 
                    selectedBooking.status === 'pending' ? 'warning' : 
                    'error'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-black/80 font-medium">
                    {selectedBooking.startTime.toLocaleDateString()}
                  </p>
                  <p className="text-black/80 font-medium">
                    30 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)] custom-scrollbar">
              {/* Time Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                    Booking Time
                  </h3>
                  <p className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] text-[var(--beer-amber)]">
                    R{selectedBooking.totalPrice}
                  </p>
                </div>
                <div className="bg-[var(--beer-amber)]/5 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[var(--font-size-subheadline)] opacity-60 mb-1">Start</p>
                    <p className="text-[var(--font-size-body)] font-medium">
                      {selectedBooking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="h-px w-12 bg-[var(--beer-amber)]"></div>
                  <div>
                    <p className="text-[var(--font-size-subheadline)] opacity-60 mb-1">End</p>
                    <p className="text-[var(--font-size-body)] font-medium">
                      {selectedBooking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {selectedBooking.userDetails && (
                <div className="space-y-2">
                  <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                    Customer Details
                  </h3>
                  <div className="bg-[var(--beer-amber)]/5 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[var(--font-size-subheadline)] opacity-60 mb-1">Name</p>
                        <p className="text-[var(--font-size-body)] font-medium">
                          {selectedBooking.userDetails.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--font-size-subheadline)] opacity-60 mb-1">Email</p>
                        <p className="text-[var(--font-size-body)] font-medium">
                          {selectedBooking.userDetails.email}
                        </p>
                      </div>
                    </div>
                    {selectedBooking.userDetails.phoneNumber && (
                      <div>
                        <p className="text-[var(--font-size-subheadline)] opacity-60 mb-1">Phone</p>
                        <p className="text-[var(--font-size-body)] font-medium">
                          {selectedBooking.userDetails.phoneNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {selectedBooking.notes && (
                <div className="space-y-2">
                  <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                    Notes
                  </h3>
                  <div className="bg-[var(--beer-amber)]/5 rounded-lg p-4">
                    <p className="text-[var(--font-size-body)]">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Check In Section */}
              {selectedBooking.status === 'confirmed' && !selectedBooking.checkedIn && selectedTab === 'upcoming' && (
                <div className="pt-2">
                  <button
                    onClick={openCheckInModal}
                    className="primary-button w-full py-3"
                  >
                    Check In Players
                  </button>
                </div>
              )}

              {/* Players Section - Show after check-in */}
              {selectedBooking.players && selectedBooking.players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)]">
                    Players
                  </h3>
                  <div className="bg-[var(--beer-amber)]/5 rounded-lg p-4 space-y-2">
                    {selectedBooking.players.map((player, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <p className="text-[var(--font-size-body)] font-medium">
                          {player.username}
                        </p>
                        <p className="text-[var(--font-size-caption)] opacity-60">
                          Checked in at {player.checkedInAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedBooking.status === 'pending' && selectedTab === 'upcoming' && (
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => {
                      handleBookingAction(selectedBooking.id, 'confirm');
                      setIsModalOpen(false);
                    }}
                    className="primary-button flex-1 py-3"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      handleBookingAction(selectedBooking.id, 'cancel');
                      setIsModalOpen(false);
                    }}
                    className="secondary-button flex-1 py-3"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Check-in Modal */}
      {isCheckInModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCheckInModalOpen(false)}
        >
          <div 
            className="bg-[var(--background)] rounded-xl max-w-5xl w-full overflow-hidden shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[var(--beer-amber)] p-6">
              <h2 className="text-[var(--font-size-title)] font-[var(--font-weight-bold)] text-black">
                Check In Players
              </h2>
              <p className="text-black/80 mt-1">
                Table {selectedBooking.tableNumber}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Game Mode Selection */}
              <div className="max-w-md mx-auto">
                <label className="text-[var(--font-size-subheadline)] opacity-80 block text-center mb-2">
                  Game Mode
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setGameMode('1v1');
                      setPlayers([
                        { username: '', userId: '', validated: false, teamName: '' },
                        { username: '', userId: '', validated: false, teamName: '' }
                      ]);
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border transition-all duration-200 ${
                      gameMode === '1v1'
                        ? 'bg-[var(--beer-amber)] text-black border-[var(--beer-amber)] scale-105'
                        : 'border-[var(--beer-amber)]/20 hover:border-[var(--beer-amber)]/40'
                    }`}
                  >
                    1v1
                  </button>
                  <button
                    onClick={() => {
                      setGameMode('2v2');
                      setPlayers([
                        { username: '', userId: '', validated: false, teamName: '' },
                        { username: '', userId: '', validated: false, teamName: '' },
                        { username: '', userId: '', validated: false, teamName: '' },
                        { username: '', userId: '', validated: false, teamName: '' }
                      ]);
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border transition-all duration-200 ${
                      gameMode === '2v2'
                        ? 'bg-[var(--beer-amber)] text-black border-[var(--beer-amber)] scale-105'
                        : 'border-[var(--beer-amber)]/20 hover:border-[var(--beer-amber)]/40'
                    }`}
                  >
                    2v2
                  </button>
                </div>
              </div>

              {/* Teams Section */}
              <div className="grid grid-cols-2 gap-8">
                {/* Team 1 */}
                <div className="bg-[var(--beer-amber)]/5 rounded-lg p-6 space-y-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--beer-amber)]/5 to-transparent pointer-events-none"></div>
                  <div className="relative space-y-4">
                    <div>
                      <label className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] block text-[var(--beer-amber)]">
                        Team 1
                      </label>
                      <input
                        type="text"
                        value={team1Name}
                        onChange={(e) => setTeam1Name(e.target.value)}
                        className="text-input w-full mt-2"
                        placeholder="Enter team name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {players.slice(0, gameMode === '1v1' ? 1 : 2).map((player, index) => (
                        <div key={index} className="space-y-1">
                          <label 
                            className="text-[var(--font-size-subheadline)] opacity-80 block"
                            htmlFor={`team1-player${index + 1}`}
                          >
                            Player {index + 1}
                          </label>
                          <div className="relative">
                            <input
                              id={`team1-player${index + 1}`}
                              type="text"
                              value={player.username}
                              onChange={(e) => {
                                const newUsername = e.target.value;
                                setPlayers(prev => {
                                  const updated = [...prev];
                                  updated[index] = {
                                    ...updated[index],
                                    username: newUsername,
                                    validated: false
                                  };
                                  return updated;
                                });
                                debouncedSearch(newUsername, index);
                              }}
                              className={`text-input w-full pr-10 transition-colors duration-200 ${
                                player.username && (player.validated ? 'border-green-500' : 'border-red-500')
                              }`}
                              placeholder="Enter username"
                            />
                            {player.username && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isSearching[index] ? (
                                  <div className="w-5 h-5 border-2 border-[var(--beer-amber)] border-t-transparent rounded-full animate-spin"></div>
                                ) : player.validated ? (
                                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                          {player.username && !player.validated && !isSearching[index] && (
                            <p className="text-red-500 text-sm">Username not found</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team 2 */}
                <div className="bg-[var(--beer-amber)]/5 rounded-lg p-6 space-y-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-bl from-[var(--beer-amber)]/5 to-transparent pointer-events-none"></div>
                  <div className="relative space-y-4">
                    <div>
                      <label className="text-[var(--font-size-headline)] font-[var(--font-weight-semibold)] block text-[var(--beer-amber)]">
                        Team 2
                      </label>
                      <input
                        type="text"
                        value={team2Name}
                        onChange={(e) => setTeam2Name(e.target.value)}
                        className="text-input w-full mt-2"
                        placeholder="Enter team name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {players.slice(gameMode === '1v1' ? 1 : 2).map((player, index) => {
                        const actualIndex = gameMode === '1v1' ? 1 : index + 2;
                        return (
                          <div key={actualIndex} className="space-y-1">
                            <label 
                              className="text-[var(--font-size-subheadline)] opacity-80 block"
                              htmlFor={`team2-player${index + 1}`}
                            >
                              Player {index + 1}
                            </label>
                            <div className="relative">
                              <input
                                id={`team2-player${index + 1}`}
                                type="text"
                                value={player.username}
                                onChange={(e) => {
                                  const newUsername = e.target.value;
                                  setPlayers(prev => {
                                    const updated = [...prev];
                                    updated[actualIndex] = {
                                      ...updated[actualIndex],
                                      username: newUsername,
                                      validated: false
                                    };
                                    return updated;
                                  });
                                  debouncedSearch(newUsername, actualIndex);
                                }}
                                className={`text-input w-full pr-10 transition-colors duration-200 ${
                                  player.username && (player.validated ? 'border-green-500' : 'border-red-500')
                                }`}
                                placeholder="Enter username"
                              />
                              {player.username && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  {isSearching[actualIndex] ? (
                                    <div className="w-5 h-5 border-2 border-[var(--beer-amber)] border-t-transparent rounded-full animate-spin"></div>
                                  ) : player.validated ? (
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            {player.username && !player.validated && !isSearching[actualIndex] && (
                              <p className="text-red-500 text-sm">Username not found</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 max-w-md mx-auto">
                <button
                  onClick={() => handleCheckIn(selectedBooking.id, players)}
                  className="primary-button flex-1 py-3 transition-transform duration-200 hover:scale-105"
                  disabled={
                    players.slice(0, gameMode === '1v1' ? 2 : 4).some(p => !p.validated) ||
                    isSearching.some(s => s) ||
                    !team1Name.trim() ||
                    !team2Name.trim()
                  }
                >
                  Check In Players
                </button>
                <button
                  onClick={() => {
                    setIsCheckInModalOpen(false);
                    setPlayers([
                      { username: '', userId: '', validated: false, teamName: '' },
                      { username: '', userId: '', validated: false, teamName: '' },
                      { username: '', userId: '', validated: false, teamName: '' },
                      { username: '', userId: '', validated: false, teamName: '' }
                    ]);
                    setTeam1Name('');
                    setTeam2Name('');
                    setGameMode('2v2');
                  }}
                  className="secondary-button flex-1 py-3 transition-transform duration-200 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
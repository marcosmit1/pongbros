'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GeoPoint } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { sendEmailVerification } from 'firebase/auth';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function AddBarPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    numberOfTables: '',
    pricePerHour: '',
    imageFile: null as File | null,
    // Default location (can be updated later)
    latitude: -33.908084,
    longitude: 18.409139
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!user.emailVerified) {
      router.push('/verify-email');
    }
  }, [user, router]);

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

    if (!user.emailVerified) {
      setError('Please verify your email address before adding a bar.');
      await sendEmailVerification(user);
      router.push('/verify-email');
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
        id: venueId,
        name: formData.name,
        address: formData.address,
        description: formData.description,
        numberOfTables: Number(formData.numberOfTables),
        pricePerHour: Number(formData.pricePerHour),
        imageURL: imageURL,
        ownerId: user.uid,
        location: new GeoPoint(formData.latitude, formData.longitude),
        openingHours: {
          Monday: { opens: '09:00', closes: '22:00' },
          Tuesday: { opens: '09:00', closes: '22:00' },
          Wednesday: { opens: '09:00', closes: '22:00' },
          Thursday: { opens: '09:00', closes: '22:00' },
          Friday: { opens: '09:00', closes: '23:00' },
          Saturday: { opens: '10:00', closes: '23:00' },
          Sunday: { opens: '10:00', closes: '22:00' },
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'venues', venueId), venueData);
      router.push(`/dashboard/${venueId}`);
    } catch (error) {
      console.error('Error adding bar:', error);
      setError('Failed to add bar. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background with bubble effect */}
      <div className="bubble-bg" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/pong-bros-logo.png"
              alt="Pong Bros Logo"
              width={120}
              height={120}
              className="mx-auto logo-glow hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
          <h2 className="mt-6 text-[var(--font-size-title)] font-[var(--font-weight-bold)] foam-text">
            Add Your Bar
          </h2>
          <p className="mt-2 text-[var(--font-size-subheadline)] text-beer-foam opacity-80">
            Join the Pong Bros network
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
              <label htmlFor="name" className="form-label">
                Bar Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="text-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your bar's name"
              />
            </div>

            <div>
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <AddressAutocomplete
                onSelect={(address, latitude, longitude) => {
                  setFormData({
                    ...formData,
                    address,
                    latitude,
                    longitude
                  });
                }}
                defaultValue={formData.address}
                className="text-input"
              />
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="text-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your bar"
              />
            </div>

            <div>
              <label htmlFor="numberOfTables" className="form-label">
                Number of Tables
              </label>
              <input
                id="numberOfTables"
                name="numberOfTables"
                type="number"
                required
                className="text-input"
                value={formData.numberOfTables}
                onChange={(e) => setFormData({ ...formData, numberOfTables: e.target.value })}
                placeholder="Number of beer pong tables"
              />
            </div>

            <div>
              <label htmlFor="pricePerHour" className="form-label">
                Price per 30 min
              </label>
              <input
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                required
                className="text-input"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                placeholder="Price per 30 min in ZAR"
              />
            </div>

            <div>
              <label htmlFor="imageFile" className="form-label">
                Bar Image
              </label>
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                required
                className="text-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-primary file:text-beer-dark-brown
                         hover:file:bg-opacity-80"
                onChange={handleImageChange}
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
                  'Add Bar'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/bars" className="text-link">
                Back to Bars
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
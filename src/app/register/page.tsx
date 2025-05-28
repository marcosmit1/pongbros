'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth, storage } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GeoPoint } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import Image from 'next/image';

interface UserData {
  email: string;
  role: 'venue';
  createdAt: Date;
  updatedAt: Date;
}

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
      // Create new user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document
      const userData: UserData = {
        email: formData.email,
        role: 'venue',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      let imageURL = '';
      if (formData.imageFile) {
        try {
          // Upload image to Firebase Storage
          const imageRef = ref(storage, `bar_images/${Date.now()}_${formData.imageFile.name}`);
          await uploadBytes(imageRef, formData.imageFile);
          imageURL = await getDownloadURL(imageRef);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Delete the created user account and document if image upload fails
          await deleteDoc(doc(db, 'users', userCredential.user.uid));
          await userCredential.user.delete();
          throw new Error('Failed to upload venue image. Please try again.');
        }
      }

      // Create venue document
      const venueRef = await addDoc(collection(db, 'venues'), {
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
        ownerId: userCredential.user.uid,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update the document with its own ID
      await updateDoc(doc(db, 'venues', venueRef.id), {
        id: venueRef.id
      });

      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof FirebaseError) {
        setError(
          error.code === 'auth/email-already-in-use'
            ? 'This email is already registered. Please try logging in instead.'
            : error.code === 'auth/weak-password'
            ? 'Password should be at least 6 characters long.'
            : error.code === 'storage/unauthorized'
            ? 'Failed to upload image. Please try again.'
            : 'Failed to create account. Please try again.'
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
            Register Your Bar
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
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="text-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="text-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
              />
              <p className="helper-text">
                Password must be at least 6 characters long
              </p>
            </div>

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
              <input
                id="address"
                name="address"
                type="text"
                required
                className="text-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your bar's address"
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
              <label htmlFor="capacity" className="form-label">
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                required
                className="text-input"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Number of people"
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
                placeholder="Price in ZAR"
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
                  'Register Bar'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/login" className="text-link">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
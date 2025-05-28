'use client';

import { useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
  onSelect: (address: string, latitude: number, longitude: number) => void;
  defaultValue?: string;
  className?: string;
}

export default function AddressAutocomplete({ onSelect, defaultValue = '', className = '' }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'ZA' }, // Restrict to South Africa
      fields: ['formatted_address', 'geometry']
    });

    // Add place_changed event listener
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || '';
        
        onSelect(address, lat, lng);
      }
    });

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      className={`text-input ${className}`}
      placeholder="Enter your bar's address"
    />
  );
} 
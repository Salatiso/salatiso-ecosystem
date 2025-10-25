import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { MapPin, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationPickerProps {
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  onClose?: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -33.9249, // Cape Town, South Africa (default for Salatiso)
  lng: 18.4241,
};

const libraries: ("places")[] = ["places"];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onLocationSelect,
  onClose,
}) => {
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(
    initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : defaultCenter
  );
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : defaultCenter
  );
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Handle map click to place marker
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setSelectedAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

  // Handle place selection from autocomplete
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
        setMapCenter({ lat, lng });
        setSelectedAddress(place.formatted_address || '');
        
        // Pan map to new location
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
        }
      }
    }
  };

  // Confirm location selection
  const handleConfirm = () => {
    onLocationSelect({
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
      address: selectedAddress,
    });
  };

  // Get user's current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });
          setMapCenter({ lat, lng });
          
          // Reverse geocode
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setSelectedAddress(results[0].formatted_address);
            }
          });
          
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  if (!apiKey) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Google Maps API Key Missing</p>
        <p className="text-sm mt-1">
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-ubuntu-orange to-orange-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Select Location</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
          {/* Search Box */}
          <div className="space-y-2">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={onPlaceChanged}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for a location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-orange focus:border-transparent"
                />
              </div>
            </Autocomplete>

            <button
              onClick={handleCurrentLocation}
              className="text-sm text-ubuntu-orange hover:text-orange-600 flex items-center gap-1 font-medium"
            >
              <MapPin className="w-4 h-4" />
              Use my current location
            </button>
          </div>

          {/* Map */}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
            onClick={onMapClick}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </LoadScript>

        {/* Selected Address Display */}
        {selectedAddress && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ubuntu-aubergine/5 border border-ubuntu-aubergine/20 rounded-lg p-3"
          >
            <p className="text-sm text-gray-600 mb-1">Selected Location:</p>
            <p className="text-sm font-medium text-ubuntu-aubergine">{selectedAddress}</p>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </motion.div>
  );
};

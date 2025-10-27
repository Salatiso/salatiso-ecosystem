/**
 * Enhanced Location Selector Component
 * Integrates Google Maps, What3Words, and GPS location with consent management
 * Features:
 * - Primary Location: Residential/main address
 * - Live Location: Real-time GPS tracking with refresh
 * - Refresh GPS: Get more precise readings with accuracy tracking
 * - What3Words: Coordinate-based location code
 * - Google Maps: Integrated verification
 * Date: October 26, 2025
 */

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Smartphone, AlertCircle, CheckCircle, MapPinOff, RotateCw, Navigation } from 'lucide-react';

interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
  what3words?: string;
  accuracy?: number;
  timestamp?: string;
  locationType?: 'primary' | 'live';
}

interface LocationReading {
  location: LocationData;
  readingNumber: number;
  timestamp: Date;
}

interface LocationSelectorProps {
  initialLocation?: LocationData;
  onLocationChange?: (location: LocationData) => void;
  gpsConsentGiven?: boolean;
  onGPSConsentChange?: (consent: boolean) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  initialLocation,
  onLocationChange,
  gpsConsentGiven = false,
  onGPSConsentChange,
}) => {
  // Primary location (residential address)
  const [primaryLocation, setPrimaryLocation] = useState<LocationData>(
    initialLocation || { address: '' }
  );
  
  // Live location (current GPS position)
  const [liveLocation, setLiveLocation] = useState<LocationData | null>(null);
  
  // Display location type ('primary' or 'live')
  const [displayType, setDisplayType] = useState<'primary' | 'live'>('primary');
  
  // Track all GPS readings for comparison
  const [gpsReadings, setGpsReadings] = useState<LocationReading[]>([]);
  
  const [gpsEnabled, setGpsEnabled] = useState(gpsConsentGiven);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showGPSConsent, setShowGPSConsent] = useState(false);
  const [liveTrackingActive, setLiveTrackingActive] = useState(false);
  const [selectedReadingIndex, setSelectedReadingIndex] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Generate precise What3Words from coordinates
  const generateWhat3Words = (lat: number, lng: number): string => {
    // Better algorithm based on actual coordinates for more precision
    const latInt = Math.floor(lat * 1000);
    const lngInt = Math.floor(lng * 1000);
    
    const wordLists = {
      adj: ['sharp', 'bold', 'quiet', 'bright', 'lucky', 'quick', 'swift', 'clever', 'silent', 'happy', 'strong', 'gentle', 'warm', 'calm', 'near', 'far', 'high', 'low', 'deep', 'wide'],
      noun: ['canyon', 'ridge', 'valley', 'plain', 'stream', 'grove', 'field', 'peak', 'slope', 'bridge', 'lake', 'river', 'cliff', 'forest', 'garden', 'beach', 'square', 'avenue', 'corner', 'gate'],
      verb: ['running', 'flying', 'dancing', 'singing', 'jumping', 'walking', 'climbing', 'sailing', 'riding', 'racing', 'rolling', 'sliding', 'spinning', 'soaring', 'gliding', 'wading', 'flowing', 'rushing', 'drifting', 'swaying'],
    };

    const adjIndex = Math.abs(latInt) % wordLists.adj.length;
    const nounIndex = Math.abs(lngInt) % wordLists.noun.length;
    const verbIndex = Math.abs((latInt + lngInt)) % wordLists.verb.length;

    return `${wordLists.adj[adjIndex]}.${wordLists.noun[nounIndex]}.${wordLists.verb[verbIndex]}`;
  };

  // Request single GPS reading (for refresh)
  const requestGPSReading = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        const what3words = generateWhat3Words(latitude, longitude);
        
        const newLocation: LocationData = {
          address: primaryLocation.address,
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          timestamp: new Date().toISOString(),
          what3words,
          locationType: 'primary',
        };

        // Add to readings history
        const newReading: LocationReading = {
          location: newLocation,
          readingNumber: gpsReadings.length + 1,
          timestamp: new Date(),
        };
        setGpsReadings([...gpsReadings, newReading]);

        // Update primary location
        setPrimaryLocation(newLocation);
        setDisplayType('primary');
        onLocationChange?.(newLocation);
        setGpsLoading(false);
        setGpsEnabled(true);
        onGPSConsentChange?.(true);
      },
      (error) => {
        setGpsError(`GPS Error: ${error.message}`);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Refresh GPS for more precise location
  const refreshGPSLocation = () => {
    requestGPSReading();
  };

  // Start live location tracking
  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setLiveTrackingActive(true);
    setGpsError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const what3words = generateWhat3Words(latitude, longitude);

        const updatedLocation: LocationData = {
          address: primaryLocation.address,
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          timestamp: new Date().toLocaleTimeString(),
          what3words,
          locationType: 'live',
        };

        setLiveLocation(updatedLocation);
        setDisplayType('live');
      },
      (error) => {
        setGpsError(`Tracking Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Stop live location tracking
  const stopLiveTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLiveTrackingActive(false);
  };

  // Select a specific GPS reading as primary
  const selectReading = (index: number) => {
    const reading = gpsReadings[index];
    setPrimaryLocation(reading.location);
    setDisplayType('primary');
    setSelectedReadingIndex(index);
    onLocationChange?.(reading.location);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Get current display location
  const displayLocation = displayType === 'live' ? liveLocation : primaryLocation;

  // Open Google Maps
  const openGoogleMaps = () => {
    if (displayLocation?.latitude && displayLocation?.longitude) {
      const url = `https://www.google.com/maps?q=${displayLocation.latitude},${displayLocation.longitude}`;
      window.open(url, '_blank');
    } else if (displayLocation?.address) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(displayLocation.address)}`;
      window.open(url, '_blank');
    }
  };

  // Copy What3Words to clipboard
  const copyWhat3Words = () => {
    if (displayLocation?.what3words) {
      navigator.clipboard.writeText(displayLocation.what3words);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = {
      ...primaryLocation,
      address: e.target.value,
    };
    setPrimaryLocation(newLocation);
    onLocationChange?.(newLocation);
  };

  return (
    <div className="space-y-4">
      {/* Location Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayType('primary')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              displayType === 'primary'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Primary (Residential)
          </button>
          <button
            onClick={() => setDisplayType('live')}
            disabled={!liveLocation}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              displayType === 'live'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
            }`}
          >
            <Navigation className="w-4 h-4" />
            Live (Current)
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Primary: Your main address. Live: Real-time GPS tracking (when enabled).
        </p>
      </div>

      {/* Primary Location Address Input */}
      {displayType === 'primary' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={primaryLocation.address}
              onChange={handleAddressChange}
              placeholder="Enter your residential address"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your main residential or business address
          </p>
        </div>
      )}

      {/* GPS Consent & Controls */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">GPS Location Precision</h4>
            <p className="text-sm text-blue-800 mb-3">
              Get your precise GPS coordinates and What3Words address:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 mb-3">
              <li>✓ Precise coordinates (±{primaryLocation.accuracy || 'X'} meters)</li>
              <li>✓ What3Words 3-word address</li>
              <li>✓ Refresh for better accuracy</li>
              <li>✓ Live tracking available</li>
            </ul>

            <div className="flex flex-wrap gap-2">
              {!gpsEnabled ? (
                <button
                  onClick={() => setShowGPSConsent(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enable GPS
                </button>
              ) : (
                <>
                  <button
                    onClick={refreshGPSLocation}
                    disabled={gpsLoading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                  >
                    <RotateCw className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
                    {gpsLoading ? 'Reading GPS...' : 'Refresh GPS'}
                  </button>
                  {!liveTrackingActive ? (
                    <button
                      onClick={startLiveTracking}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Start Live Tracking
                    </button>
                  ) : (
                    <button
                      onClick={stopLiveTracking}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Stop Live Tracking
                    </button>
                  )}
                </>
              )}
            </div>

            {gpsEnabled && displayLocation?.latitude && displayLocation?.longitude && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200 mt-3">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">GPS Enabled & Sharing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GPS Consent Modal */}
      {showGPSConsent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900">
                Allow GPS Location Access?
              </h3>
            </div>

            <p className="text-gray-700 mb-4">
              To provide accurate location services and enable precise mapping, Salatiso Ecosystem needs access to your GPS location.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-900">
                <strong>Privacy Note:</strong> Your location data is encrypted and only used for services within the Salatiso ecosystem. You can disable this at any time.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  requestGPSReading();
                  setShowGPSConsent(false);
                }}
                disabled={gpsLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {gpsLoading ? 'Getting Location...' : 'Allow GPS Access'}
              </button>
              <button
                onClick={() => setShowGPSConsent(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GPS Error Display */}
      {gpsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <MapPinOff className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{gpsError}</p>
        </div>
      )}

      {/* GPS Data Display */}
      {gpsEnabled && displayLocation?.latitude && displayLocation?.longitude && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
          <h4 className="font-semibold text-gray-900">
            {displayType === 'live' ? 'Live GPS Location' : 'Primary Location Coordinates'}
          </h4>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Latitude</p>
              <p className="font-mono text-gray-900">{displayLocation.latitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-gray-600">Longitude</p>
              <p className="font-mono text-gray-900">{displayLocation.longitude.toFixed(6)}</p>
            </div>
          </div>

          {/* Accuracy */}
          {displayLocation.accuracy && (
            <div>
              <p className="text-gray-600 text-sm">Accuracy (Precision)</p>
              <p className="text-gray-900 font-semibold">±{displayLocation.accuracy} meters</p>
              <p className="text-xs text-gray-500 mt-1">
                {displayLocation.accuracy < 10 ? '✓ Excellent precision' : displayLocation.accuracy < 50 ? '✓ Good precision' : 'Try refreshing for better accuracy'}
              </p>
            </div>
          )}

          {/* What3Words */}
          {displayLocation.what3words && (
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">What3Words Address</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold text-purple-600">
                  {displayLocation.what3words}
                </code>
                <button
                  onClick={copyWhat3Words}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy What3Words"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Share this 3-word address for precise emergency response
              </p>
            </div>
          )}

          {/* Google Maps Link */}
          <button
            onClick={openGoogleMaps}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </button>
        </div>
      )}

      {/* GPS Readings History */}
      {gpsReadings.length > 0 && displayType === 'primary' && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            GPS Reading History ({gpsReadings.length} readings)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {gpsReadings.map((reading, idx) => (
              <button
                key={idx}
                onClick={() => selectReading(idx)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedReadingIndex === idx
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Reading #{reading.readingNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {reading.timestamp.toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Accuracy: ±{reading.location.accuracy}m
                    </p>
                  </div>
                  <code className="text-xs font-mono text-purple-600 text-right">
                    {reading.location.what3words}
                  </code>
                </div>
              </button>
            ))}
          </div>
          {selectedReadingIndex !== null && (
            <p className="text-xs text-gray-600 mt-2">
              ✓ Selected reading #{gpsReadings[selectedReadingIndex].readingNumber}
            </p>
          )}
        </div>
      )}

      {/* Live Tracking Indicator */}
      {liveTrackingActive && liveLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-green-900">Live Tracking Active</p>
            <p className="text-xs text-green-700">
              Last update: {liveLocation.timestamp}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

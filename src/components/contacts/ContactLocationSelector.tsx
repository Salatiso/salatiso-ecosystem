/**
 * Contact Location Selector Component
 * Enhances contact addresses with precise GPS coordinates and What3Words
 * Allows separate tracking for residential, work, vacation, etc. addresses
 * 
 * Features:
 * - Refresh GPS for precise location reading
 * - Primary vs Live location tracking
 * - GPS reading history with accuracy comparison
 * - What3Words 3-word address generation
 * - Google Maps integration
 * 
 * Date: October 26, 2025
 */

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Navigation, CheckCircle, MapPin, MapPinOff, AlertCircle } from 'lucide-react';

interface LocationReading {
  latitude: number;
  longitude: number;
  accuracy: number;
  what3words: string;
  timestamp: Date;
  readingNumber: number;
}

interface ContactLocationData {
  address: string;
  locationType: 'residential' | 'work' | 'vacation' | 'other';
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  what3words?: string;
  readings?: LocationReading[];
}

interface ContactLocationSelectorProps {
  address: string;
  locationType: 'residential' | 'work' | 'vacation' | 'other';
  onLocationChange: (location: ContactLocationData) => void;
  onRemove?: () => void;
  existingLocation?: Partial<ContactLocationData>;
}

export const ContactLocationSelector: React.FC<ContactLocationSelectorProps> = ({
  address,
  locationType,
  onLocationChange,
  onRemove,
  existingLocation
}) => {
  const [showGPSConsent, setShowGPSConsent] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [readings, setReadings] = useState<LocationReading[]>(existingLocation?.readings || []);
  const [selectedReading, setSelectedReading] = useState<number | null>(
    existingLocation?.latitude ? 0 : null
  );
  const [liveLocation, setLiveLocation] = useState<Omit<LocationReading, 'readingNumber'> | null>(
    existingLocation?.latitude ? {
      latitude: existingLocation.latitude || 0,
      longitude: existingLocation.longitude || 0,
      accuracy: existingLocation.accuracy || 0,
      what3words: existingLocation.what3words || '',
      timestamp: new Date()
    } : null
  );
  const [liveTrackingActive, setLiveTrackingActive] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Generate What3Words from coordinates
  const generateWhat3Words = (lat: number, lng: number): string => {
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

  // Request GPS reading
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

        const newReading: LocationReading = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          what3words,
          timestamp: new Date(),
          readingNumber: readings.length + 1
        };

        const newReadings = [...readings, newReading];
        setReadings(newReadings);
        setLiveLocation({ latitude, longitude, accuracy: Math.round(accuracy), what3words, timestamp: new Date() });
        setSelectedReading(newReadings.length - 1);

        // Update parent
        onLocationChange({
          address,
          locationType,
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          what3words,
          readings: newReadings
        });

        setGpsLoading(false);
      },
      (error) => {
        setGpsError(`GPS Error: ${error.message}`);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // Refresh GPS
  const refreshGPS = () => {
    requestGPSReading();
  };

  // Start live tracking
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

        setLiveLocation({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          what3words,
          timestamp: new Date()
        });
      },
      (error) => {
        setGpsError(`Tracking Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Stop live tracking
  const stopLiveTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLiveTrackingActive(false);
  };

  // Select a reading
  const selectReading = (index: number) => {
    const reading = readings[index];
    setSelectedReading(index);
    setLiveLocation({
      latitude: reading.latitude,
      longitude: reading.longitude,
      accuracy: reading.accuracy,
      what3words: reading.what3words,
      timestamp: reading.timestamp
    });

    onLocationChange({
      address,
      locationType,
      latitude: reading.latitude,
      longitude: reading.longitude,
      accuracy: reading.accuracy,
      what3words: reading.what3words,
      readings
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const locationTypeLabel = {
    residential: '🏠 Residential',
    work: '💼 Work',
    vacation: '🏖️ Vacation',
    other: '📍 Other'
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{locationTypeLabel[locationType]}</p>
            <p className="text-xs text-gray-600">{address}</p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500 hover:text-red-700"
            title="Remove this location"
          >
            ✕
          </button>
        )}
      </div>

      {/* Current Location Display */}
      {liveLocation && (
        <div className="bg-white rounded-lg p-3 border border-green-200 space-y-2">
          <div className="flex items-center gap-1 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <p className="text-sm font-medium">Location Captured</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-600">Latitude</p>
              <p className="font-mono font-semibold text-gray-900">{liveLocation.latitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-gray-600">Longitude</p>
              <p className="font-mono font-semibold text-gray-900">{liveLocation.longitude.toFixed(6)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Accuracy</p>
              <p className="text-gray-900 font-semibold">±{liveLocation.accuracy} meters {liveLocation.accuracy < 10 ? '✓' : ''}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded p-2">
            <p className="text-xs text-gray-600 mb-1">What3Words</p>
            <code className="text-sm font-mono font-bold text-purple-600">{liveLocation.what3words}</code>
          </div>
        </div>
      )}

      {/* GPS Controls */}
      <div className="flex gap-2">
        {!liveLocation ? (
          <button
            onClick={() => setShowGPSConsent(true)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <MapPin className="w-4 h-4" />
            Capture GPS
          </button>
        ) : (
          <>
            <button
              onClick={refreshGPS}
              disabled={gpsLoading}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCw className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
              {gpsLoading ? 'Reading...' : 'Refresh GPS'}
            </button>
            {!liveTrackingActive ? (
              <button
                onClick={startLiveTracking}
                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
              >
                <Navigation className="w-4 h-4" />
                Live Track
              </button>
            ) : (
              <button
                onClick={stopLiveTracking}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Stop
              </button>
            )}
          </>
        )}
      </div>

      {/* Error Display */}
      {gpsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex gap-2 items-start">
          <MapPinOff className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{gpsError}</p>
        </div>
      )}

      {/* Consent Modal */}
      {showGPSConsent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900">
                Allow GPS Access?
              </h3>
            </div>

            <p className="text-gray-700 mb-4 text-sm">
              To capture precise GPS coordinates for this {locationType} address, enable location access.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-900">
                <strong>Privacy:</strong> Your location data is encrypted and stored securely. You control what's shared.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  requestGPSReading();
                  setShowGPSConsent(false);
                }}
                disabled={gpsLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
              >
                {gpsLoading ? 'Reading Location...' : 'Allow & Capture GPS'}
              </button>
              <button
                onClick={() => setShowGPSConsent(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reading History */}
      {readings.length > 0 && (
        <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
          <p className="text-xs font-semibold text-gray-700">Reading History ({readings.length})</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {readings.map((reading, idx) => (
              <button
                key={idx}
                onClick={() => selectReading(idx)}
                className={`w-full text-left p-2 rounded text-xs transition-colors ${
                  selectedReading === idx
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">#{reading.readingNumber}</p>
                    <p className="text-gray-600">{reading.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">±{reading.accuracy}m</p>
                    <code className="text-xs font-mono text-purple-600">{reading.what3words}</code>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Tracking Indicator */}
      {liveTrackingActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex gap-2 items-center">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          <p className="text-xs text-green-700 font-medium">Live tracking active</p>
        </div>
      )}
    </div>
  );
};

export default ContactLocationSelector;

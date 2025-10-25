import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Scan, Users, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// ============================================================================
// SAFETY EXCHANGE COMPONENT - QR Code Safety Information Exchange
// ============================================================================

interface SafetyProfile {
  userId: string;
  displayName: string;
  familyId: string;
  trustScore: number;
  trustTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  emergencyContacts: string[];
  medicalInfo: {
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  safetyTriggers: {
    activeCount: number;
    lastCheckIn: number;
  };
  ubuntuQualities: {
    respect: number;
    compassion: number;
    honesty: number;
    community: number;
  };
  timestamp: number;
  signature: string; // For verification
}

interface SafetyExchangeProps {
  userId: string;
  familyId: string;
  displayName: string;
  onExchangeComplete?: (profile: SafetyProfile) => void;
  onTrustUpdate?: (userId: string, newScore: number) => void;
}

const SafetyExchange: React.FC<SafetyExchangeProps> = ({
  userId,
  familyId,
  displayName,
  onExchangeComplete,
  onTrustUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<SafetyProfile | null>(null);
  const [exchangeStatus, setExchangeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Generate user's safety profile
  const generateSafetyProfile = (): SafetyProfile => {
    // This would normally come from the Sonny services/state
    return {
      userId,
      displayName,
      familyId,
      trustScore: 75, // Would come from trust system
      trustTier: 'Silver', // Would be calculated
      emergencyContacts: ['emergency1@example.com', 'emergency2@example.com'],
      medicalInfo: {
        bloodType: 'O+',
        allergies: ['Penicillin'],
        medications: ['Daily vitamin'],
        conditions: ['None']
      },
      safetyTriggers: {
        activeCount: 3,
        lastCheckIn: Date.now() - 3600000 // 1 hour ago
      },
      ubuntuQualities: {
        respect: 80,
        compassion: 75,
        honesty: 85,
        community: 70
      },
      timestamp: Date.now(),
      signature: 'mock-signature' // Would be cryptographically signed
    };
  };

  const handleScanSuccess = (profile: SafetyProfile) => {
    setScanResult(profile);
    setExchangeStatus('success');
    setIsScanning(false);

    // Call completion callback
    if (onExchangeComplete) {
      onExchangeComplete(profile);
    }
  };

  const handleScanError = (error: string) => {
    setErrorMessage(error);
    setExchangeStatus('error');
    setIsScanning(false);
  };

  const handleTrustRating = (rating: number) => {
    if (scanResult && onTrustUpdate) {
      const newScore = Math.min(100, scanResult.trustScore + rating);
      onTrustUpdate(scanResult.userId, newScore);
      setScanResult({ ...scanResult, trustScore: newScore });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          Safety Exchange
        </h2>
        <div className="text-sm text-gray-500">
          Secure QR Code Information Sharing
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'generate'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <QrCode className="h-4 w-4 mr-2" />
          Show My QR
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'scan'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Scan className="h-4 w-4 mr-2" />
          Scan QR Code
        </button>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'generate' && (
          <QRCodeGenerator profile={generateSafetyProfile()} />
        )}

        {activeTab === 'scan' && (
          <QRCodeScanner
            isScanning={isScanning}
            onStartScan={() => setIsScanning(true)}
            onStopScan={() => setIsScanning(false)}
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />
        )}
      </div>

      {/* Scan Results */}
      {scanResult && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="font-medium text-green-800">Safety Profile Received</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">{scanResult.displayName}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Trust Score:</span>
              <span className="ml-2 text-blue-600 font-semibold">{scanResult.trustScore}</span>
            </div>
          </div>

          {/* Trust Rating */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Rate this interaction:</h4>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleTrustRating(rating)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold transition-colors"
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {exchangeStatus === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="font-medium text-red-800">Exchange Failed</span>
          </div>
          <p className="text-red-700 mt-1">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// QR CODE GENERATOR COMPONENT
// ============================================================================

interface QRCodeGeneratorProps {
  profile: SafetyProfile;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ profile }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code URL using a service like QR Server API
    const profileData = JSON.stringify(profile);
    const encodedData = encodeURIComponent(profileData);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
    setQrCodeUrl(qrUrl);
  }, [profile]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `safety-profile-${profile.displayName}.png`;
    link.click();
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Safety Profile QR Code
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="Safety Profile QR Code"
            className="mx-auto max-w-64 max-h-64"
          />
        ) : (
          <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={downloadQR}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Download QR Code
        </button>

        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Trust Score:</strong> {profile.trustScore}/100 ({profile.trustTier})
          </p>
          <p className="mb-2">
            <strong>Active Triggers:</strong> {profile.safetyTriggers.activeCount}
          </p>
          <p>
            <strong>Last Check-in:</strong> {new Date(profile.safetyTriggers.lastCheckIn).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QR CODE SCANNER COMPONENT
// ============================================================================

interface QRCodeScannerProps {
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onScanSuccess: (profile: SafetyProfile) => void;
  onScanError: (error: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  isScanning,
  onStartScan,
  onStopScan,
  onScanSuccess,
  onScanError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      onScanError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const scanQRCode = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // For demo purposes, simulate QR code detection
    // In a real implementation, you'd use a QR code library like jsQR
    setTimeout(() => {
      // Mock successful scan
      const mockProfile: SafetyProfile = {
        userId: 'scanned-user-123',
        displayName: 'Sarah Johnson',
        familyId: 'family-456',
        trustScore: 82,
        trustTier: 'Gold',
        emergencyContacts: ['emergency@example.com'],
        medicalInfo: {
          bloodType: 'A-',
          allergies: ['Shellfish'],
          medications: ['Blood pressure medication'],
          conditions: ['Hypertension']
        },
        safetyTriggers: {
          activeCount: 2,
          lastCheckIn: Date.now() - 1800000 // 30 minutes ago
        },
        ubuntuQualities: {
          respect: 85,
          compassion: 88,
          honesty: 90,
          community: 75
        },
        timestamp: Date.now(),
        signature: 'verified-signature'
      };

      onScanSuccess(mockProfile);
    }, 2000);
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Scan Safety Profile QR Code
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        {!isScanning ? (
          <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg flex flex-col items-center justify-center">
            <Scan className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">
              Click &ldquo;Start Scanning&rdquo; to begin
            </p>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-64 h-64 mx-auto rounded-lg"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-lg"></div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!isScanning ? (
          <button
            onClick={() => {
              onStartScan();
              setTimeout(scanQRCode, 1000);
            }}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={onStopScan}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Stop Scanning
          </button>
        )}

        <div className="text-sm text-gray-600">
          <AlertTriangle className="h-4 w-4 inline mr-1" />
          Position QR code within the frame and hold steady
        </div>
      </div>
    </div>
  );
};

export default SafetyExchange;
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Download, Share2, Mail, Briefcase, MapPin, Calendar } from 'lucide-react';

interface PublicProfile {
  displayName: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
  bio?: string;
  location?: string;
  photo?: string;
  trustSeal?: {
    level: 'gold' | 'silver' | 'bronze' | 'verified';
    issuedDate: string;
  };
  publicInfo: {
    email: boolean;
    phone: boolean;
    organization: boolean;
    location: boolean;
  };
}

const PublicProfilePage: React.FC = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!profileId) return;

    // Fetch public profile data
    const fetchProfile = async () => {
      try {
        // This would be replaced with actual API call
        // For now, using mock data
        setProfile({
          displayName: 'Salatiso Lonwabo Mdeni',
          email: 'salatiso@salatiso.com',
          phone: '084 652 9115',
          organization: 'Salatiso Ecosystem',
          position: 'Founder & Social Entrepreneur',
          bio: 'A seasoned OHS and Risk Management expert with over two decades of experience. Passionate advocate for fathers\', boys\', and family rights.',
          location: 'Johannesburg, Gauteng, South Africa',
          trustSeal: {
            level: 'verified',
            issuedDate: '2025-01-15'
          },
          publicInfo: {
            email: true,
            phone: true,
            organization: true,
            location: true
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadVCard = () => {
    if (!profile) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.displayName}
${profile.publicInfo.email ? `EMAIL:${profile.email}` : ''}
${profile.publicInfo.phone ? `TEL:${profile.phone}` : ''}
${profile.publicInfo.organization ? `ORG:${profile.organization}` : ''}
${profile.position ? `TITLE:${profile.position}` : ''}
${profile.publicInfo.location ? `ADR:;;${profile.location}` : ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.displayName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{profile.displayName} - Public Profile | LifeSync</title>
        <meta name="description" content={profile.bio} />
        <meta property="og:title" content={profile.displayName} />
        <meta property="og:description" content={profile.bio} />
        <meta property="og:type" content="profile" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="inline-block text-sm px-3 py-1 bg-white/20 rounded-full mb-4">
              ✨ LifeSync Public Profile
            </div>
            <h1 className="text-4xl font-bold mb-2">{profile.displayName}</h1>
            {profile.position && (
              <p className="text-lg text-purple-100">{profile.position}</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Card */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left: Profile Info */}
                <div className="flex-1">
                  {/* Trust Seal */}
                  {profile.trustSeal && (
                    <div className="mb-6 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                      <span className="text-2xl">🏅</span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{profile.trustSeal.level} Verified</p>
                        <p className="text-xs text-gray-600">by LifeSync</p>
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-gray-700 mb-6 leading-relaxed">{profile.bio}</p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-4 mb-6">
                    {profile.publicInfo.email && profile.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <a href={`mailto:${profile.email}`} className="text-purple-600 hover:underline">
                          {profile.email}
                        </a>
                      </div>
                    )}

                    {profile.publicInfo.phone && profile.phone && (
                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <a href={`tel:${profile.phone}`} className="text-purple-600 hover:underline">
                          {profile.phone}
                        </a>
                      </div>
                    )}

                    {profile.publicInfo.organization && profile.organization && (
                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{profile.organization}</span>
                      </div>
                    )}

                    {profile.publicInfo.location && profile.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{copied ? 'Copied!' : 'Share Link'}</span>
                    </button>
                    <button
                      onClick={downloadVCard}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download vCard</span>
                    </button>
                  </div>
                </div>

                {/* Right: QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 border-2 border-gray-200 rounded-lg mb-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Scan to view full profile
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                This profile was created on <strong>LifeSync</strong>, the core platform powering the Sonny Network.
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                © 2025 LifeSync. All information shown here is publicly shared by the profile owner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfilePage;

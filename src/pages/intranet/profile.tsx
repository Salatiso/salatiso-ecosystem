'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { LocationSelector } from '@/components/profile/LocationSelector';
import { InlineLifeCVStatus } from '@/components/profile/InlineLifeCVStatus';
import contactsService from '@/services/ContactsService';

interface ProfilePicture {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
  isPrimary: boolean;
}

const ProfilePage: NextPage = () => {
  const { user } = useAuth();
  const [profilePictures, setProfilePictures] = useState<ProfilePicture[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [gpsConsentGiven, setGpsConsentGiven] = useState(false);
  const [creatingContactCard, setCreatingContactCard] = useState(false);
  const [locationData, setLocationData] = useState({
    address: 'Johannesburg, Gauteng, South Africa',
  });

  const profileData = {
    fullName: 'Salatiso Lonwabo Mdeni',
    email: 'salatiso@salatiso.com',
    phone: '084 652 9115',
    location: 'Johannesburg, Gauteng, South Africa',
    position: 'Founder & Social Entrepreneur',
    organization: 'Salatiso Ecosystem',
    title: 'OHS Specialist, Risk Management Expert, Author & Advocate',
    joinDate: 'January 2023',
    bio: 'A seasoned OHS and Risk Management expert with over two decades of experience across diverse industries. A passionate author, social entrepreneur, and staunch advocate for fathers\', boys\', and family rights.',
  };

  // Profile Completion Metrics
  const profileCompletion = {
    personal: { completed: 4, total: 5, percentage: 80 },
    professional: { completed: 3, total: 4, percentage: 75 },
    media: { completed: 0, total: 5, percentage: 0 },
    documents: { completed: 0, total: 3, percentage: 0 },
    overall: {
      completed: 7,
      total: 17,
      percentage: 41,
    },
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (profilePictures.length >= 5) {
      alert('Maximum 5 pictures allowed');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newPicture: ProfilePicture = {
          id: `pic-${Date.now()}-${Math.random()}`,
          url: imageUrl,
          name: file.name,
          uploadedAt: new Date().toLocaleDateString(),
          isPrimary: profilePictures.length === 0,
        };

        setProfilePictures((prev) => [...prev, newPicture]);
        setIsUploading(false);
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    });
  };

  const deletePicture = (id: string) => {
    setProfilePictures((prev) => {
      const filtered = prev.filter((pic) => pic.id !== id);
      // Make first picture primary if primary was deleted
      if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryPicture = (id: string) => {
    setProfilePictures((prev) =>
      prev.map((pic) => ({
        ...pic,
        isPrimary: pic.id === id,
      }))
    );
  };

  const exportProfile = () => {
    const profileExport = {
      personal: {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
      },
      professional: {
        position: profileData.position,
        organization: profileData.organization,
        title: profileData.title,
        joinDate: profileData.joinDate,
      },
      media: {
        pictures: profilePictures.map((p) => ({
          id: p.id,
          name: p.name,
          uploadedAt: p.uploadedAt,
          isPrimary: p.isPrimary,
        })),
      },
      completion: profileCompletion,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      platform: 'MNI-Intranet',
    };

    const dataStr = JSON.stringify(profileExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile-${profileData.fullName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    link.click();
  };

  const importProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        alert(`Profile imported successfully from ${data.platform}`);
        // Data would be processed and synced with LifeSync here
      } catch {
        alert('Invalid profile file format');
      }
    };
    reader.readAsText(file);
  };

  const createSelfContactCard = async () => {
    if (!user) {
      alert('❌ Error: User not authenticated. Please log in again.');
      return;
    }

    setCreatingContactCard(true);
    try {
      console.log('📇 Creating self-contact card from profile data...');

      // Extract name parts
      const [firstName, ...lastNameParts] = profileData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      // Create contact object from profile
      const selfContact = {
        firstName: firstName,
        lastName: lastName,
        emails: [profileData.email],
        phoneNumbers: [profileData.phone],
        addresses: [profileData.location],
        category: 'professional' as const,
        tags: ['self-profile', 'auto-generated'],
        notes: `Auto-generated self-contact card from profile.\n${profileData.bio}`,
        privacy: 'family' as const,
        // Sonny Network
        isHouseholdMember: true,
        isFamilyMember: true,
        sonnyRole: 'both' as const,
        // Professional info
        organization: profileData.organization,
        position: profileData.position,
        title: profileData.title
      };

      // Add to Firestore
      const contactId = await contactsService.addContact({
        ...selfContact,
        addedBy: user.id
      });

      console.log(`✅ Self-contact card created successfully (ID: ${contactId})`);
      alert(`✅ Self-contact card created!\n\nYour profile has been added to your contacts.\n\nYou can now:\n• Share your contact card with others\n• Edit it anytime from your Contacts page\n• Export it for use in other apps`);
    } catch (error) {
      console.error('❌ Error creating self-contact card:', error);
      alert(`❌ Failed to create self-contact card. Error: ${(error as Error).message}`);
    } finally {
      setCreatingContactCard(false);
    }
  };

  return (
    <>
      <Head>
        <title>My Profile - MNI Intranet</title>
        <meta name="description" content="Your comprehensive LifeCV profile" />
      </Head>

      <IntranetLayout title="My Profile & LifeCV">
        <div className="space-y-6">
          {/* Profile Header with Completion Status */}
          <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-blue rounded-lg shadow-sm border border-ubuntu-warm-200 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center border-2 border-white/30 overflow-hidden">
                  {profilePictures.find((p) => p.isPrimary) ? (
                    <img
                      src={profilePictures.find((p) => p.isPrimary)?.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-xs">Add Photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{profileData.fullName}</h1>
                  <p className="text-white/90 mt-1">{profileData.title}</p>
                  <p className="text-white/80 text-sm mt-2">
                    {profileData.organization} • {profileData.location}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-sm">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {profileData.email}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {profileData.phone}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowProfileCompletion(!showProfileCompletion)}
                className="px-4 py-2 bg-white text-ubuntu-purple font-medium rounded-lg hover:bg-white/90 transition-colors"
              >
                {profileCompletion.overall.percentage}% Complete
              </button>
            </div>
          </div>

          {/* Profile Completion Overview */}
          {showProfileCompletion && (
            <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
              <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4">Profile Completion Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Personal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-ubuntu-warm-900">Personal Info</p>
                    <span className="text-sm font-bold text-ubuntu-purple">
                      {profileCompletion.personal.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-ubuntu-warm-200 rounded-full h-2">
                    <div
                      className="bg-ubuntu-purple h-2 rounded-full transition-all"
                      style={{ width: `${profileCompletion.personal.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-ubuntu-warm-600 mt-1">
                    {profileCompletion.personal.completed}/{profileCompletion.personal.total} fields
                  </p>
                </div>

                {/* Professional */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-ubuntu-warm-900">Professional</p>
                    <span className="text-sm font-bold text-ubuntu-blue">
                      {profileCompletion.professional.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-ubuntu-warm-200 rounded-full h-2">
                    <div
                      className="bg-ubuntu-blue h-2 rounded-full transition-all"
                      style={{ width: `${profileCompletion.professional.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-ubuntu-warm-600 mt-1">
                    {profileCompletion.professional.completed}/{profileCompletion.professional.total}
                    fields
                  </p>
                </div>

                {/* Media */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-ubuntu-warm-900">Media</p>
                    <span className="text-sm font-bold text-ubuntu-green">
                      {profileCompletion.media.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-ubuntu-warm-200 rounded-full h-2">
                    <div
                      className="bg-ubuntu-green h-2 rounded-full transition-all"
                      style={{ width: `${profileCompletion.media.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-ubuntu-warm-600 mt-1">
                    {profileCompletion.media.completed}/{profileCompletion.media.total} pictures
                  </p>
                </div>

                {/* Documents */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-ubuntu-warm-900">Documents</p>
                    <span className="text-sm font-bold text-ubuntu-orange">
                      {profileCompletion.documents.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-ubuntu-warm-200 rounded-full h-2">
                    <div
                      className="bg-ubuntu-orange h-2 rounded-full transition-all"
                      style={{ width: `${profileCompletion.documents.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-ubuntu-warm-600 mt-1">
                    {profileCompletion.documents.completed}/{profileCompletion.documents.total} files
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LifeCV Status - Integrated */}
          <InlineLifeCVStatus
            compact={false}
            onOpenLifeSync={() => {
              window.open('https://lifesync-lifecv.web.app/', '_blank');
            }}
          />

          {/* Upload Instructions */}
          <div className="bg-ubuntu-warm-50 rounded-lg border border-ubuntu-warm-300 p-6">
            <h3 className="text-lg font-bold text-ubuntu-warm-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-ubuntu-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Profile Upload Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ubuntu-warm-700">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-ubuntu-blue text-white text-xs font-bold">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-medium">Upload Photos</p>
                  <p className="text-xs mt-1">Add up to 5 profile pictures (JPG, PNG)</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-ubuntu-blue text-white text-xs font-bold">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-medium">Export Profile</p>
                  <p className="text-xs mt-1">Download as JSON for LifeSync backup</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-ubuntu-blue text-white text-xs font-bold">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-medium">Sync with LifeSync</p>
                  <p className="text-xs mt-1">Import/update your comprehensive LifeCV there</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-ubuntu-purple"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">
                  Full Name
                </label>
                <p className="text-ubuntu-warm-900 font-medium">{profileData.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">Email</label>
                <p className="text-ubuntu-warm-900">{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">
                  Phone Number
                </label>
                <p className="text-ubuntu-warm-900">{profileData.phone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Location & GPS
                </label>
                <LocationSelector
                  initialLocation={locationData}
                  onLocationChange={setLocationData}
                  gpsConsentGiven={gpsConsentGiven}
                  onGPSConsentChange={setGpsConsentGiven}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">Bio</label>
                <p className="text-ubuntu-warm-700 text-sm leading-relaxed">{profileData.bio}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-ubuntu-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0a2 2 0 01-2 2H8a2 2 0 01-2-2m8 0H8m0 0V3m0 6h.01M9 15h6m-3 0v6"
                />
              </svg>
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">
                  Position
                </label>
                <p className="text-ubuntu-warm-900 font-medium">{profileData.position}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">
                  Organization
                </label>
                <p className="text-ubuntu-warm-900">{profileData.organization}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-1">Title</label>
                <p className="text-ubuntu-warm-900">{profileData.title}</p>
              </div>
            </div>
          </div>

          {/* Profile Pictures Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-ubuntu-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Profile Pictures
              </span>
              <span className="text-sm font-normal text-ubuntu-warm-600">
                {profilePictures.length}/5
              </span>
            </h2>

            {/* Picture Upload Area */}
            <div className="mb-6">
              <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-ubuntu-warm-300 rounded-lg cursor-pointer hover:border-ubuntu-purple hover:bg-ubuntu-warm-50 transition-colors group">
                <div className="text-center">
                  <svg
                    className="w-10 h-10 mx-auto text-ubuntu-warm-400 group-hover:text-ubuntu-purple transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-ubuntu-warm-900 font-medium mt-2">
                    {profilePictures.length >= 5
                      ? 'Maximum pictures reached'
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-ubuntu-warm-600">
                    PNG, JPG up to 10MB • Max 5 pictures
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePictureUpload}
                  disabled={profilePictures.length >= 5 || isUploading}
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-ubuntu-warm-900">Uploading...</span>
                    <span className="text-sm font-bold text-ubuntu-purple">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-ubuntu-warm-200 rounded-full h-2">
                    <div
                      className="bg-ubuntu-purple h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Pictures Grid */}
            {profilePictures.length > 0 && (
              <div>
                <h3 className="font-semibold text-ubuntu-warm-900 mb-3">Uploaded Pictures</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {profilePictures.map((picture) => (
                    <div key={picture.id} className="relative group">
                      <div className="relative w-full aspect-square bg-ubuntu-warm-100 rounded-lg overflow-hidden border-2 border-ubuntu-warm-200 hover:border-ubuntu-purple transition-colors">
                        <img
                          src={picture.url}
                          alt={picture.name}
                          className="w-full h-full object-cover"
                        />
                        {picture.isPrimary && (
                          <div className="absolute top-1 right-1 bg-ubuntu-purple text-white text-xs font-bold px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          onClick={() => setPrimaryPicture(picture.id)}
                          className={`p-2 rounded-full transition-colors ${
                            picture.isPrimary
                              ? 'bg-ubuntu-purple text-white'
                              : 'bg-white text-ubuntu-warm-900 hover:bg-ubuntu-purple hover:text-white'
                          }`}
                          title="Set as primary"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deletePicture(picture.id)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                          title="Delete picture"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-ubuntu-warm-600 mt-1 truncate">{picture.name}</p>
                      <p className="text-xs text-ubuntu-warm-500">{picture.uploadedAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile File Management */}
          <div className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 p-6">
            <h2 className="text-xl font-bold text-ubuntu-warm-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-ubuntu-orange"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Profile File Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Export Profile */}
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">Export Profile</h3>
                <p className="text-sm text-ubuntu-warm-600 mb-4">
                  Download your profile as JSON for backup and synchronization with LifeSync
                </p>
                <button
                  onClick={exportProfile}
                  className="w-full px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange/90 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export Profile
                </button>
              </div>

              {/* Import Profile */}
              <div className="border border-ubuntu-warm-200 rounded-lg p-4">
                <h3 className="font-semibold text-ubuntu-warm-900 mb-2">Import Profile</h3>
                <p className="text-sm text-ubuntu-warm-600 mb-4">
                  Upload a previously exported profile JSON file
                </p>
                <label className="w-full">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importProfile}
                    className="hidden"
                  />
                  <button className="w-full px-4 py-2 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue/90 transition-colors flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Import Profile
                  </button>
                </label>
              </div>

              {/* Create Self Contact Card */}
              <div className="border-2 border-indigo-300 bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">📇 Create Self Contact</h3>
                <p className="text-sm text-indigo-700 mb-4">
                  Generate a contact card from your profile. Share it with others in the system!
                </p>
                <button
                  onClick={createSelfContactCard}
                  disabled={creatingContactCard}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                >
                  {creatingContactCard ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create Self Contact
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* LifeSync Integration Notice */}
          <div className="bg-gradient-to-r from-ubuntu-blue/10 to-ubuntu-purple/10 rounded-lg border border-ubuntu-blue/30 p-6">
            <h3 className="text-lg font-bold text-ubuntu-warm-900 mb-2 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-ubuntu-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              LifeSync Integration
            </h3>
            <p className="text-ubuntu-warm-700 mb-3">
              Your profile here is designed to work seamlessly with LifeSync. Export your profile to back it up or
              import it from LifeSync for synchronization. Use LifeSync as your comprehensive LifeCV home base.
            </p>
            <p className="text-sm text-ubuntu-warm-600">
              <strong>Next Steps:</strong> Export your profile, then import it into LifeSync to view and manage your
              complete LifeCV with detailed career history, education, and comprehensive life achievements.
            </p>
          </div>
        </div>
      </IntranetLayout>
    </>
  );
};

export default ProfilePage;
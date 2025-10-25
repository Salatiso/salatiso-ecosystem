import React, { useState } from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import ProfileUploader from '@/components/profile/ProfileUploader';
import { uploadProfilePicture, uploadProfilePictureFromWebcam } from '@/config/storage';
import {
  User,
  Bell,
  Globe,
  Shield,
  Palette,
  Trophy,
  Camera,
  Save,
  Upload,
  Calendar
} from 'lucide-react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect, AccessibleCheckbox } from '@/components/accessibility';

const SettingsPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const {
    isSupported,
    permission,
    isEnabled,
    requestPermission,
    enableNotifications,
    disableNotifications,
    sendTestNotification
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications' | 'language' | 'gamification'>('profile');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  // Local state for form fields
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        displayName,
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const photoURL = await uploadProfilePicture(file);
      await updateUserProfile({ photoURL });
      setSuccessMessage('Profile picture updated successfully!');
      setShowUploader(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleWebcamCapture = async (imageSrc: string) => {
    try {
      const photoURL = await uploadProfilePictureFromWebcam(imageSrc);
      await updateUserProfile({ photoURL });
      setSuccessMessage('Profile picture updated successfully!');
      setShowUploader(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw error;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'gamification', label: 'Gamification', icon: Trophy },
  ];

  return (
    <IntranetLayout title="Settings">
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile, preferences, and privacy settings
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Update your personal information and how others see you in the family intranet.
                    </p>
                  </div>

                  {/* Profile Picture */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'Profile'}
                            className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-gray-200">
                            <User className="h-12 w-12 text-primary-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{user?.displayName || 'Family Member'}</h3>
                        <p className="text-sm text-gray-600 mb-2">{user?.email}</p>
                        <button 
                          onClick={() => setShowUploader(!showUploader)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                        >
                          <Camera className="h-4 w-4" />
                          <span>{showUploader ? 'Close uploader' : 'Change photo'}</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                    </div>

                    {/* Profile Uploader */}
                    {showUploader && (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <ProfileUploader
                          currentPhotoURL={user?.photoURL}
                          onUpload={handlePhotoUpload}
                          onWebcamCapture={handleWebcamCapture}
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <AccessibleInput
                      label="Display Name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />

                    <AccessibleTextarea
                      label="Bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell your family about yourself..."
                      hint="Brief description for your profile. Maximum 500 characters."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AccessibleInput
                        label="Phone Number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+27 XX XXX XXXX"
                      />

                      <AccessibleInput
                        label="Location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Cape Town, South Africa"
                      />
                    </div>

                    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Important Dates
                      </h3>
                      
                      <AccessibleInput
                        label="Date of Birth"
                        type="date"
                        value={user?.birthday || ''}
                        onChange={async (e) => {
                          try {
                            await updateUserProfile({ birthday: e.target.value });
                          } catch (error) {
                            console.error('Error updating birthday:', error);
                          }
                        }}
                        hint="Your full birth date for family records and celebrations"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Anniversaries
                        </label>
                        <div className="space-y-2">
                          {user?.anniversaries?.map((anniversary, index) => (
                            <div key={anniversary.id} className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={anniversary.name}
                                placeholder="e.g., Wedding Anniversary"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                onChange={(e) => {
                                  const updated = [...(user.anniversaries || [])];
                                  updated[index] = { ...anniversary, name: e.target.value };
                                  updateUserProfile({ anniversaries: updated });
                                }}
                              />
                              <input
                                type="date"
                                value={anniversary.date}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                onChange={(e) => {
                                  const updated = [...(user.anniversaries || [])];
                                  updated[index] = { ...anniversary, date: e.target.value };
                                  updateUserProfile({ anniversaries: updated });
                                }}
                              />
                            </div>
                          ))}
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="e.g., Wedding Anniversary"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              onChange={(e) => {
                                const newAnniversary = {
                                  id: Date.now().toString(),
                                  name: e.target.value,
                                  date: '',
                                  createdAt: new Date()
                                };
                                updateUserProfile({
                                  anniversaries: [...(user?.anniversaries || []), newAnniversary]
                                });
                              }}
                            />
                            <input
                              type="date"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              onChange={(e) => {
                                const newAnniversary = {
                                  id: Date.now().toString(),
                                  name: '',
                                  date: e.target.value,
                                  createdAt: new Date()
                                };
                                updateUserProfile({
                                  anniversaries: [...(user?.anniversaries || []), newAnniversary]
                                });
                              }}
                            />
                          </div>
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            + Add Another Anniversary
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role in Family
                      </label>
                      <input
                        type="text"
                        value={user?.role || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        placeholder="Your role"
                      />
                      <p className="text-xs text-gray-500 mt-1">Contact an admin to change your role.</p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Privacy Settings
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Control what information is visible to other family members.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AccessibleCheckbox
                      label="Show profile to family"
                      hint="Allow family members to see your profile"
                      defaultChecked
                    />

                    <AccessibleCheckbox
                      label="Show contact information"
                      hint="Display your phone and email to family"
                      defaultChecked
                    />

                    <AccessibleCheckbox
                      label="Show activity status"
                      hint="Let others see when you're online"
                      defaultChecked
                    />

                    <AccessibleCheckbox
                      label="Share achievements"
                      hint="Show your badges and accomplishments"
                      defaultChecked
                    />
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Choose how you want to be notified about family updates.
                    </p>
                  </div>

                  {/* Push Notifications Section */}
                  {isSupported && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">Push Notifications</h3>
                          <p className="text-sm text-gray-600">
                            Receive instant notifications in your browser
                            {permission === 'denied' && (
                              <span className="text-red-600 ml-1">(Permission denied - check browser settings)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={async (e) => {
                              try {
                                if (e.target.checked) {
                                  await enableNotifications();
                                } else {
                                  await disableNotifications();
                                }
                              } catch (error) {
                                console.error('Error updating push notifications:', error);
                              }
                            }}
                            className="h-5 w-5 text-primary-600"
                          />
                          {isEnabled && (
                            <button
                              onClick={async () => {
                                try {
                                  await sendTestNotification();
                                } catch (error) {
                                  console.error('Error sending test notification:', error);
                                }
                              }}
                              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                            >
                              Test
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <AccessibleCheckbox
                      label="Email notifications"
                      hint="Receive updates via email"
                      checked={user?.preferences?.notifications?.email ?? true}
                      onChange={async (e) => {
                        try {
                          await updateUserProfile({
                            preferences: {
                              theme: user?.preferences?.theme ?? 'light',
                              language: user?.preferences?.language ?? 'en',
                              notifications: {
                                email: e.target.checked,
                                push: user?.preferences?.notifications?.push ?? false,
                                projectUpdates: user?.preferences?.notifications?.projectUpdates ?? true,
                                careerMilestones: user?.preferences?.notifications?.careerMilestones ?? true,
                                familyAnnouncements: user?.preferences?.notifications?.familyAnnouncements ?? true,
                              },
                              dashboardLayout: user?.preferences?.dashboardLayout ?? [],
                              gamificationEnabled: user?.preferences?.gamificationEnabled ?? true,
                            },
                          });
                        } catch (error) {
                          console.error('Error updating email notifications:', error);
                        }
                      }}
                    />

                    <AccessibleCheckbox
                      label="Project updates"
                      hint="Get notified about project changes"
                      checked={user?.preferences?.notifications?.projectUpdates ?? true}
                      onChange={async (e) => {
                        try {
                          await updateUserProfile({
                            preferences: {
                              theme: user?.preferences?.theme ?? 'light',
                              language: user?.preferences?.language ?? 'en',
                              notifications: {
                                email: user?.preferences?.notifications?.email ?? true,
                                push: user?.preferences?.notifications?.push ?? false,
                                projectUpdates: e.target.checked,
                                careerMilestones: user?.preferences?.notifications?.careerMilestones ?? true,
                                familyAnnouncements: user?.preferences?.notifications?.familyAnnouncements ?? true,
                              },
                              dashboardLayout: user?.preferences?.dashboardLayout ?? [],
                              gamificationEnabled: user?.preferences?.gamificationEnabled ?? true,
                            },
                          });
                        } catch (error) {
                          console.error('Error updating project notifications:', error);
                        }
                      }}
                    />

                    <AccessibleCheckbox
                      label="Family announcements"
                      hint="Important family news and updates"
                      checked={user?.preferences?.notifications?.familyAnnouncements ?? true}
                      onChange={async (e) => {
                        try {
                          await updateUserProfile({
                            preferences: {
                              theme: user?.preferences?.theme ?? 'light',
                              language: user?.preferences?.language ?? 'en',
                              notifications: {
                                email: user?.preferences?.notifications?.email ?? true,
                                push: user?.preferences?.notifications?.push ?? false,
                                projectUpdates: user?.preferences?.notifications?.projectUpdates ?? true,
                                careerMilestones: user?.preferences?.notifications?.careerMilestones ?? true,
                                familyAnnouncements: e.target.checked,
                              },
                              dashboardLayout: user?.preferences?.dashboardLayout ?? [],
                              gamificationEnabled: user?.preferences?.gamificationEnabled ?? true,
                            },
                          });
                        } catch (error) {
                          console.error('Error updating family notifications:', error);
                        }
                      }}
                    />

                    <AccessibleCheckbox
                      label="Achievement alerts"
                      hint="When you earn new badges or level up"
                      checked={user?.preferences?.notifications?.careerMilestones ?? true}
                      onChange={async (e) => {
                        try {
                          await updateUserProfile({
                            preferences: {
                              theme: user?.preferences?.theme ?? 'light',
                              language: user?.preferences?.language ?? 'en',
                              notifications: {
                                email: user?.preferences?.notifications?.email ?? true,
                                push: user?.preferences?.notifications?.push ?? false,
                                projectUpdates: user?.preferences?.notifications?.projectUpdates ?? true,
                                careerMilestones: e.target.checked,
                                familyAnnouncements: user?.preferences?.notifications?.familyAnnouncements ?? true,
                              },
                              dashboardLayout: user?.preferences?.dashboardLayout ?? [],
                              gamificationEnabled: user?.preferences?.gamificationEnabled ?? true,
                            },
                          });
                        } catch (error) {
                          console.error('Error updating achievement notifications:', error);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Language Tab */}
              {activeTab === 'language' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Language & Region
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Customize your language preferences and regional settings.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AccessibleSelect
                      label="Preferred Language"
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'af', label: 'Afrikaans' },
                        { value: 'zu', label: 'isiZulu' },
                        { value: 'xh', label: 'isiXhosa' },
                        { value: 'st', label: 'Sesotho' },
                        { value: 'tn', label: 'Setswana' },
                        { value: 'nso', label: 'Sepedi' },
                        { value: 'ts', label: 'Xitsonga' },
                        { value: 'ss', label: 'siSwati' },
                        { value: 've', label: 'Tshivenda' },
                        { value: 'nr', label: 'isiNdebele' },
                        { value: 'fr', label: 'Français (French)' },
                        { value: 'pt', label: 'Português (Portuguese)' },
                        { value: 'sn', label: 'Shona' },
                        { value: 'sw', label: 'Kiswahili (Swahili)' },
                      ]}
                    />

                    <AccessibleSelect
                      label="Time Zone"
                      options={[
                        { value: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST)' },
                        { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
                        { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
                      ]}
                    />

                    <AccessibleSelect
                      label="Date Format"
                      options={[
                        { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
                        { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
                        { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Gamification Tab */}
              {activeTab === 'gamification' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Gamification Settings
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Manage how you experience achievements, levels, and family competitions.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AccessibleCheckbox
                      label="Enable gamification"
                      hint="Show XP, levels, and achievements"
                      defaultChecked
                    />

                    <AccessibleCheckbox
                      label="Show on leaderboard"
                      hint="Display your rank to family members"
                      defaultChecked
                    />

                    <AccessibleCheckbox
                      label="Streak reminders"
                      hint="Get reminded to maintain your streaks"
                      defaultChecked
                    />
                  </div>

                  {/* Current Stats */}
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <h3 className="font-semibold text-primary-900 mb-3">Your Current Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary-700">{user?.gamification?.level || 1}</div>
                        <div className="text-sm text-primary-600">Current Level</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-700">{user?.gamification?.experiencePoints || 0}</div>
                        <div className="text-sm text-primary-600">Total XP</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-700">{user?.gamification?.badges?.length || 0}</div>
                        <div className="text-sm text-primary-600">Badges Earned</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-700">{user?.gamification?.streaks?.length || 0}</div>
                        <div className="text-sm text-primary-600">Active Streaks</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default SettingsPage;

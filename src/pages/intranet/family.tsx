import React, { useState, useEffect } from 'react';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar, Award, TrendingUp, MapPin, Heart, Star, Plus, Filter, Search, Edit, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EditMemberModal from '@/components/family/EditMemberModal';
import { PrintExportButtons } from '@/components/common/PrintExport';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { useRelationshipSync } from '@/hooks/useRelationshipSync';
import { Contact } from '@/services/ContactsService';

interface FamilyMember extends Contact {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  role?: string;
  level?: number;
  experiencePoints?: number;
  responsibilities?: string[];
  achievements?: string[];
  careerPath?: string;
  specializations?: string[];
  trustRating?: number;
  joinDate?: string;
  profileImage?: string;
}

const FamilyMembers: React.FC = () => {
  const { user } = useAuth();
  const { members: firebaseMembers, loading, error, updateMember } = useFamilyMembers();
  const { addListener, removeListener } = useRelationshipSync();
  
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (firebaseMembers?.length > 0) {
      const enhancedMembers: FamilyMember[] = firebaseMembers.map(contact => ({
        ...contact,
        role: contact.tags?.join(', ') || 'Family Member',
        level: 5,
        experiencePoints: 1000,
        responsibilities: [],
        achievements: [],
        careerPath: 'Family',
        specializations: contact.tags || [],
        trustRating: 85,
        joinDate: contact.createdAt?.toISOString()?.split('T')[0],
      }));
      setMembers(enhancedMembers);
    }
  }, [firebaseMembers]);

  useEffect(() => {
    const listenerId = addListener((event) => {
      if (event.type === 'contact_updated' && event.data?.contact) {
        setMembers(prev =>
          prev.map(m =>
            m.id === event.data.contact?.id ? { ...m, ...event.data.contact } : m
          )
        );
      } else if (event.type === 'contact_added' && event.data?.contact) {
        setMembers(prev => [...prev, event.data.contact as FamilyMember]);
      } else if (event.type === 'contact_deleted' && event.data?.contact) {
        setMembers(prev => prev.filter(m => m.id !== event.data.contact?.id));
      }
    });

    return () => removeListener(listenerId);
  }, [addListener, removeListener]);

  if (loading) {
    return (
      <IntranetLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin mx-auto text-blue-500" />
            <p className="text-gray-600">Loading family members...</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  if (error) {
    return (
      <IntranetLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
            <p className="text-red-600 font-semibold">Error loading family members</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  const filteredMembers = members.filter((member: FamilyMember) => {
    const matchesRole = filterRole === 'all' || member.role?.toLowerCase().includes(filterRole.toLowerCase());
    const matchesSearch = 
      member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleEditMember = async (updates: Partial<FamilyMember>) => {
    if (!editingMember) return;
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === editingMember.id ? { ...member, ...updates } : member
      )
    );
    try {
      await updateMember(editingMember.id, updates);
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to update member:', err);
    }
  };

  const canEditMember = (member: FamilyMember) => {
    return user?.email === member.emails?.[0] || user?.email === 'spiceinc@gmail.com';
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      developing: 'bg-blue-100 text-blue-800 border-blue-200',
      transitioning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      emeritus: 'bg-purple-100 text-purple-800 border-purple-200',
      deceased: 'bg-gray-100 text-gray-800 border-gray-200',
      unknown: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTrustRatingColor = (rating: number) => {
    if (rating >= 95) return 'text-green-600';
    if (rating >= 90) return 'text-blue-600';
    if (rating >= 85) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleImportMembers = (importedData: any) => {
    if (importedData.members?.length > 0) {
      setMembers(importedData.members);
    }
  };

  return (
    <IntranetLayout title="Family Members">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-8 w-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-gray-900">Family Members Directory</h1>
              </div>
              <p className="text-gray-600">Mlandeli family leadership, roles, and development tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <PrintExportButtons 
                data={{ members, exportDate: new Date().toISOString() }}
                filename="family-members"
                onImport={handleImportMembers}
              />
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search family members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="founder">Founder</option>
              <option value="lead">Leadership</option>
              <option value="future">Future Leaders</option>
              <option value="developing">Developing</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Total Members</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{members.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Average Level</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {members.length > 0 ? Math.round(members.reduce((sum: number, m: FamilyMember) => sum + (m.level || 0), 0) / members.length) : 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-600">Trust Rating</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {members.length > 0 ? Math.round(members.reduce((sum: number, m: FamilyMember) => sum + (m.trustRating || 0), 0) / members.length) : 0}%
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Developing</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {members.filter((m: FamilyMember) => m.status === 'developing').length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              whileHover={{ y: -2 }}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {member.firstName?.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {member.name || `${member.firstName} ${member.lastName}`}
                    </h3>
                    <p className="text-primary-600 font-medium text-sm mb-2">{member.role}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                      <Star className={`h-3 w-3 ${getTrustRatingColor(member.trustRating || 85)}`} />
                    </div>
                  </div>
                  {canEditMember(member) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMember(member);
                      }}
                      className="p-1 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Level {member.level || 5}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">{member.experiencePoints || 1000} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Age {member.dateOfBirth ? calculateAge(member.dateOfBirth) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-600">{member.location?.split(',')[0] || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {selectedMember === member.id && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {member.bio && <p className="text-gray-600 text-sm mb-6 leading-relaxed">{member.bio}</p>}

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      {member.emails?.[0] && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{member.emails[0]}</span>
                        </div>
                      )}
                      {member.phoneNumbers?.[0] && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{member.phoneNumbers[0]}</span>
                        </div>
                      )}
                      {member.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{member.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {member.responsibilities?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Responsibilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.responsibilities.map((r, i) => (
                          <span key={i} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.achievements?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Achievements</h4>
                      <ul className="space-y-2">
                        {member.achievements.map((a, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Award className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {member.specializations?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specializations.map((s, i) => (
                          <span key={i} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {editingMember && (
          <EditMemberModal
            member={editingMember as any}
            isOpen={true}
            onClose={() => setEditingMember(null)}
            onSave={(updates) => handleEditMember(updates as any)}
          />
        )}
      </div>
    </IntranetLayout>
  );
};

export default FamilyMembers;

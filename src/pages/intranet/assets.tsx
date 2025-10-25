import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Download,
  Upload,
  Home,
  Car,
  DollarSign,
  FileText,
  Zap,
  Edit,
  Trash2,
  Eye,
  Share2,
  TrendingUp,
  Calendar,
  MapPin,
  AlertCircle,
  User,
  X,
  Loader,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import toast from 'react-hot-toast';
import { realAssets, realLiabilities, financialSummary } from '@/data/realFinancialData';
import { Asset as FinancialAsset, Liability as FinancialLiability } from '@/types/financial';
import assetService from '@/services/AssetService';

// Use the proper types from financial.ts
type Asset = FinancialAsset;
type Liability = FinancialLiability;

const AssetsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const [useRealData, setUseRealData] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [showAddLiabilityForm, setShowAddLiabilityForm] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editingLiabilityId, setEditingLiabilityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assetFormData, setAssetFormData] = useState<Partial<Asset>>({
    name: '',
    category: 'other',
    description: '',
    value: 0,
    currency: 'ZAR',
    owner: '',
    location: '',
    ownershipType: 'personal',
    useClassification: 'personal-use',
  });
  const [liabilityFormData, setLiabilityFormData] = useState<Partial<Liability>>({
    name: '',
    category: 'other',
    description: '',
    amount: 0,
    currency: 'ZAR',
    owner: '',
    monthlyPayment: 0,
  });

  const assetCategories = [
    { id: 'property', name: 'Property', icon: Home },
    { id: 'vehicle', name: 'Vehicle', icon: Car },
    { id: 'equipment', name: 'Equipment', icon: Zap },
    { id: 'tools', name: 'Tools', icon: Zap },
    { id: 'cash', name: 'Cash', icon: DollarSign },
    { id: 'investment', name: 'Investment', icon: TrendingUp },
    { id: 'ip', name: 'Intellectual Property', icon: FileText },
    { id: 'document', name: 'Document', icon: FileText },
    { id: 'other', name: 'Other', icon: Home },
  ];

  const liabilityCategories = [
    { id: 'mortgage', name: 'Mortgage', color: 'bg-red-100 text-red-800' },
    { id: 'loan', name: 'Loan', color: 'bg-orange-100 text-orange-800' },
    { id: 'credit', name: 'Credit', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'tax', name: 'Tax', color: 'bg-pink-100 text-pink-800' },
    { id: 'service', name: 'Service', color: 'bg-purple-100 text-purple-800' },
    { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' },
  ];

  // Real-time Firestore sync for assets
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Subscribe to real-time asset updates
      const unsubscribe = assetService.subscribeToUserAssets(
        user.id,
        (firestoreAssets) => {
          // Convert firestore assets to financial asset format for compatibility
          const convertedAssets: Asset[] = firestoreAssets.map((a: any) => ({
            id: a.id,
            name: a.name,
            category: a.category,
            description: a.description,
            value: a.currentValue,
            currency: a.currency,
            owner: a.owner?.displayName || user.email || 'Unknown',
            location: a.location,
            ownershipType: a.ownershipType || 'personal',
            useClassification: a.useClassification || 'personal-use',
            primaryUser: a.owner?.userId,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
          }));
          
          setAssets(convertedAssets.length > 0 ? convertedAssets : realAssets);
          setLoading(false);
        },
        (error) => {
          console.error('Firestore sync error:', error);
          // Fallback to real data
          setAssets(realAssets);
          setLoading(false);
          toast.error('Real-time sync unavailable - using cached data');
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Asset setup error:', error);
      setAssets(realAssets);
      setLoading(false);
    }
  }, [user?.id]);

  // Initialize liabilities
  useEffect(() => {
    if (useRealData && liabilities.length === 0) {
      setLiabilities(realLiabilities);
    }
  }, [useRealData]);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  // Asset handlers
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assetFormData.name?.trim()) {
      toast.error('Asset name is required');
      return;
    }
    if (!assetFormData.value || assetFormData.value <= 0) {
      toast.error('Asset value must be greater than 0');
      return;
    }
    if (!assetFormData.owner?.trim()) {
      toast.error('Asset owner is required');
      return;
    }

    if (editingAssetId) {
      // Update existing asset
      setAssets(assets.map(a => 
        a.id === editingAssetId 
          ? {
              ...a,
              name: assetFormData.name || a.name,
              category: (assetFormData.category || a.category) as Asset['category'],
              description: assetFormData.description || a.description,
              value: assetFormData.value || a.value,
              location: assetFormData.location || a.location,
              ownershipType: (assetFormData.ownershipType || a.ownershipType) as Asset['ownershipType'],
              useClassification: (assetFormData.useClassification || a.useClassification) as Asset['useClassification'],
              primaryUser: assetFormData.primaryUser || a.primaryUser,
              owner: assetFormData.owner || a.owner,
              updatedAt: new Date().toISOString(),
            }
          : a
      ));
      toast.success('Asset updated successfully!');
      setEditingAssetId(null);
    } else {
      // Add new asset
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: assetFormData.name,
        category: (assetFormData.category || 'other') as Asset['category'],
        description: assetFormData.description || '',
        value: assetFormData.value,
        currency: 'ZAR',
        owner: assetFormData.owner,
        location: assetFormData.location,
        ownershipType: (assetFormData.ownershipType || 'personal') as Asset['ownershipType'],
        useClassification: (assetFormData.useClassification || 'personal-use') as Asset['useClassification'],
        primaryUser: assetFormData.primaryUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAssets([...assets, newAsset]);
      toast.success('Asset added successfully!');
    }

    setShowAddAssetForm(false);
    setAssetFormData({
      name: '',
      category: 'other',
      description: '',
      value: 0,
      currency: 'ZAR',
      owner: '',
      location: '',
      ownershipType: 'personal',
      useClassification: 'personal-use',
    });
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAssetId(asset.id);
    setAssetFormData(asset);
    setShowAddAssetForm(true);
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
      toast.success('Asset deleted');
    }
  };

  const handleDownloadJSON = () => {
    const data = { assets, liabilities, totalAssets, totalLiabilities, netWorth };
    const jsonText = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-summary-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Downloaded as JSON');
  };

  // Liability handlers
  const handleAddLiability = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!liabilityFormData.name?.trim()) {
      toast.error('Liability name is required');
      return;
    }
    if (!liabilityFormData.amount || liabilityFormData.amount <= 0) {
      toast.error('Liability amount must be greater than 0');
      return;
    }

    if (editingLiabilityId) {
      // Update existing liability
      setLiabilities(liabilities.map(l =>
        l.id === editingLiabilityId
          ? {
              ...l,
              name: liabilityFormData.name || l.name,
              category: (liabilityFormData.category || l.category) as Liability['category'],
              description: liabilityFormData.description || l.description,
              amount: liabilityFormData.amount || l.amount,
              owner: liabilityFormData.owner || l.owner,
              monthlyPayment: liabilityFormData.monthlyPayment || l.monthlyPayment,
              dueDate: liabilityFormData.dueDate || l.dueDate,
              interestRate: liabilityFormData.interestRate || l.interestRate,
              updatedAt: new Date().toISOString(),
            }
          : l
      ));
      toast.success('Liability updated successfully!');
      setEditingLiabilityId(null);
    } else {
      // Add new liability
      const newLiability: Liability = {
        id: Date.now().toString(),
        name: liabilityFormData.name,
        category: (liabilityFormData.category || 'other') as Liability['category'],
        description: liabilityFormData.description || '',
        amount: liabilityFormData.amount,
        currency: 'ZAR',
        owner: liabilityFormData.owner || user?.displayName || 'You',
        monthlyPayment: liabilityFormData.monthlyPayment || 0,
        dueDate: liabilityFormData.dueDate,
        interestRate: liabilityFormData.interestRate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLiabilities([...liabilities, newLiability]);
      toast.success('Liability added successfully!');
    }

    setShowAddLiabilityForm(false);
    setLiabilityFormData({
      name: '',
      category: 'other',
      description: '',
      amount: 0,
      currency: 'ZAR',
      owner: '',
      monthlyPayment: 0,
    });
  };

  const handleEditLiability = (liability: Liability) => {
    setEditingLiabilityId(liability.id);
    setLiabilityFormData(liability);
    setShowAddLiabilityForm(true);
  };

  const handleDeleteLiability = (id: string) => {
    if (window.confirm('Delete this liability?')) {
      setLiabilities(liabilities.filter(l => l.id !== id));
      toast.success('Liability deleted');
    }
  };

  const getLiabilityCategoryColor = (categoryId: string) => {
    const cat = liabilityCategories.find(c => c.id === categoryId);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const getAssetCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      property: 'bg-blue-100 text-blue-800',
      vehicle: 'bg-orange-100 text-orange-800',
      equipment: 'bg-purple-100 text-purple-800',
      cash: 'bg-green-100 text-green-800',
      investment: 'bg-indigo-100 text-indigo-800',
      ip: 'bg-pink-100 text-pink-800',
      document: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <IntranetLayout title="My Assets & Liabilities">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <Loader className="w-12 h-12 animate-spin mx-auto text-ubuntu-purple" />
            <p className="text-gray-600">Loading your assets...</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  return (
    <IntranetLayout title="My Assets & Liabilities">
      <div className="min-h-screen bg-gradient-to-br from-ubuntu-warm-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Net Worth Summary */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-semibold">Total Assets</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">R {totalAssets.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-semibold">Total Liabilities</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">R {totalLiabilities.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </div>

            <div className={`bg-gradient-to-br rounded-lg p-6 border-2 ${
              netWorth >= 0 
                ? 'from-blue-50 to-blue-100 border-blue-200' 
                : 'from-orange-50 to-orange-100 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${netWorth >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    Net Worth
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${netWorth >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                    R {netWorth.toLocaleString()}
                  </p>
                </div>
                <DollarSign className={`w-8 h-8 opacity-50 ${netWorth >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-ubuntu-warm-900 flex items-center gap-3">
                <Home className="w-8 h-8 text-ubuntu-purple" />
                {activeTab === 'assets' ? 'My Assets' : 'My Liabilities'}
              </h1>
            </div>

            <div className="flex gap-4 border-b-2 border-ubuntu-warm-200 mb-6">
              <button
                onClick={() => setActiveTab('assets')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'assets'
                    ? 'text-ubuntu-purple border-ubuntu-purple'
                    : 'text-ubuntu-warm-600 border-transparent hover:text-ubuntu-warm-900'
                }`}
              >
                Assets ({assets.length})
              </button>
              <button
                onClick={() => setActiveTab('liabilities')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'liabilities'
                    ? 'text-ubuntu-purple border-ubuntu-purple'
                    : 'text-ubuntu-warm-600 border-transparent hover:text-ubuntu-warm-900'
                }`}
              >
                Liabilities ({liabilities.length})
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2">
              {activeTab === 'assets' ? (
                <>
                  <button
                    onClick={() => setShowAddAssetForm(true)}
                    className="bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Asset
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className="bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAddLiabilityForm(true)}
                  className="bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Liability
                </button>
              )}
            </div>
          </motion.div>

          {/* Assets Grid */}
          {activeTab === 'assets' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {assets.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Home className="w-16 h-16 text-ubuntu-warm-200 mx-auto mb-4" />
                  <p className="text-ubuntu-warm-600 text-lg">No assets yet. Add one to get started!</p>
                </div>
              ) : (
                assets.map(asset => (
                  <motion.div
                    key={asset.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-ubuntu-warm-900">{asset.name}</h3>
                          <p className="text-sm text-ubuntu-warm-600 mt-1">{asset.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAssetCategoryColor(asset.category)}`}>
                          {asset.category}
                        </span>
                      </div>

                      <div className="mb-4 p-3 bg-ubuntu-warm-50 rounded-lg">
                        <div className="text-xs text-ubuntu-warm-600">Current Value</div>
                        <div className="text-xl font-bold text-ubuntu-warm-900">
                          R {asset.value.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        {asset.location && (
                          <div className="flex items-center gap-2 text-ubuntu-warm-700">
                            <MapPin className="w-4 h-4" />
                            {asset.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-ubuntu-warm-700">
                          <FileText className="w-4 h-4" />
                          Owner: {asset.owner}
                        </div>
                        {asset.primaryUser && (
                          <div className="flex items-center gap-2 text-ubuntu-warm-700">
                            <User className="w-4 h-4" />
                            Primary User: {asset.primaryUser}
                          </div>
                        )}
                      </div>

                      {/* Ownership & Use Classification */}
                      <div className="mb-4 p-3 bg-ubuntu-warm-50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ubuntu-warm-600">Ownership:</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                            {asset.ownershipType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ubuntu-warm-600">Use:</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium capitalize">
                            {asset.useClassification.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {asset.shared && (
                        <div className="mb-4 p-2 bg-ubuntu-purple-light rounded-lg flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-ubuntu-purple" />
                          <span className="text-xs text-ubuntu-purple font-medium">Shared with family</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-ubuntu-warm-100">
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Liabilities Grid */}
          {activeTab === 'liabilities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {liabilities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <AlertCircle className="w-16 h-16 text-ubuntu-warm-200 mx-auto mb-4" />
                  <p className="text-ubuntu-warm-600 text-lg">No liabilities recorded. Add one to track obligations.</p>
                </div>
              ) : (
                liabilities.map(liability => (
                  <motion.div
                    key={liability.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-ubuntu-warm-900">{liability.name}</h3>
                          <p className="text-sm text-ubuntu-warm-600 mt-1">{liability.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLiabilityCategoryColor(liability.category)}`}>
                          {liability.category}
                        </span>
                      </div>

                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <div className="text-xs text-red-600">Outstanding Amount</div>
                        <div className="text-xl font-bold text-red-900">
                          R {liability.amount.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        {liability.monthlyPayment && (
                          <div className="flex items-center gap-2 text-ubuntu-warm-700">
                            <DollarSign className="w-4 h-4" />
                            Monthly: R {liability.monthlyPayment.toLocaleString()}
                          </div>
                        )}
                        {liability.dueDate && (
                          <div className="flex items-center gap-2 text-ubuntu-warm-700">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(liability.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-ubuntu-warm-100">
                        <button
                          onClick={() => handleEditLiability(liability)}
                          className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLiability(liability.id)}
                          className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>

        {/* Add Asset Modal */}
        {showAddAssetForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-ubuntu-purple to-ubuntu-purple-dark text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingAssetId ? `Update Asset - ${assetFormData.name || 'Asset'}` : 'Add New Asset'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddAssetForm(false);
                    setEditingAssetId(null);
                    setAssetFormData({
                      name: '',
                      category: 'other',
                      description: '',
                      value: 0,
                      currency: 'ZAR',
                      owner: '',
                      location: '',
                      ownershipType: 'personal',
                      useClassification: 'personal-use',
                    });
                  }}
                  className="hover:text-ubuntu-warm-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddAsset} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={assetFormData.name || ''}
                    onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                    placeholder="e.g., Family Home, Tesla Model 3"
                    className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Category *
                    </label>
                    <select
                      value={assetFormData.category || 'other'}
                      onChange={(e) => setAssetFormData({ ...assetFormData, category: e.target.value as any })}
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    >
                      {assetCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Value (ZAR) *
                    </label>
                    <input
                      type="number"
                      value={assetFormData.value || ''}
                      onChange={(e) => setAssetFormData({ ...assetFormData, value: parseFloat(e.target.value) })}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                      step="1000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Owner *
                    </label>
                    <input
                      type="text"
                      value={assetFormData.owner || ''}
                      onChange={(e) => setAssetFormData({ ...assetFormData, owner: e.target.value })}
                      placeholder="e.g., Mlandeli Notemba"
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={assetFormData.location || ''}
                      onChange={(e) => setAssetFormData({ ...assetFormData, location: e.target.value })}
                      placeholder="e.g., Johannesburg"
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={assetFormData.description || ''}
                    onChange={(e) => setAssetFormData({ ...assetFormData, description: e.target.value })}
                    placeholder="Add notes about this asset..."
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors resize-none"
                  />
                </div>

                {/* NEW: Ownership & Use Classification */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="text-sm font-bold text-blue-900 mb-4">Classification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                        Ownership Type *
                      </label>
                      <select
                        value={assetFormData.ownershipType || 'personal'}
                        onChange={(e) => setAssetFormData({ ...assetFormData, ownershipType: e.target.value as any })}
                        className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                      >
                        <option value="personal">Personal</option>
                        <option value="joint">Joint</option>
                        <option value="family">Family</option>
                        <option value="business">Business</option>
                        <option value="trust">Trust</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                        Use Classification *
                      </label>
                      <select
                        value={assetFormData.useClassification || 'personal-use'}
                        onChange={(e) => setAssetFormData({ ...assetFormData, useClassification: e.target.value as any })}
                        className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                      >
                        <option value="personal-use">Personal Use</option>
                        <option value="family-shared">Family Shared</option>
                        <option value="business">Business</option>
                        <option value="investment">Investment</option>
                        <option value="storage">Storage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Primary User
                    </label>
                    <input
                      type="text"
                      value={assetFormData.primaryUser || ''}
                      onChange={(e) => setAssetFormData({ ...assetFormData, primaryUser: e.target.value })}
                      placeholder="e.g., Mlandeli Notemba or Family"
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-ubuntu-warm-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAssetForm(false);
                      setEditingAssetId(null);
                      setAssetFormData({
                        name: '',
                        category: 'other',
                        description: '',
                        value: 0,
                        currency: 'ZAR',
                        owner: '',
                        location: '',
                        ownershipType: 'personal',
                        useClassification: 'personal-use',
                      });
                    }}
                    className="flex-1 py-3 px-4 bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {editingAssetId ? 'Update Asset' : 'Add Asset'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Add Liability Modal */}
        {showAddLiabilityForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-ubuntu-purple to-ubuntu-purple-dark text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingLiabilityId ? `Update Liability - ${liabilityFormData.name || 'Liability'}` : 'Add New Liability'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddLiabilityForm(false);
                    setEditingLiabilityId(null);
                    setLiabilityFormData({
                      name: '',
                      category: 'other',
                      amount: 0,
                      monthlyPayment: 0,
                      description: '',
                    });
                  }}
                  className="hover:text-ubuntu-warm-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddLiability} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                    Liability Name *
                  </label>
                  <input
                    type="text"
                    value={liabilityFormData.name || ''}
                    onChange={(e) => setLiabilityFormData({ ...liabilityFormData, name: e.target.value })}
                    placeholder="e.g., Home Mortgage, Car Loan"
                    className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Category *
                    </label>
                    <select
                      value={liabilityFormData.category || 'other'}
                      onChange={(e) => setLiabilityFormData({ ...liabilityFormData, category: e.target.value as any })}
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    >
                      {liabilityCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                      Amount (ZAR) *
                    </label>
                    <input
                      type="number"
                      value={liabilityFormData.amount || ''}
                      onChange={(e) => setLiabilityFormData({ ...liabilityFormData, amount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                      step="1000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                    Monthly Payment
                  </label>
                  <input
                    type="number"
                    value={liabilityFormData.monthlyPayment || ''}
                    onChange={(e) => setLiabilityFormData({ ...liabilityFormData, monthlyPayment: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors"
                    step="100"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ubuntu-warm-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={liabilityFormData.description || ''}
                    onChange={(e) => setLiabilityFormData({ ...liabilityFormData, description: e.target.value })}
                    placeholder="Add notes about this liability..."
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-ubuntu-warm-200 rounded-lg focus:outline-none focus:border-ubuntu-purple transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-ubuntu-warm-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddLiabilityForm(false);
                      setEditingLiabilityId(null);
                      setLiabilityFormData({
                        name: '',
                        category: 'other',
                        amount: 0,
                        monthlyPayment: 0,
                        description: '',
                      });
                    }}
                    className="flex-1 py-3 px-4 bg-ubuntu-warm-100 hover:bg-ubuntu-warm-200 text-ubuntu-warm-900 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-ubuntu-purple hover:bg-ubuntu-purple-dark text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {editingLiabilityId ? 'Update Liability' : 'Add Liability'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </IntranetLayout>
  );
};

export default AssetsPage;

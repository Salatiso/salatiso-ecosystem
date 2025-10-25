import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Query,
  DocumentData,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Asset Data Models
export interface AssetCoOwner {
  userId: string;
  displayName: string;
  email: string;
  role: 'owner' | 'co-owner' | 'manager' | 'viewer';
  joinedAt: string;
}

export interface AssetValuation {
  amount: number;
  currency: string;
  date: string;
  method: 'appraisal' | 'market' | 'cost' | 'estimate';
  appraiser?: string;
}

export interface AssetShare {
  id: string;
  sharedWith: string; // userId or familyId
  shareType: 'individual' | 'family';
  permissions: ('view' | 'edit' | 'manage' | 'share')[];
  sharedAt: string;
  sharedBy: string;
}

export interface AssetMaintenance {
  id: string;
  title: string;
  description: string;
  nextDueDate: string;
  lastCompletedDate?: string;
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'other';
  estimatedCost?: number;
  linkedContacts?: string[]; // Contact IDs (service providers)
  notes?: string;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: 'property' | 'vehicle' | 'equipment' | 'cash' | 'investment' | 'ip' | 'document' | 'other';
  
  // Basic Info
  location?: string;
  quantity?: number;
  serialNumber?: string;
  
  // Ownership
  owner: AssetCoOwner;
  coOwners: AssetCoOwner[];
  
  // Valuation
  currentValue: number;
  currency: string;
  valuationHistory: AssetValuation[];
  
  // Dates
  acquireDate?: string;
  disposalDate?: string;
  warranty?: {
    startDate: string;
    endDate: string;
    provider: string;
  };
  
  // Maintenance
  maintenance: AssetMaintenance[];
  maintenanceNextDue?: string;
  
  // Sharing & Access
  shares: AssetShare[];
  isShared: boolean;
  familyPooled?: boolean;
  
  // Financial
  purchasePrice?: number;
  depreciationRate?: number;
  taxableGains?: number;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  
  // Linked Data
  linkedContacts?: string[]; // Contact IDs (property manager, insurance agent, etc)
  linkedDocuments?: {
    name: string;
    url: string;
    type: string;
  }[];
  linkedCalendarEvents?: string[]; // Calendar event IDs
  
  // Tags & Classification
  tags: string[];
  status: 'active' | 'archived' | 'disposed';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Notes
  notes?: string;
}

export interface IAssetService {
  // CRUD Operations
  createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string>;
  getAsset(assetId: string, userId: string): Promise<Asset | null>;
  updateAsset(assetId: string, updates: Partial<Asset>): Promise<void>;
  deleteAsset(assetId: string, userId: string): Promise<void>;
  
  // Listing & Search
  getUserAssets(userId: string, category?: string): Promise<Asset[]>;
  searchAssets(userId: string, term: string): Promise<Asset[]>;
  getAssetsByCategory(userId: string, category: string): Promise<Asset[]>;
  getSharedAssets(userId: string): Promise<Asset[]>;
  getArchivedAssets(userId: string): Promise<Asset[]>;
  
  // Valuation
  addValuation(assetId: string, valuation: Omit<AssetValuation, 'date'>): Promise<void>;
  getValuationHistory(assetId: string): Promise<AssetValuation[]>;
  getCurrentValue(assetId: string): Promise<number>;
  
  // Sharing
  shareAsset(assetId: string, shareData: Omit<AssetShare, 'id' | 'sharedAt' | 'sharedBy'>): Promise<void>;
  unshareAsset(assetId: string, shareId: string): Promise<void>;
  getAssetShares(assetId: string): Promise<AssetShare[]>;
  
  // Maintenance
  addMaintenance(assetId: string, maintenance: Omit<AssetMaintenance, 'id'>): Promise<void>;
  updateMaintenance(assetId: string, maintenanceId: string, updates: Partial<AssetMaintenance>): Promise<void>;
  deleteMaintenance(assetId: string, maintenanceId: string): Promise<void>;
  getMaintenanceDue(userId: string, days?: number): Promise<Asset[]>;
  
  // Co-ownership
  addCoOwner(assetId: string, coOwner: AssetCoOwner): Promise<void>;
  removeCoOwner(assetId: string, userId: string): Promise<void>;
  getCoOwners(assetId: string): Promise<AssetCoOwner[]>;
  
  // Family Pooling
  poolAsset(assetId: string, familyId: string): Promise<void>;
  unpoolAsset(assetId: string): Promise<void>;
  getFamilyPooledAssets(familyId: string): Promise<Asset[]>;
  
  // Analytics
  getTotalAssetValue(userId: string): Promise<number>;
  getAssetValueByCategory(userId: string): Promise<Record<string, number>>;
  getNetWorth(userId: string, includeFamily?: boolean): Promise<number>;
}

class AssetService implements IAssetService {
  private db = db;
  private collectionName = 'assets';

  /**
   * Create a new asset
   */
  async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    try {
      const assetCollection = collection(this.db, this.collectionName);
      const newAsset = {
        ...asset,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        valuationHistory: asset.valuationHistory || [],
        shares: asset.shares || [],
        maintenance: asset.maintenance || [],
        coOwners: asset.coOwners || [],
        tags: asset.tags || [],
      };

      const docRef = await addDoc(assetCollection, newAsset);
      console.log(`✓ Asset created: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  }

  /**
   * Get a single asset
   */
  async getAsset(assetId: string, userId: string): Promise<Asset | null> {
    try {
      const assetDoc = await getDoc(doc(this.db, this.collectionName, assetId));
      
      if (!assetDoc.exists()) {
        return null;
      }

      const asset = assetDoc.data() as Asset;
      
      // Check access permissions (owner, co-owner, or shared)
      const hasAccess = 
        asset.userId === userId ||
        asset.owner.userId === userId ||
        asset.coOwners.some(co => co.userId === userId) ||
        asset.shares.some(share => share.sharedWith === userId);

      if (!hasAccess) {
        throw new Error('Access denied to this asset');
      }

      return { ...asset, id: assetDoc.id };
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  }

  /**
   * Update an asset
   */
  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<void> {
    try {
      const assetRef = doc(this.db, this.collectionName, assetId);
      await updateDoc(assetRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      console.log(`✓ Asset updated: ${assetId}`);
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(assetId: string, userId: string): Promise<void> {
    try {
      const asset = await this.getAsset(assetId, userId);
      if (!asset || asset.owner.userId !== userId) {
        throw new Error('Only the owner can delete this asset');
      }

      await deleteDoc(doc(this.db, this.collectionName, assetId));
      console.log(`✓ Asset deleted: ${assetId}`);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }

  /**
   * Get all assets for a user
   */
  async getUserAssets(userId: string, category?: string): Promise<Asset[]> {
    try {
      let q: Query<DocumentData>;
      
      if (category) {
        q = query(
          collection(this.db, this.collectionName),
          where('userId', '==', userId),
          where('category', '==', category),
          orderBy('updatedAt', 'desc')
        );
      } else {
        q = query(
          collection(this.db, this.collectionName),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...(doc.data() as Asset),
        id: doc.id,
      }));
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return [];
    }
  }

  /**
   * Search assets
   */
  async searchAssets(userId: string, term: string): Promise<Asset[]> {
    try {
      const assets = await this.getUserAssets(userId);
      const lowerTerm = term.toLowerCase();

      return assets.filter(asset =>
        asset.name.toLowerCase().includes(lowerTerm) ||
        asset.description.toLowerCase().includes(lowerTerm) ||
        asset.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
      );
    } catch (error) {
      console.error('Error searching assets:', error);
      return [];
    }
  }

  /**
   * Get assets by category
   */
  async getAssetsByCategory(userId: string, category: string): Promise<Asset[]> {
    return this.getUserAssets(userId, category);
  }

  /**
   * Get shared assets
   */
  async getSharedAssets(userId: string): Promise<Asset[]> {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where('shares', 'array-contains', { sharedWith: userId }),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...(doc.data() as Asset),
        id: doc.id,
      }));
    } catch (error) {
      console.error('Error fetching shared assets:', error);
      return [];
    }
  }

  /**
   * Get archived assets
   */
  async getArchivedAssets(userId: string): Promise<Asset[]> {
    try {
      const assets = await this.getUserAssets(userId);
      return assets.filter(asset => asset.status === 'archived');
    } catch (error) {
      console.error('Error fetching archived assets:', error);
      return [];
    }
  }

  /**
   * Add valuation
   */
  async addValuation(assetId: string, valuation: Omit<AssetValuation, 'date'>): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const newValuation: AssetValuation = {
        ...valuation,
        date: new Date().toISOString(),
      };

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        valuationHistory: [...(assetData.valuationHistory || []), newValuation],
        currentValue: newValuation.amount,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding valuation:', error);
      throw error;
    }
  }

  /**
   * Get valuation history
   */
  async getValuationHistory(assetId: string): Promise<AssetValuation[]> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) return [];

      return (asset.data() as Asset).valuationHistory || [];
    } catch (error) {
      console.error('Error fetching valuation history:', error);
      return [];
    }
  }

  /**
   * Get current asset value
   */
  async getCurrentValue(assetId: string): Promise<number> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) return 0;

      return (asset.data() as Asset).currentValue || 0;
    } catch (error) {
      console.error('Error getting current value:', error);
      return 0;
    }
  }

  /**
   * Share an asset
   */
  async shareAsset(assetId: string, shareData: Omit<AssetShare, 'id' | 'sharedAt' | 'sharedBy'>): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const newShare: AssetShare = {
        id: `share_${Date.now()}`,
        ...shareData,
        sharedAt: new Date().toISOString(),
        sharedBy: assetData.owner.userId,
      };

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        shares: [...(assetData.shares || []), newShare],
        isShared: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sharing asset:', error);
      throw error;
    }
  }

  /**
   * Remove asset share
   */
  async unshareAsset(assetId: string, shareId: string): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const updatedShares = assetData.shares.filter(s => s.id !== shareId);

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        shares: updatedShares,
        isShared: updatedShares.length > 0,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing share:', error);
      throw error;
    }
  }

  /**
   * Get asset shares
   */
  async getAssetShares(assetId: string): Promise<AssetShare[]> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) return [];

      return (asset.data() as Asset).shares || [];
    } catch (error) {
      console.error('Error fetching shares:', error);
      return [];
    }
  }

  /**
   * Add maintenance record
   */
  async addMaintenance(assetId: string, maintenance: Omit<AssetMaintenance, 'id'>): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const newMaintenance: AssetMaintenance = {
        id: `maintenance_${Date.now()}`,
        ...maintenance,
      };

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        maintenance: [...(assetData.maintenance || []), newMaintenance],
        maintenanceNextDue: maintenance.nextDueDate,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding maintenance:', error);
      throw error;
    }
  }

  /**
   * Update maintenance record
   */
  async updateMaintenance(assetId: string, maintenanceId: string, updates: Partial<AssetMaintenance>): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const updatedMaintenance = assetData.maintenance.map(m =>
        m.id === maintenanceId ? { ...m, ...updates } : m
      );

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        maintenance: updatedMaintenance,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating maintenance:', error);
      throw error;
    }
  }

  /**
   * Delete maintenance record
   */
  async deleteMaintenance(assetId: string, maintenanceId: string): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const updatedMaintenance = assetData.maintenance.filter(m => m.id !== maintenanceId);

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        maintenance: updatedMaintenance,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      throw error;
    }
  }

  /**
   * Get maintenance due soon
   */
  async getMaintenanceDue(userId: string, days: number = 30): Promise<Asset[]> {
    try {
      const assets = await this.getUserAssets(userId);
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      return assets.filter(asset => {
        if (!asset.maintenanceNextDue) return false;
        const dueDate = new Date(asset.maintenanceNextDue);
        return dueDate >= now && dueDate <= futureDate;
      });
    } catch (error) {
      console.error('Error fetching maintenance due:', error);
      return [];
    }
  }

  /**
   * Add co-owner
   */
  async addCoOwner(assetId: string, coOwner: AssetCoOwner): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      await updateDoc(doc(this.db, this.collectionName, assetId), {
        coOwners: [...(assetData.coOwners || []), coOwner],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding co-owner:', error);
      throw error;
    }
  }

  /**
   * Remove co-owner
   */
  async removeCoOwner(assetId: string, userId: string): Promise<void> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) throw new Error('Asset not found');

      const assetData = asset.data() as Asset;
      const updatedCoOwners = assetData.coOwners.filter(co => co.userId !== userId);

      await updateDoc(doc(this.db, this.collectionName, assetId), {
        coOwners: updatedCoOwners,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing co-owner:', error);
      throw error;
    }
  }

  /**
   * Get co-owners
   */
  async getCoOwners(assetId: string): Promise<AssetCoOwner[]> {
    try {
      const asset = await getDoc(doc(this.db, this.collectionName, assetId));
      if (!asset.exists()) return [];

      const assetData = asset.data() as Asset;
      return [assetData.owner, ...(assetData.coOwners || [])];
    } catch (error) {
      console.error('Error fetching co-owners:', error);
      return [];
    }
  }

  /**
   * Pool asset to family
   */
  async poolAsset(assetId: string, familyId: string): Promise<void> {
    try {
      await updateDoc(doc(this.db, this.collectionName, assetId), {
        familyPooled: true,
        updatedAt: Timestamp.now(),
      });

      // Add to family pooled collection
      const familyPoolRef = collection(this.db, `families/${familyId}/pooledAssets`);
      await addDoc(familyPoolRef, { assetId, addedAt: Timestamp.now() });
    } catch (error) {
      console.error('Error pooling asset:', error);
      throw error;
    }
  }

  /**
   * Unpool asset from family
   */
  async unpoolAsset(assetId: string): Promise<void> {
    try {
      await updateDoc(doc(this.db, this.collectionName, assetId), {
        familyPooled: false,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error unpooling asset:', error);
      throw error;
    }
  }

  /**
   * Get family pooled assets
   */
  async getFamilyPooledAssets(familyId: string): Promise<Asset[]> {
    try {
      const poolRef = collection(this.db, `families/${familyId}/pooledAssets`);
      const poolSnapshot = await getDocs(poolRef);
      const assetIds = poolSnapshot.docs.map(doc => (doc.data()).assetId);

      const assets: Asset[] = [];
      for (const assetId of assetIds) {
        const assetDoc = await getDoc(doc(this.db, this.collectionName, assetId));
        if (assetDoc.exists()) {
          assets.push({ ...(assetDoc.data() as Asset), id: assetDoc.id });
        }
      }

      return assets;
    } catch (error) {
      console.error('Error fetching family pooled assets:', error);
      return [];
    }
  }

  /**
   * Get total asset value for user
   */
  async getTotalAssetValue(userId: string): Promise<number> {
    try {
      const assets = await this.getUserAssets(userId);
      return assets.reduce((total, asset) => total + asset.currentValue, 0);
    } catch (error) {
      console.error('Error calculating total value:', error);
      return 0;
    }
  }

  /**
   * Get asset value by category
   */
  async getAssetValueByCategory(userId: string): Promise<Record<string, number>> {
    try {
      const assets = await this.getUserAssets(userId);
      const byCategory: Record<string, number> = {};

      assets.forEach(asset => {
        if (!byCategory[asset.category]) {
          byCategory[asset.category] = 0;
        }
        byCategory[asset.category] += asset.currentValue;
      });

      return byCategory;
    } catch (error) {
      console.error('Error calculating value by category:', error);
      return {};
    }
  }

  /**
   * Calculate net worth
   */
  async getNetWorth(userId: string, includeFamily: boolean = false): Promise<number> {
    try {
      const personalAssets = await this.getTotalAssetValue(userId);
      // TODO: Calculate liabilities and deduct
      // TODO: If includeFamily, add family pooled assets
      return personalAssets;
    } catch (error) {
      console.error('Error calculating net worth:', error);
      return 0;
    }
  }

  /**
   * Real-time listener for user assets
   */
  subscribeToUserAssets(userId: string, callback: (assets: Asset[]) => void, errorCallback?: (error: Error) => void): () => void {
    try {
      const q: Query<DocumentData> = query(
        collection(this.db, this.collectionName),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const assets: Asset[] = snapshot.docs.map(doc => ({
            ...(doc.data() as Asset),
            id: doc.id,
          }));
          callback(assets);
        },
        (error) => {
          console.error('Error subscribing to assets:', error);
          if (errorCallback) errorCallback(error as Error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up asset subscription:', error);
      return () => {};
    }
  }

  /**
   * Real-time listener for single asset
   */
  subscribeToAsset(assetId: string, callback: (asset: Asset | null) => void, errorCallback?: (error: Error) => void): () => void {
    try {
      const docRef = doc(this.db, this.collectionName, assetId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            callback({
              ...(snapshot.data() as Asset),
              id: snapshot.id,
            });
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('Error subscribing to asset:', error);
          if (errorCallback) errorCallback(error as Error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up asset subscription:', error);
      return () => {};
    }
  }
}

// Export singleton instance
const assetService = new AssetService();
export default assetService;

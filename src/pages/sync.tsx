import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { SyncProvider, SyncControlDashboard } from '@/components/sync/SyncEngine';
import { MobileBridgeStatus } from '@/components/mobile/MobileBridgeStatus';
import { BridgeService } from '@/services/BridgeService';
import { MeshNetworkManager } from '@/services/MeshNetworkManager';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SyncPage: React.FC = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const initServices = async () => {
        try {
          // Initialize Bridge Service
          await BridgeService.initialize(user.id);
          
          // Initialize Mesh Network (deviceId will be auto-generated)
          const deviceId = localStorage.getItem('deviceId') || `web_${Date.now()}`;
          await MeshNetworkManager.initialize(user.id, deviceId);
          
          setIsInitialized(true);
          console.log('[SyncPage] Mobile integration services initialized');
        } catch (error) {
          console.error('[SyncPage] Failed to initialize services:', error);
        }
      };

      initServices();

      return () => {
        BridgeService.disconnect();
        MeshNetworkManager.shutdown();
      };
    }
  }, [user]);

  return (
    <SyncProvider>
      <IntranetLayout>
        <Head>
          <title>Sync Control - Salatiso Ecosystem</title>
          <meta name="description" content="Real-time sync engine with mesh networking, delta sync, and mobile bridge" />
        </Head>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sync Control Center</h1>
            <p className="text-gray-600">
              Manage sync operations, mobile connections, and mesh networking
            </p>
          </div>

          <Tabs defaultValue="sync-engine" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sync-engine">Sync Engine</TabsTrigger>
              <TabsTrigger value="mobile-bridge">Mobile Bridge</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sync-engine" className="mt-6">
              <SyncControlDashboard />
            </TabsContent>
            
            <TabsContent value="mobile-bridge" className="mt-6">
              {isInitialized ? (
                <MobileBridgeStatus />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing mobile bridge services...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </IntranetLayout>
    </SyncProvider>
  );
};

export default SyncPage;

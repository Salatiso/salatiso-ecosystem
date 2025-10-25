/**
 * MobileBridgeStatus - Real-time Mobile Sync Dashboard
 * 
 * Displays connection status, sync progress, device list, mesh network status,
 * and offline queue management for the Sonny Bridge integration.
 */

import React, { useEffect, useState } from 'react';
import { BridgeService, BridgeStatus, ConnectedDevice, SyncProgress } from '@/services/BridgeService';
import { MeshNetworkManager, MeshPeer, PeerStatus, SyncStats } from '@/services/MeshNetworkManager';
import { OfflineQueueManager, QueueStats } from '@/services/OfflineQueueManager';
import { Smartphone, Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock, Users, Database, Activity } from 'lucide-react';

export const MobileBridgeStatus: React.FC = () => {
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>(BridgeStatus.DISCONNECTED);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [meshPeers, setMeshPeers] = useState<MeshPeer[]>([]);
  const [meshStats, setMeshStats] = useState<SyncStats | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Subscribe to Bridge Service events
    const unsubBridgeStatus = BridgeService.on('statusChanged', (status: BridgeStatus) => {
      setBridgeStatus(status);
    });

    const unsubDevices = BridgeService.on('devicesUpdated', (devices: ConnectedDevice[]) => {
      setConnectedDevices(devices);
    });

    const unsubSyncProgress = BridgeService.on('syncProgress', (progress: SyncProgress) => {
      setSyncProgress(progress);
    });

    // Subscribe to Mesh Network events
    const unsubMeshPeers = MeshNetworkManager.on('peerDiscovered', () => {
      setMeshPeers(MeshNetworkManager.getPeers());
    });

    const unsubMeshStats = MeshNetworkManager.on('statsUpdated', (stats: SyncStats) => {
      setMeshStats(stats);
    });

    // Subscribe to Queue events
    const unsubQueueUpdate = OfflineQueueManager.on('operationUpdated', async () => {
      const stats = await OfflineQueueManager.getStats();
      setQueueStats(stats);
    });

    // Initialize services
    const init = async () => {
      try {
        await OfflineQueueManager.initialize();
        const stats = await OfflineQueueManager.getStats();
        setQueueStats(stats);
        setIsInitialized(true);
      } catch (error) {
        console.error('[MobileBridgeStatus] Initialization failed:', error);
      }
    };

    init();

    // Get initial state
    setBridgeStatus(BridgeService.getStatus());
    setConnectedDevices(BridgeService.getConnectedDevices());
    setMeshPeers(MeshNetworkManager.getPeers());
    setMeshStats(MeshNetworkManager.getStats());

    return () => {
      unsubBridgeStatus();
      unsubDevices();
      unsubSyncProgress();
      unsubMeshPeers();
      unsubMeshStats();
      unsubQueueUpdate();
    };
  }, []);

  const handleRequestSync = async () => {
    try {
      await BridgeService.requestSync(['incidents', 'escalations', 'projects', 'contacts']);
    } catch (error) {
      console.error('[MobileBridgeStatus] Sync request failed:', error);
    }
  };

  const handleRetryQueue = async () => {
    try {
      await OfflineQueueManager.retryFailed();
    } catch (error) {
      console.error('[MobileBridgeStatus] Retry failed:', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await OfflineQueueManager.clearCompleted();
      const stats = await OfflineQueueManager.getStats();
      setQueueStats(stats);
    } catch (error) {
      console.error('[MobileBridgeStatus] Clear failed:', error);
    }
  };

  const getStatusColor = (status: BridgeStatus) => {
    switch (status) {
      case BridgeStatus.CONNECTED:
        return 'text-green-600 bg-green-50';
      case BridgeStatus.CONNECTING:
      case BridgeStatus.SYNCING:
        return 'text-yellow-600 bg-yellow-50';
      case BridgeStatus.ERROR:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: BridgeStatus) => {
    switch (status) {
      case BridgeStatus.CONNECTED:
        return <CheckCircle className="h-5 w-5" />;
      case BridgeStatus.CONNECTING:
      case BridgeStatus.SYNCING:
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case BridgeStatus.ERROR:
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <WifiOff className="h-5 w-5" />;
    }
  };

  const getPeerStatusColor = (status: PeerStatus) => {
    switch (status) {
      case PeerStatus.CONNECTED:
        return 'bg-green-500';
      case PeerStatus.CONNECTING:
      case PeerStatus.DISCOVERING:
        return 'bg-yellow-500';
      case PeerStatus.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Bridge Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${getStatusColor(bridgeStatus)}`}>
              {getStatusIcon(bridgeStatus)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Mobile Bridge Status</h2>
              <p className="text-sm text-gray-600">Sonny Android App Connection</p>
            </div>
          </div>
          <button
            onClick={handleRequestSync}
            disabled={bridgeStatus !== BridgeStatus.CONNECTED}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Connected Devices</span>
            </div>
            <p className="text-2xl font-bold">{connectedDevices.length}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Last Sync</span>
            </div>
            <p className="text-2xl font-bold">{formatTimestamp(syncProgress?.lastSync || null)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <p className="text-2xl font-bold">{bridgeStatus}</p>
          </div>
        </div>

        {syncProgress && syncProgress.inProgress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Syncing...</span>
              <span>{syncProgress.completed} / {syncProgress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(syncProgress.completed / syncProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Device List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>Connected Devices</span>
        </h3>
        
        {connectedDevices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Smartphone className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No devices connected</p>
            <p className="text-sm">Open Sonny app to connect</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connectedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-xs text-gray-600">
                      {device.type} • v{device.version} • {formatTimestamp(device.lastSeen)}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  device.status === 'online' ? 'bg-green-100 text-green-800' :
                  device.status === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mesh Network Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Wifi className="h-5 w-5" />
          <span>Mesh Network</span>
        </h3>

        {meshStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Peers</p>
              <p className="text-2xl font-bold text-blue-600">{meshStats.peersConnected}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600 mb-1">Data Synced</p>
              <p className="text-2xl font-bold text-green-600">{formatBytes(meshStats.totalDataSynced)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">Bandwidth</p>
              <p className="text-2xl font-bold text-purple-600">{formatBytes(meshStats.bandwidth)}/s</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-orange-600 mb-1">Conflicts</p>
              <p className="text-2xl font-bold text-orange-600">{meshStats.conflicts}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {meshPeers.map((peer) => (
            <div key={peer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${getPeerStatusColor(peer.status)}`} />
                <div>
                  <p className="font-medium text-sm">{peer.name}</p>
                  <p className="text-xs text-gray-600">
                    {peer.type} • {peer.latency}ms • {formatBytes(peer.dataSize)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-600">{peer.status}</span>
            </div>
          ))}
          {meshPeers.length === 0 && (
            <p className="text-center text-gray-500 py-4">No mesh peers discovered</p>
          )}
        </div>
      </div>

      {/* Offline Queue Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Offline Queue</span>
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleRetryQueue}
              disabled={!queueStats || queueStats.failed === 0}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Retry Failed
            </button>
            <button
              onClick={handleClearCompleted}
              disabled={!queueStats || queueStats.completed === 0}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Clear Completed
            </button>
          </div>
        </div>

        {queueStats ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{queueStats.pending}</p>
              <p className="text-xs text-yellow-600">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{queueStats.processing}</p>
              <p className="text-xs text-blue-600">Processing</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{queueStats.completed}</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{queueStats.failed}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{queueStats.conflicts}</p>
              <p className="text-xs text-orange-600">Conflicts</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Initializing queue...</p>
        )}
      </div>
    </div>
  );
};

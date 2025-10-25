/**
 * EscalationHeatmap Component - Phase 4.6 Analytics
 * Heatmap showing escalation intensity by day/time
 * Helps identify peak escalation times and patterns
 */

'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, BarChart3 } from 'lucide-react';

interface EscalationData {
  day: string;
  hour: number;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Generate mock escalation heatmap data
 */
const generateHeatmapData = (): EscalationData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data: EscalationData[] = [];
  
  for (const day of days) {
    for (const hour of hours) {
      // Peak during business hours (9-17)
      const basePeak = (hour >= 9 && hour <= 17) ? 3 : 0.5;
      // Higher on weekdays
      const dayMultiplier = ['Sat', 'Sun'].includes(day) ? 0.6 : 1;
      // Morning spike (9-10), lunch dip (12-13), afternoon spike (15-16)
      const hourEffect = (hour === 9 || hour === 15) ? 1.5 : (hour === 12) ? 0.3 : 1;
      
      const count = Math.round(basePeak * dayMultiplier * hourEffect * (8 + Math.random() * 12));
      
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (count > 40) severity = 'critical';
      else if (count > 30) severity = 'high';
      else if (count > 15) severity = 'medium';
      
      data.push({
        day,
        hour,
        count,
        severity,
      });
    }
  }
  
  return data;
};

/**
 * Get color based on severity and count
 */
const getHeatColor = (count: number, severity: string): string => {
  if (count === 0) return '#f3f4f6';
  if (severity === 'critical') return '#dc2626';
  if (severity === 'high') return '#f97316';
  if (severity === 'medium') return '#eab308';
  return '#86efac';
};

export const EscalationHeatmap: React.FC = () => {
  const data = useMemo(() => generateHeatmapData(), []);
  
  const stats = useMemo(() => {
    const allCounts = data.map(d => d.count);
    const totalEscalations = allCounts.reduce((a, b) => a + b, 0);
    const criticalCount = data.filter(d => d.severity === 'critical').length;
    const avgPerHour = Math.round(totalEscalations / 24);
    const peakHour = data.reduce((max, curr) => curr.count > max.count ? curr : max);
    
    return {
      totalEscalations,
      criticalCount,
      avgPerHour,
      peakHour: `${peakHour.hour}:00 (${peakHour.count} escalations)`,
    };
  }, [data]);
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Escalation Heatmap</h3>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Total Escalations</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.totalEscalations}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Critical Hours</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.criticalCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Avg per Hour</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.avgPerHour}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Peak Time</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{stats.peakHour}</p>
        </div>
      </div>
      
      {/* Heatmap */}
      <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex gap-1 mb-2">
            <div className="w-12 h-6"></div>
            {hours.map(hour => (
              <div
                key={`header-${hour}`}
                className="w-12 h-6 text-center text-xs font-semibold text-gray-600"
              >
                {hour}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          {days.map(day => (
            <div key={day} className="flex gap-1 mb-1">
              <div className="w-12 h-8 flex items-center text-xs font-semibold text-gray-700">
                {day}
              </div>
              {hours.map(hour => {
                const item = data.find(d => d.day === day && d.hour === hour);
                if (!item) return null;
                
                return (
                  <div
                    key={`heatmap-${day}-${hour}`}
                    className="w-12 h-8 rounded flex items-center justify-center text-xs font-semibold cursor-pointer hover:opacity-75 transition-opacity"
                    style={{ backgroundColor: getHeatColor(item.count, item.severity) }}
                    title={`${day} ${hour}:00 - ${item.count} escalations (${item.severity})`}
                  >
                    {item.count > 0 ? item.count : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">None</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span className="text-sm text-gray-600">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-sm text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-sm text-gray-600">Critical</span>
        </div>
      </div>
      
      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg flex gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Peak Escalation Times</p>
          <p className="text-sm text-blue-700 mt-1">
            Most escalations occur during business hours (9-17), with significant peaks at 9-10 AM and 3-4 PM. 
            Consider staffing adjustments during these times.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * PredictiveAnalyticsService - ML-Powered Predictions & Forecasting
 * Analyzes patterns and generates predictions for user behavior
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TimePattern {
  hour: number;
  count: number;
  percentage: number;
}

export interface ActivityTrend {
  date: Date;
  value: number;
  type: string;
}

export interface PredictionModel {
  name: string;
  confidence: number;
  accuracy: number;
  lastUpdated: Date;
}

export interface BusyPeriod {
  startHour: number;
  endHour: number;
  day: number;
  intensity: 'low' | 'medium' | 'high';
}

class PredictiveAnalyticsImpl {
  /**
   * Analyze user's busiest times from calendar data
   */
  async analyzeBusyTimes(userId: string): Promise<TimePattern[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', thirtyDaysAgo),
        orderBy('startTime', 'desc')
      );

      const eventsSnap = await getDocs(eventsQuery);
      const timeDistribution: Record<number, number> = {};
      let totalEvents = 0;

      eventsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.startTime) {
          const hour = data.startTime.toDate().getHours();
          timeDistribution[hour] = (timeDistribution[hour] || 0) + 1;
          totalEvents++;
        }
      });

      // Convert to TimePattern array
      const patterns: TimePattern[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const count = timeDistribution[hour] || 0;
        patterns.push({
          hour,
          count,
          percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
        });
      }

      return patterns.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('[PredictiveAnalytics] Error analyzing busy times:', error);
      return [];
    }
  }

  /**
   * Predict user's busiest day of the week
   */
  async predictBusiestDay(userId: string): Promise<string> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', thirtyDaysAgo)
      );

      const eventsSnap = await getDocs(eventsQuery);
      const dayDistribution: Record<number, number> = {};

      eventsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.startTime) {
          const day = data.startTime.toDate().getDay();
          dayDistribution[day] = (dayDistribution[day] || 0) + 1;
        }
      });

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const busiestDay = Object.entries(dayDistribution).sort(([, a], [, b]) => b - a)[0];
      
      return busiestDay ? days[parseInt(busiestDay[0])] : 'Monday';
    } catch (error) {
      console.error('[PredictiveAnalytics] Error predicting busiest day:', error);
      return 'Monday';
    }
  }

  /**
   * Forecast contact engagement trends
   */
  async forecastContactEngagement(userId: string): Promise<ActivityTrend[]> {
    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const contactsQuery = query(
        collection(db, 'contacts'),
        where('userId', '==', userId),
        where('lastInteracted', '>=', ninetyDaysAgo),
        orderBy('lastInteracted', 'desc')
      );

      const contactsSnap = await getDocs(contactsQuery);
      const interactionsByDay: Record<string, number> = {};

      contactsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.lastInteracted) {
          const date = data.lastInteracted.toDate();
          const dateStr = date.toISOString().split('T')[0];
          interactionsByDay[dateStr] = (interactionsByDay[dateStr] || 0) + 1;
        }
      });

      // Convert to ActivityTrend array
      const trends: ActivityTrend[] = Object.entries(interactionsByDay)
        .map(([dateStr, count]) => ({
          date: new Date(dateStr),
          value: count,
          type: 'contact_interaction',
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      return trends;
    } catch (error) {
      console.error('[PredictiveAnalytics] Error forecasting engagement:', error);
      return [];
    }
  }

  /**
   * Calculate meeting duration average and predict future durations
   */
  async predictMeetingDuration(userId: string): Promise<{
    average: number;
    predicted: number;
    confidence: number;
  }> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', thirtyDaysAgo),
        orderBy('startTime', 'desc')
      );

      const eventsSnap = await getDocs(eventsQuery);
      const durations: number[] = [];

      eventsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.startTime && data.endTime) {
          const start = data.startTime.toDate();
          const end = data.endTime.toDate();
          const durationMinutes = (end.getTime() - start.getTime()) / 60000;
          if (durationMinutes > 0 && durationMinutes < 480) { // Max 8 hours
            durations.push(durationMinutes);
          }
        }
      });

      if (durations.length === 0) {
        return { average: 30, predicted: 30, confidence: 0.5 };
      }

      // Calculate average
      const average = durations.reduce((a, b) => a + b, 0) / durations.length;

      // Calculate standard deviation for confidence
      const variance = durations.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / durations.length;
      const stdDev = Math.sqrt(variance);
      const confidence = Math.max(0.5, Math.min(1, 1 - (stdDev / average) * 0.1));

      return {
        average: Math.round(average),
        predicted: Math.round(average),
        confidence: parseFloat(confidence.toFixed(2)),
      };
    } catch (error) {
      console.error('[PredictiveAnalytics] Error predicting duration:', error);
      return { average: 30, predicted: 30, confidence: 0.5 };
    }
  }

  /**
   * Identify busy periods (day/hour combinations)
   */
  async identifyBusyPeriods(userId: string, threshold: number = 0.6): Promise<BusyPeriod[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', thirtyDaysAgo)
      );

      const eventsSnap = await getDocs(eventsQuery);
      const periodCounts: Record<string, number> = {};
      let totalEvents = 0;

      eventsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.startTime) {
          const date = data.startTime.toDate();
          const day = date.getDay();
          const hour = date.getHours();
          const key = `${day}_${hour}`;
          periodCounts[key] = (periodCounts[key] || 0) + 1;
          totalEvents++;
        }
      });

      // Convert to BusyPeriod array
      const busyPeriods: BusyPeriod[] = [];
      const avgPerPeriod = totalEvents / (7 * 24);

      Object.entries(periodCounts).forEach(([key, count]) => {
        const [day, hour] = key.split('_').map(Number);
        const percentage = count / totalEvents;

        if (percentage >= threshold) {
          let intensity: 'low' | 'medium' | 'high';
          if (percentage >= 0.08) intensity = 'high';
          else if (percentage >= 0.05) intensity = 'medium';
          else intensity = 'low';

          busyPeriods.push({
            startHour: hour,
            endHour: hour + 1,
            day,
            intensity,
          });
        }
      });

      return busyPeriods.sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startHour - b.startHour;
      });
    } catch (error) {
      console.error('[PredictiveAnalytics] Error identifying busy periods:', error);
      return [];
    }
  }

  /**
   * Forecast productivity for the upcoming week
   */
  async forecastProductivity(userId: string): Promise<{
    weekProductivity: number;
    trend: 'improving' | 'declining' | 'stable';
    confidence: number;
  }> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', thirtyDaysAgo),
        orderBy('startTime', 'desc')
      );

      const eventsSnap = await getDocs(eventsQuery);
      const weeklyData: Record<number, number> = {};

      eventsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.startTime) {
          const date = data.startTime.toDate();
          const weekNum = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
          weeklyData[weekNum] = (weeklyData[weekNum] || 0) + 1;
        }
      });

      // Get last 4 weeks
      const lastWeeks = [0, 1, 2, 3].map(w => weeklyData[w] || 0);
      const avgThisWeek = lastWeeks[0];
      const avgLastWeek = lastWeeks[1];
      const avgPrevious = (lastWeeks[2] + lastWeeks[3]) / 2;

      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (avgThisWeek > avgLastWeek * 1.1) trend = 'improving';
      else if (avgThisWeek < avgLastWeek * 0.9) trend = 'declining';

      const confidence = Math.min(0.95, Math.max(0.5, lastWeeks.filter(w => w > 0).length / 4));

      return {
        weekProductivity: Math.round(avgThisWeek),
        trend,
        confidence: parseFloat(confidence.toFixed(2)),
      };
    } catch (error) {
      console.error('[PredictiveAnalytics] Error forecasting productivity:', error);
      return {
        weekProductivity: 5,
        trend: 'stable',
        confidence: 0.5,
      };
    }
  }

  /**
   * Analyze calendar and predict free time slots
   */
  async predictFreeTimeSlots(
    userId: string,
    date: Date = new Date(),
    duration: number = 60 // minutes
  ): Promise<Array<{ start: Date; end: Date; confidence: number }>> {
    try {
      // Get events for the specific day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', dayStart),
        where('startTime', '<=', dayEnd)
      );

      const eventsSnap = await getDocs(eventsQuery);
      const events = eventsSnap.docs
        .map(doc => doc.data())
        .sort((a, b) => {
          const aTime = a.startTime?.toDate()?.getTime() || 0;
          const bTime = b.startTime?.toDate()?.getTime() || 0;
          return aTime - bTime;
        });

      // Find free slots
      const freeSlots: Array<{ start: Date; end: Date; confidence: number }> = [];
      let currentTime = new Date(dayStart);
      currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

      for (const event of events) {
        const eventStart = event.startTime?.toDate() || new Date();
        const eventEnd = event.endTime?.toDate() || new Date();

        if (currentTime.getTime() + duration * 60000 <= eventStart.getTime()) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(currentTime.getTime() + duration * 60000),
            confidence: 0.9,
          });
        }

        currentTime = new Date(Math.max(currentTime.getTime(), eventEnd.getTime()));
      }

      // Add end-of-day slot
      const dayEndWork = new Date(dayStart);
      dayEndWork.setHours(17, 0, 0, 0);
      if (currentTime.getTime() + duration * 60000 <= dayEndWork.getTime()) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(currentTime.getTime() + duration * 60000),
          confidence: 0.85,
        });
      }

      return freeSlots;
    } catch (error) {
      console.error('[PredictiveAnalytics] Error predicting free slots:', error);
      return [];
    }
  }

  /**
   * Detect anomalies in user's typical behavior
   */
  async detectAnomalies(userId: string): Promise<Array<{ date: Date; eventCount: number; anomalyScore: number }>> {
    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        where('startTime', '>=', ninetyDaysAgo),
        orderBy('startTime', 'desc')
      );

      const eventsSnap = await getDocs(eventsQuery);
      const dailyData: Record<string, number> = {};

      eventsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.startTime) {
          const dateStr = data.startTime.toDate().toISOString().split('T')[0];
          dailyData[dateStr] = (dailyData[dateStr] || 0) + 1;
        }
      });

      // Calculate mean and std dev
      const counts = Object.values(dailyData);
      const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
      const variance = counts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / counts.length;
      const stdDev = Math.sqrt(variance);

      // Detect anomalies (values > 2 std deviations from mean)
      const anomalies: Array<{ date: Date; eventCount: number; anomalyScore: number }> = [];
      Object.entries(dailyData).forEach(([dateStr, count]) => {
        const zscore = Math.abs((count - mean) / stdDev);
        if (zscore > 2) {
          anomalies.push({
            date: new Date(dateStr),
            eventCount: count,
            anomalyScore: zscore,
          });
        }
      });

      return anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore);
    } catch (error) {
      console.error('[PredictiveAnalytics] Error detecting anomalies:', error);
      return [];
    }
  }
}

export const predictiveAnalyticsService = new PredictiveAnalyticsImpl();

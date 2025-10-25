'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

/**
 * ChartsComponent
 * Reusable chart visualizations for analytics dashboard
 * Supports: Pie, Bar, Line, Radar charts with real-time updates
 */

// ==================== Types ====================

export type ChartType = 'pie' | 'bar' | 'line' | 'radar' | 'doughnut';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartOptions {
  colors?: string[];
  animate?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  hideLabels?: boolean;
}

export interface PieChartProps {
  data: ChartData[];
  title: string;
  options?: ChartOptions;
  onDataClick?: (data: ChartData) => void;
}

export interface BarChartProps {
  data: ChartData[];
  title: string;
  xDataKey: string;
  yDataKey: string;
  options?: ChartOptions;
  onDataClick?: (data: ChartData) => void;
}

export interface LineChartProps {
  data: ChartData[];
  title: string;
  xDataKey: string;
  yDataKey: string | string[];
  options?: ChartOptions;
  onDataClick?: (data: ChartData) => void;
}

export interface RadarChartProps {
  data: ChartData[];
  title: string;
  dataKey: string;
  nameKey: string;
  options?: ChartOptions;
}

// ==================== Default Colors ====================

const DEFAULT_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
];

const RADAR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

// ==================== Custom Tooltip ====================

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        {label && (
          <p className="font-semibold text-gray-800">{label}</p>
        )}
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' 
              ? entry.value.toFixed(2) 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ==================== Pie Chart ====================

export const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  title,
  options = {},
  onDataClick,
}) => {
  const {
    colors = DEFAULT_COLORS,
    animate = true,
    showLegend = true,
    showTooltip = true,
    height = 300,
    hideLabels = false,
  } = options;

  const chartData = useMemo(() => data, [data]);

  const handleClick = (entry: any) => {
    const clickedData = chartData.find((d) => d.name === entry.name);
    if (clickedData && onDataClick) {
      onDataClick(clickedData);
    }
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={!hideLabels}
              label={!hideLabels ? { fill: '#666', fontSize: 12 } : false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onClick={handleClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ==================== Bar Chart ====================

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  title,
  xDataKey,
  yDataKey,
  options = {},
  onDataClick,
}) => {
  const {
    colors = DEFAULT_COLORS,
    animate = true,
    showLegend = true,
    showTooltip = true,
    height = 300,
  } = options;

  const chartData = useMemo(() => data, [data]);

  const handleClick = (entry: any) => {
    const clickedData = chartData.find(
      (d) => d[xDataKey] === entry[xDataKey]
    );
    if (clickedData && onDataClick) {
      onDataClick(clickedData);
    }
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            onClick={(data) => handleClick(data.activeTooltipIndex)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey={xDataKey} stroke="#666" />
            <YAxis stroke="#666" />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Bar
              dataKey={yDataKey}
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              isAnimationActive={animate}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ==================== Line Chart ====================

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  title,
  xDataKey,
  yDataKey,
  options = {},
  onDataClick,
}) => {
  const {
    colors = DEFAULT_COLORS,
    animate = true,
    showLegend = true,
    showTooltip = true,
    height = 300,
  } = options;

  const chartData = useMemo(() => data, [data]);
  const yDataKeys = useMemo(
    () => (Array.isArray(yDataKey) ? yDataKey : [yDataKey]),
    [yDataKey]
  );

  const handleClick = (entry: any) => {
    const clickedData = chartData.find(
      (d) => d[xDataKey] === entry[xDataKey]
    );
    if (clickedData && onDataClick) {
      onDataClick(clickedData);
    }
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            onClick={(data) => handleClick(data.activeTooltipIndex)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey={xDataKey} stroke="#666" />
            <YAxis stroke="#666" />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {yDataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={animate}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ==================== Radar Chart ====================

export const RadarChartComponent: React.FC<RadarChartProps> = ({
  data,
  title,
  dataKey,
  nameKey,
  options = {},
}) => {
  const { animate = true, showLegend = true, height = 300 } = options;

  const chartData = useMemo(() => data, [data]);

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={chartData}>
            <PolarAngleAxis dataKey={nameKey} stroke="#666" />
            <PolarRadiusAxis stroke="#666" />
            <Radar
              name={dataKey}
              dataKey={dataKey}
              stroke={RADAR_COLORS[0]}
              fill={RADAR_COLORS[0]}
              fillOpacity={0.6}
              isAnimationActive={animate}
            />
            {showLegend && <Legend />}
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ==================== Doughnut Chart ====================

export const DoughnutChartComponent: React.FC<PieChartProps> = ({
  data,
  title,
  options = {},
  onDataClick,
}) => {
  const {
    colors = DEFAULT_COLORS,
    animate = true,
    showLegend = true,
    showTooltip = true,
    height = 300,
  } = options;

  const chartData = useMemo(() => data, [data]);

  const handleClick = (entry: any) => {
    const clickedData = chartData.find((d) => d.name === entry.name);
    if (clickedData && onDataClick) {
      onDataClick(clickedData);
    }
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onClick={handleClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ==================== Generic Chart Wrapper ====================

interface GenericChartProps {
  type: ChartType;
  data: ChartData[];
  title: string;
  xDataKey?: string;
  yDataKey?: string | string[];
  dataKey?: string;
  nameKey?: string;
  options?: ChartOptions;
  onDataClick?: (data: ChartData) => void;
}

export const Chart: React.FC<GenericChartProps> = ({
  type,
  data,
  title,
  xDataKey = 'name',
  yDataKey = 'value',
  dataKey = 'value',
  nameKey = 'name',
  options,
  onDataClick,
}) => {
  switch (type) {
    case 'pie':
      return (
        <PieChartComponent
          data={data}
          title={title}
          options={options}
          onDataClick={onDataClick}
        />
      );
    case 'bar':
      return (
        <BarChartComponent
          data={data}
          title={title}
          xDataKey={xDataKey}
          yDataKey={yDataKey as string}
          options={options}
          onDataClick={onDataClick}
        />
      );
    case 'line':
      return (
        <LineChartComponent
          data={data}
          title={title}
          xDataKey={xDataKey}
          yDataKey={yDataKey}
          options={options}
          onDataClick={onDataClick}
        />
      );
    case 'radar':
      return (
        <RadarChartComponent
          data={data}
          title={title}
          dataKey={dataKey}
          nameKey={nameKey}
          options={options}
        />
      );
    case 'doughnut':
      return (
        <DoughnutChartComponent
          data={data}
          title={title}
          options={options}
          onDataClick={onDataClick}
        />
      );
    default:
      return null;
  }
};

export default Chart;

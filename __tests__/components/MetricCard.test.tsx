/**
 * MetricCard Component Tests
 * 
 * Tests for analytics metric card component
 * 
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricCard from '@/components/analytics/MetricCard';

describe('MetricCard', () => {
  it('should render metric title and value', () => {
    render(
      <MetricCard
        title="Active Members"
        value={42}
        icon="👥"
        color="blue"
      />
    );

    expect(screen.getByText('Active Members')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('should display subtitle when provided', () => {
    render(
      <MetricCard
        title="Participation Rate"
        value="85.5%"
        subtitle="of total family members"
        icon="📊"
        color="green"
      />
    );

    expect(screen.getByText('of total family members')).toBeInTheDocument();
  });

  it('should show trend indicator when provided', () => {
    render(
      <MetricCard
        title="Collaboration Score"
        value={92}
        trend="up"
        change={12.5}
        icon="🤝"
        color="orange"
      />
    );

    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('vs previous period')).toBeInTheDocument();
  });

  it('should show down trend with correct color', () => {
    const { container } = render(
      <MetricCard
        title="Some Metric"
        value={50}
        trend="down"
        change={-5.3}
        color="red"
      />
    );

    expect(screen.getByText('-5.3%')).toBeInTheDocument();
    
    // Check for red color class
    const trendElement = screen.getByText('-5.3%').parentElement;
    expect(trendElement).toHaveClass('text-red-600');
  });

  it('should show stable trend', () => {
    render(
      <MetricCard
        title="Stable Metric"
        value={100}
        trend="stable"
        change={0}
        color="blue"
      />
    );

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should apply correct color theme', () => {
    const { container } = render(
      <MetricCard
        title="Orange Metric"
        value={75}
        icon="🌟"
        color="orange"
      />
    );

    // Check for orange theme classes
    const iconContainer = container.querySelector('.bg-orange-50');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should handle string values', () => {
    render(
      <MetricCard
        title="Economic Value"
        value="$125K"
        icon="💰"
        color="green"
      />
    );

    expect(screen.getByText('$125K')).toBeInTheDocument();
  });

  it('should render without optional props', () => {
    render(
      <MetricCard
        title="Simple Metric"
        value={100}
      />
    );

    expect(screen.getByText('Simple Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should have hover shadow effect class', () => {
    const { container } = render(
      <MetricCard
        title="Hoverable"
        value={50}
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-lg');
  });
});

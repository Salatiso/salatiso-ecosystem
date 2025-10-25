import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const RondavelIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const FamilyIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="currentColor"
      opacity="0.8"
    />
    <circle cx="12" cy="8" r="3" fill="currentColor" />
    <path d="M8 14h8l-2 4h-4l-2-4z" fill="currentColor" opacity="0.6" />
  </svg>
);

export const UbuntuIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

export const JourneyIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 12l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v8H3v-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="8" r="2" fill="currentColor" />
  </svg>
);

export const RitualIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2l1.09 2.26.25 3.74h3.32l-2.69 1.95.82 3.68L12 11.77l-2.79 1.86.82-3.68L7.36 8.26h3.32l.25-3.74L12 2z"
      fill="currentColor"
      opacity="0.8"
    />
    <circle cx="12" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const KinshipIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.7" />
    <circle cx="16" cy="8" r="3" fill="currentColor" opacity="0.7" />
    <circle cx="12" cy="16" r="3" fill="currentColor" opacity="0.7" />
    <path d="M10 10l2 2M14 10l-2 2M12 13v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const MilestoneIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);
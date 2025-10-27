/**
 * Device Detection Utility
 * Detects device type and capabilities for mobile/desktop optimization
 */

export type DeviceType = 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'desktop';

/**
 * Check if device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get specific device type
 */
export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent;

  if (/Android/.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Win/.test(ua)) return 'windows';
  if (/Mac/.test(ua)) return 'mac';
  if (/Linux/.test(ua)) return 'linux';

  return 'desktop';
};

/**
 * Check if device supports file input capture
 */
export const supportsFileCapture = (): boolean => {
  if (typeof window === 'undefined') return false;
  const input = document.createElement('input');
  return 'capture' in input;
};

/**
 * Check if device supports drag and drop
 */
export const supportsDragAndDrop = (): boolean => {
  if (typeof window === 'undefined') return false;
  const div = document.createElement('div');
  return 'draggable' in div || ('ondrop' in window && 'ondragend' in window);
};

/**
 * Check if device is iPad (often treated as desktop but is mobile)
 */
export const isIPad = (): boolean => {
  if (typeof window === 'undefined') return false;

  return /iPad/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Get screen size category
 */
export const getScreenSize = (): 'small' | 'medium' | 'large' => {
  if (typeof window === 'undefined') return 'medium';

  const width = window.innerWidth;
  if (width < 768) return 'small';
  if (width < 1024) return 'medium';
  return 'large';
};

/**
 * Check if device has touch capability
 */
export const hasTouchCapability = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

/**
 * Get optimal file accept formats based on device
 */
export const getFileAcceptFormats = (): string => {
  const device = getDeviceType();

  // Mobile devices can handle all formats
  // Desktop defaults to same
  return '.csv,.vcf';
};

/**
 * Get file input attributes based on device
 */
export const getFileInputAttributes = () => {
  const device = getDeviceType();
  const mobile = isMobileDevice();

  return {
    accept: '.csv,.vcf',
    capture: mobile ? 'user' : undefined,
    multiple: true,
    webkitdirectory: false
  };
};

/**
 * Device capabilities object
 */
export const getDeviceCapabilities = () => {
  return {
    isMobile: isMobileDevice(),
    isIPad: isIPad(),
    deviceType: getDeviceType(),
    supportsCapture: supportsFileCapture(),
    supportsDragDrop: supportsDragAndDrop(),
    hasTouch: hasTouchCapability(),
    screenSize: getScreenSize(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : ''
  };
};

/**
 * Optimize file input for current device
 */
export const optimizeFileInput = (inputElement: HTMLInputElement): void => {
  const capabilities = getDeviceCapabilities();

  if (capabilities.isMobile) {
    // Mobile optimization
    inputElement.multiple = true;
    if (capabilities.supportsCapture) {
      inputElement.capture = 'user';
    }
  } else {
    // Desktop optimization
    inputElement.multiple = true;
  }

  inputElement.accept = getFileAcceptFormats();
};

export default {
  isMobileDevice,
  getDeviceType,
  supportsFileCapture,
  supportsDragAndDrop,
  isIPad,
  getScreenSize,
  hasTouchCapability,
  getFileAcceptFormats,
  getFileInputAttributes,
  getDeviceCapabilities,
  optimizeFileInput
};

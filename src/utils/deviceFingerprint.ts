/**
 * Device Fingerprinting Utility
 * 
 * Generates a simple device fingerprint for rate limiting purposes.
 * Uses browser characteristics to create a unique identifier.
 */

/**
 * Generate a device fingerprint
 * Returns a hash string based on browser characteristics
 */
export const generateDeviceFingerprint = async (): Promise<string> => {
  const components: string[] = [];

  // Screen resolution
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform);

  // User agent (first 50 chars to avoid too much variation)
  components.push(navigator.userAgent.substring(0, 50));

  // Hardware concurrency
  if (navigator.hardwareConcurrency) {
    components.push(navigator.hardwareConcurrency.toString());
  }

  // Canvas fingerprint (simple version)
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      const canvasData = canvas.toDataURL();
      // Use first 100 chars of canvas data
      components.push(canvasData.substring(0, 100));
    }
  } catch (e) {
    // Canvas not available, skip
  }

  // Combine all components
  const fingerprintString = components.join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
};

/**
 * Get device fingerprint synchronously (cached version)
 */
let cachedFingerprint: string | null = null;

export const getDeviceFingerprint = async (): Promise<string> => {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }
  
  cachedFingerprint = await generateDeviceFingerprint();
  return cachedFingerprint;
};

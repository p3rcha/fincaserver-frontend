import { useCallback, useEffect, useRef } from 'react';
import Tebex from '@tebexio/tebex.js';

type CheckoutColorName = 'primary' | 'secondary' | 'background' | 'surface' | 'surface-variant' | 'success' | 'warning' | 'error' | 'green' | 'red' | 'fields' | 'field-border';

export interface TebexCheckoutConfig {
  theme?: 'light' | 'dark' | 'auto';
  colors?: Array<{ name: CheckoutColorName; color: string }>;
  locale?: string;
}

export interface TebexCheckoutEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onPaymentComplete?: (event: Event) => void;
  onPaymentError?: (event: Event) => void;
}

interface UseTebexCheckoutOptions extends TebexCheckoutConfig, TebexCheckoutEvents {}

/**
 * Custom hook for Tebex.js checkout integration
 * Provides a clean TypeScript interface for the Tebex checkout modal
 * 
 * @see https://docs.tebex.io/developers/tebex.js/integration
 */
export const useTebexCheckout = (options: UseTebexCheckoutOptions = {}) => {
  const { 
    theme = 'dark',
    colors = [
      { name: 'primary', color: '#228B22' },    // tropical-green
      { name: 'secondary', color: '#10B981' },  // tropical-emerald
    ],
    locale = 'es_ES',
    onOpen,
    onClose,
    onPaymentComplete,
    onPaymentError,
  } = options;

  const isInitialized = useRef(false);

  // Set up event listeners
  useEffect(() => {
    if (isInitialized.current) return;

    // Register event handlers
    if (onOpen) {
      Tebex.checkout.on('open', onOpen);
    }

    if (onClose) {
      Tebex.checkout.on('close', onClose);
    }

    if (onPaymentComplete) {
      Tebex.checkout.on('payment:complete', onPaymentComplete);
    }

    if (onPaymentError) {
      Tebex.checkout.on('payment:error', onPaymentError);
    }

    isInitialized.current = true;

    // Cleanup is not needed as Tebex.js manages its own lifecycle
  }, [onOpen, onClose, onPaymentComplete, onPaymentError]);

  /**
   * Initialize and launch the Tebex checkout modal
   * @param basketIdent - The basket identifier from the Headless API
   */
  const launchCheckout = useCallback((basketIdent: string) => {
    if (!basketIdent) {
      console.error('Basket ident is required to launch checkout');
      return;
    }

    // Initialize checkout with configuration
    Tebex.checkout.init({
      ident: basketIdent,
      theme,
      colors,
      locale,
    });

    // Launch the checkout modal
    Tebex.checkout.launch();
  }, [theme, colors, locale]);

  /**
   * Close the checkout modal programmatically
   */
  const closeCheckout = useCallback(() => {
    Tebex.checkout.close();
  }, []);

  return {
    launchCheckout,
    closeCheckout,
  };
};

export default useTebexCheckout;


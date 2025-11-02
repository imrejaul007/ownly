// Currency configuration and conversion utilities

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP' | 'INR';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateToAED: number; // Conversion rate to AED (base currency)
}

// All deals are stored in AED, these are fixed conversion rates
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    rateToAED: 1, // Base currency
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    rateToAED: 3.67, // 1 USD = 3.67 AED
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rateToAED: 4.02, // 1 EUR = 4.02 AED
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    rateToAED: 4.68, // 1 GBP = 4.68 AED
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    rateToAED: 0.044, // 1 INR = 0.044 AED
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'AED';

/**
 * Convert amount from AED to target currency
 */
export function convertFromAED(amountInAED: number, targetCurrency: CurrencyCode): number {
  if (targetCurrency === 'AED') return amountInAED;

  const currency = CURRENCIES[targetCurrency];
  return amountInAED / currency.rateToAED;
}

/**
 * Convert amount from source currency to AED
 */
export function convertToAED(amount: number, sourceCurrency: CurrencyCode): number {
  if (sourceCurrency === 'AED') return amount;

  const currency = CURRENCIES[sourceCurrency];
  return amount * currency.rateToAED;
}

/**
 * Helper function to format number with K/M notation
 */
function formatNumberWithSuffix(num: number, decimals: number = 0): string {
  const absNum = Math.abs(num);

  // For millions (1,000,000+)
  if (absNum >= 1000000) {
    const millions = num / 1000000;
    return `${millions.toFixed(decimals === 0 ? 1 : decimals)}M`;
  }

  // For thousands (1,000+)
  if (absNum >= 1000) {
    const thousands = num / 1000;
    return `${thousands.toFixed(decimals === 0 ? 1 : decimals)}K`;
  }

  // For smaller numbers, use regular formatting
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency amount with proper symbol and formatting
 */
export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
    useCompact?: boolean;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals = 0,
    useCompact = true,
  } = options;

  const currencyInfo = CURRENCIES[currency];

  // Use compact notation (K/M) by default for large numbers
  const formattedAmount = useCompact
    ? formatNumberWithSuffix(amount, decimals)
    : amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  if (showCode) {
    return `${formattedAmount} ${currencyInfo.code}`;
  }

  if (showSymbol) {
    // For INR and USD, put symbol before amount
    if (currency === 'INR' || currency === 'USD') {
      return `${currencyInfo.symbol}${formattedAmount}`;
    }
    // For EUR and GBP, put symbol before amount
    if (currency === 'EUR' || currency === 'GBP') {
      return `${currencyInfo.symbol}${formattedAmount}`;
    }
    // For AED, put code after amount
    return `${formattedAmount} ${currencyInfo.symbol}`;
  }

  return formattedAmount;
}

/**
 * Get all available currencies as array
 */
export function getAllCurrencies(): Currency[] {
  return Object.values(CURRENCIES);
}

/**
 * Get currency by code
 */
export function getCurrency(code: CurrencyCode): Currency {
  return CURRENCIES[code];
}

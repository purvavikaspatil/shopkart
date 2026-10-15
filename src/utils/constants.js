/** App-wide constants. Keep magic strings and numbers out of components. */

export const APP_NAME = 'ShopNest';
export const APP_TAGLINE = 'Everyday essentials, premium picks';
export const SUPPORT_EMAIL = 'care@shopnest.in';
export const SUPPORT_PHONE = '1800 200 4455';
export const SUPPORT_HOURS = 'Mon-Sat, 9:00 AM - 9:00 PM IST';

/** localStorage keys - namespaced so they never clash with other apps. */
export const STORAGE_KEYS = {
  cart: 'shopnest.cart',
  savedForLater: 'shopnest.savedForLater',
  wishlist: 'shopnest.wishlist',
  compare: 'shopnest.compare',
  recentlyViewed: 'shopnest.recentlyViewed',
  recentSearches: 'shopnest.recentSearches',
  auth: 'shopnest.auth',
  orders: 'shopnest.orders',
  addresses: 'shopnest.addresses',
  cards: 'shopnest.cards',
  notifications: 'shopnest.notifications',
  reviews: 'shopnest.reviews',
  returns: 'shopnest.returns',
  themeMode: 'shopnest.themeMode',
  settings: 'shopnest.settings',
};

/** Free-shipping threshold and flat fees, in INR. */
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEES = { standard: 49, express: 99, sameday: 199 };
export const TAX_RATE = 0.05; // 5% mock GST applied on the discounted subtotal.
export const COD_FEE = 29;
export const MAX_COMPARE_ITEMS = 4;
export const MAX_RECENTLY_VIEWED = 12;
export const PRODUCTS_PER_PAGE = 12;

export const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard delivery', days: '4-6 business days', fee: SHIPPING_FEES.standard, note: 'Free above INR 999' },
  { id: 'express', label: 'Express delivery', days: '2-3 business days', fee: SHIPPING_FEES.express, note: 'Priority handling' },
  { id: 'sameday', label: 'Same-day delivery', days: 'Today, before 10 PM', fee: SHIPPING_FEES.sameday, note: 'Select metro pincodes' },
];

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / debit card', hint: 'Visa, Mastercard, RuPay, Amex' },
  { id: 'upi', label: 'UPI', hint: 'GPay, PhonePe, Paytm, BHIM' },
  { id: 'netbanking', label: 'Net banking', hint: '50+ banks supported' },
  { id: 'cod', label: 'Cash on delivery', hint: `Handling fee INR ${COD_FEE}` },
];

export const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'IndusInd Bank', 'Punjab National Bank'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Customer rating' },
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Most popular' },
  { value: 'discount', label: 'Biggest discount' },
];

/** Order lifecycle, in the order the tracking timeline renders. */
export const ORDER_STAGES = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

export const ORDER_STATUS = {
  PLACED: 'Placed',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

export const RETURN_REASONS = [
  'Item damaged or defective',
  'Wrong item delivered',
  'Size or fit issue',
  'Quality not as expected',
  'Item no longer needed',
  'Better price available elsewhere',
];

export const CURRENCIES = [
  { code: 'INR', symbol: 'INR', label: 'Indian Rupee' },
  { code: 'USD', symbol: 'USD', label: 'US Dollar' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham' },
];

export const LANGUAGES = ['English', 'हिन्दी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी', 'ಕನ್ನಡ'];

export const DEMO_CREDENTIALS = { email: 'demo@example.com', password: 'password123' };

/** Pincodes that the mock delivery checker treats as serviceable same-day. */
export const METRO_PINCODES = ['560001', '560034', '110001', '400001', '600001', '700001', '500001'];

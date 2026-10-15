/**
 * In-memory data store for fallback/offline mode and quick data seeding.
 * Contains:
 * - 200 Products across 10 categories (from crazy.json)
 * - 10 Categories with metadata
 * - 4 Users (1 Admin + 3 Customers)
 * - Dummy Orders, Coupons, Reviews, Addresses, Cards, Blog Posts, Help Topics
 */

const bcrypt = require('bcryptjs');
const crazyData = require('./crazy.json');
const testimonialsData = require('../seed/testimonials.json');

// --- 1. 10 Categories ---
const CATEGORIES = [
  {
    name: 'Clothing',
    slug: 'clothing',
    icon: 'Checkroom',
    tagline: 'Everyday staples and weekend statement pieces',
    description: 'Fabric weights, fit notes and size charts on every item. Quality stitching and breathable materials.',
    color: '#B4456F',
    banner: 'clothing-hero',
    subcategories: ['Men', 'Women', 'Kids', 'Activewear', 'Ethnic Wear'],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Devices',
    tagline: 'Audio, cameras, accessories and smart tech',
    description: 'Hand-picked electronics from verified manufacturers with full warranty support.',
    color: '#3D48D6',
    banner: 'electronics-hero',
    subcategories: ['Headphones', 'Cameras', 'Smart Watches', 'Audio', 'Accessories'],
  },
  {
    name: 'Mobiles',
    slug: 'mobiles',
    icon: 'Smartphone',
    tagline: 'Latest 5G smartphones and dependable daily drivers',
    description: 'From flagship performance monsters to long-battery budget champions.',
    color: '#0284C7',
    banner: 'mobiles-hero',
    subcategories: ['Smartphones', 'Flagships', 'Budget Phones', 'Accessories'],
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    icon: 'LaptopMac',
    tagline: 'Creator ultrabooks, gaming beasts and office workhorses',
    description: 'High refresh rate displays, long battery endurance, and top-tier silicon.',
    color: '#4F46E5',
    banner: 'laptops-hero',
    subcategories: ['Ultrabooks', 'Gaming Laptops', 'Office Laptops', 'Creator Editions'],
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    icon: 'RollerSkating',
    tagline: 'Sneakers, formal shoes, trainers and slip-ons',
    description: 'Cushioned soles, premium leathers, and ergonomic fits for all-day comfort.',
    color: '#EA580C',
    banner: 'footwear-hero',
    subcategories: ['Sneakers', 'Running Shoes', 'Formal Shoes', 'Sandals', 'Boots'],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: 'Kitchen',
    tagline: 'Cookware, appliances and everyday home essentials',
    description: 'Durable cookware, precision small appliances, and smart dining essentials.',
    color: '#D97706',
    banner: 'kitchen-hero',
    subcategories: ['Cookware', 'Small Appliances', 'Storage', 'Dining', 'Bakeware'],
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    icon: 'Spa',
    tagline: 'Skincare, haircare, grooming and fragrances',
    description: 'Full ingredient transparency, cruelty-free formulas, and dermatologist-tested care.',
    color: '#DB2777',
    banner: 'beauty-hero',
    subcategories: ['Skincare', 'Haircare', 'Fragrance', 'Grooming', 'Bath & Body'],
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    icon: 'FitnessCenter',
    tagline: 'Gym equipment, sports gear and recovery essentials',
    description: 'Tested fitness gear built for heavy workouts, running tracks, and athletic endurance.',
    color: '#16A34A',
    banner: 'sports-hero',
    subcategories: ['Fitness Equipment', 'Yoga & Pilates', 'Outdoor & Camping', 'Sportswear'],
  },
  {
    name: 'Books',
    slug: 'books',
    icon: 'AutoStories',
    tagline: 'Bestselling fiction, business, self-help and classics',
    description: 'Curated titles for avid readers, curious minds, and continuous learners.',
    color: '#7C3AED',
    banner: 'books-hero',
    subcategories: ['Fiction', 'Non-Fiction', 'Business & Tech', 'Biographies', 'Self-Help'],
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    icon: 'Chair',
    tagline: 'Solid wood tables, ergonomic seating and modern storage',
    description: 'Solid teak and oak, ergonomic office chairs, modular wardrobes, and living room lounges.',
    color: '#9333EA',
    banner: 'furniture-hero',
    subcategories: ['Chairs', 'Tables', 'Sofas', 'Beds', 'Office Furniture', 'Storage'],
  },
];

// --- 2. 200 Products from crazy.json with generated IDs for Mongo compatibility ---
const rawProducts = crazyData.products || [];
const PRODUCTS = rawProducts.map((p, index) => {
  const hexIndex = (index + 1).toString(16).padStart(4, '0');
  const id = `507f1f77bcf86cd79943${hexIndex}`; // standard 24-char hex Mongo ObjectId shape
  return {
    ...p,
    _id: id,
    id: id,
    discount: p.discount || (p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0),
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 24,
    stock: p.stock ?? 15,
    deliveryDays: p.deliveryDays || 3,
    addedAt: p.addedAt ? new Date(p.addedAt) : new Date(Date.now() - (index * 86400000)),
  };
});

// --- 3. 4 Users (1 Admin + 3 Customers) ---
const USERS = [
  {
    _id: '660f1f77bcf86cd799430001',
    firstName: 'Parth',
    lastName: 'Abhale',
    email: 'abhale.parth07@gmail.com',
    passwordPlain: 'Parth@1234',
    password: bcrypt.hashSync('Parth@1234', 10),
    phoneNumber: 9876543210,
    role: 'admin',
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/shopnest-parth/200/200',
    dob: '1998-05-12',
    createdAt: new Date('2023-01-15T08:00:00.000Z'),
  },
  {
    _id: '660f1f77bcf86cd799430002',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'demo@example.com',
    passwordPlain: 'password123',
    password: bcrypt.hashSync('password123', 10),
    phoneNumber: 9845012345,
    role: 'customer',
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/shopnest-aarav/200/200',
    dob: '1994-03-17',
    createdAt: new Date('2023-03-20T10:00:00.000Z'),
  },
  {
    _id: '660f1f77bcf86cd799430003',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    passwordPlain: 'password123',
    password: bcrypt.hashSync('password123', 10),
    phoneNumber: 9845012346,
    role: 'customer',
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/shopnest-priya/200/200',
    dob: '1996-07-22',
    createdAt: new Date('2023-05-11T12:00:00.000Z'),
  },
  {
    _id: '660f1f77bcf86cd799430004',
    firstName: 'Rohan',
    lastName: 'Mehta',
    email: 'rohan.mehta@example.com',
    passwordPlain: 'password123',
    password: bcrypt.hashSync('password123', 10),
    phoneNumber: 9845012347,
    role: 'customer',
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/shopnest-rohan/200/200',
    dob: '1992-11-04',
    createdAt: new Date('2023-08-01T15:30:00.000Z'),
  },
];

// --- 4. Dummy Coupons ---
const daysFromNow = (n) => new Date(Date.now() + n * 86400000);
const COUPONS = [
  { code: 'WELCOME10', title: '10% off your first order', type: 'percent', value: 10, maxDiscount: 800, minOrder: 999, expiresAt: daysFromNow(45), description: 'Applies to entire catalogue. One use per account.', category: 'All categories' },
  { code: 'NEST500', title: 'Flat INR 500 off above INR 4,999', type: 'flat', value: 500, minOrder: 4999, expiresAt: daysFromNow(21), description: 'Stacks with product-level discounts.', category: 'All categories' },
  { code: 'TECH15', title: '15% off electronics & laptops', type: 'percent', value: 15, maxDiscount: 3000, minOrder: 9999, expiresAt: daysFromNow(12), description: 'Valid on laptops, mobiles, and electronics.', category: 'Electronics' },
  { code: 'STYLE25', title: '25% off clothing & footwear', type: 'percent', value: 25, maxDiscount: 1500, minOrder: 2499, expiresAt: daysFromNow(7), description: 'Applies to clothing and footwear items.', category: 'Clothing' },
  { code: 'HOME1000', title: 'Flat INR 1,000 off furniture', type: 'flat', value: 1000, minOrder: 12999, expiresAt: daysFromNow(30), description: 'Valid on living room and office furniture.', category: 'Furniture' },
  { code: 'FRESH20', title: '20% off home & kitchen', type: 'percent', value: 20, maxDiscount: 400, minOrder: 799, expiresAt: daysFromNow(15), description: 'Pantry, cookware, and dining sets.', category: 'Home & Kitchen' },
];

// --- 5. Dummy Addresses ---
const ADDRESSES = [
  {
    _id: '660f1f77bcf86cd799431001',
    user: USERS[1]._id,
    label: 'Home',
    fullName: 'Aarav Sharma',
    phone: '9845012345',
    line1: '412, Brigade Palm Court',
    line2: 'Yelahanka New Town',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560064',
    isDefault: true,
  },
  {
    _id: '660f1f77bcf86cd799431002',
    user: USERS[1]._id,
    label: 'Work',
    fullName: 'Aarav Sharma',
    phone: '9845012345',
    line1: 'Level 6, Prestige Tech Park',
    line2: 'Marathahalli Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    isDefault: false,
  },
  {
    _id: '660f1f77bcf86cd799431003',
    user: USERS[0]._id, // Admin Parth
    label: 'HQ Office',
    fullName: 'Parth Abhale',
    phone: '9876543210',
    line1: 'ShopNest Tower, 8th Floor',
    line2: 'Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    isDefault: true,
  },
];

// --- 6. Dummy Cards ---
const CARDS = [
  {
    _id: '660f1f77bcf86cd799432001',
    user: USERS[1]._id,
    last4: '4521',
    brand: 'Visa',
    holder: 'Aarav Sharma',
    expiry: '08/29',
    isDefault: true,
  },
  {
    _id: '660f1f77bcf86cd799432002',
    user: USERS[1]._id,
    last4: '8830',
    brand: 'Mastercard',
    holder: 'Aarav Sharma',
    expiry: '02/28',
    isDefault: false,
  },
];

// --- 7. Dummy Orders ---
const makeTimeline = (status, date) => {
  const STAGES = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  const statusIdx = STAGES.indexOf(status);
  const base = new Date(date).getTime();
  return STAGES.map((s, i) => ({
    stage: s,
    at: new Date(base + i * 24 * 3600000),
    location: i === 0 ? 'Order placed online' : 'Central Fulfillment Centre, Bengaluru',
    done: statusIdx >= 0 ? i <= statusIdx : false,
    current: i === statusIdx,
  }));
};

const sampleP1 = PRODUCTS[0];
const sampleP2 = PRODUCTS[1] || PRODUCTS[0];
const sampleP3 = PRODUCTS[10] || PRODUCTS[0];

const ORDERS = [
  {
    _id: '660f1f77bcf86cd799433001',
    user: USERS[1]._id,
    items: [
      { productId: sampleP1._id, title: sampleP1.title, brand: sampleP1.brand, thumbnail: sampleP1.thumbnail, price: sampleP1.price, originalPrice: sampleP1.originalPrice, quantity: 1, color: sampleP1.colors?.[0], size: sampleP1.sizes?.[0] },
      { productId: sampleP2._id, title: sampleP2.title, brand: sampleP2.brand, thumbnail: sampleP2.thumbnail, price: sampleP2.price, originalPrice: sampleP2.originalPrice, quantity: 2, color: sampleP2.colors?.[1], size: sampleP2.sizes?.[1] },
    ],
    address: ADDRESSES[0],
    delivery: { id: 'express', label: 'Express delivery', days: '2-3 business days', fee: 99, note: 'Priority handling' },
    payment: { id: 'upi', label: 'UPI (GPay / PhonePe)' },
    totals: { subtotal: sampleP1.price + sampleP2.price * 2, discount: 500, deliveryFee: 99, tax: 200, total: sampleP1.price + sampleP2.price * 2 - 500 + 99 + 200 },
    status: 'Out for delivery',
    trackingNumber: 'SN-TRK-984219',
    partner: 'NestExpress',
    estimatedDelivery: new Date(Date.now() + 86400000),
    invoiceNumber: 'INV-4K2P91',
    createdAt: new Date(Date.now() - 2 * 86400000),
    timeline: makeTimeline('Out for delivery', Date.now() - 2 * 86400000),
  },
  {
    _id: '660f1f77bcf86cd799433002',
    user: USERS[1]._id,
    items: [
      { productId: sampleP3._id, title: sampleP3.title, brand: sampleP3.brand, thumbnail: sampleP3.thumbnail, price: sampleP3.price, originalPrice: sampleP3.originalPrice, quantity: 1 },
    ],
    address: ADDRESSES[0],
    delivery: { id: 'standard', label: 'Standard delivery', days: '4-6 business days', fee: 0, note: 'Free delivery' },
    payment: { id: 'card', label: 'Visa ending in 4521' },
    totals: { subtotal: sampleP3.price, discount: 200, deliveryFee: 0, tax: 150, total: sampleP3.price - 200 + 150 },
    status: 'Delivered',
    trackingNumber: 'SN-TRK-741285',
    partner: 'BlueTrail Logistics',
    estimatedDelivery: new Date(Date.now() - 5 * 86400000),
    invoiceNumber: 'INV-8M3X22',
    createdAt: new Date(Date.now() - 10 * 86400000),
    timeline: makeTimeline('Delivered', Date.now() - 10 * 86400000),
  },
];

// --- 8. Dummy Reviews ---
const REVIEWS = PRODUCTS.slice(0, 15).map((prod, idx) => ({
  _id: `660f1f77bcf86cd7994340${idx.toString(16).padStart(2, '0')}`,
  user: USERS[idx % USERS.length]._id,
  product: prod._id,
  productTitle: prod.title,
  thumbnail: prod.thumbnail,
  rating: 5 - (idx % 2),
  title: idx % 2 === 0 ? 'Exceeded my expectations!' : 'Solid value for money',
  body: 'Ordered and arrived in 2 days. The material quality and build matches the description exactly.',
  verified: true,
  helpfulCount: 14 + idx * 3,
  createdAt: new Date(Date.now() - (idx + 1) * 3 * 86400000),
}));

// --- 9. Dummy Blog Posts ---
const BLOG_POSTS = [
  {
    title: 'How to Build a Timeless Capsule Wardrobe on a Budget',
    slug: 'capsule-wardrobe-guide',
    category: 'Style & Trends',
    author: 'Meera Nambiar',
    readMinutes: 6,
    excerpt: 'Ten versatile pieces you can mix and match for every season without breaking the bank.',
    body: [
      'A capsule wardrobe is not about wearing the same boring outfit every day — it is about owning versatile, high-quality staples that effortlessly combine.',
      'Start with a neutral foundation: classic cotton tees, tailored chinos, a crisp white button-down, and comfortable low-top sneakers.',
    ],
    coverImage: 'https://picsum.photos/seed/shopnest-blog-capsule/800/450',
    tags: ['fashion', 'wardrobe', 'minimalism'],
    publishedAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    title: 'Smart Tech Buying Guide 2026: Choosing the Right Everyday Laptop',
    slug: 'everyday-laptop-buying-guide-2026',
    category: 'Technology',
    author: 'Karan Mehra',
    readMinutes: 8,
    excerpt: 'What to look for in processors, battery endurance, and display quality before you spend your hard-earned money.',
    body: [
      'Finding the sweet spot between performance, thermals, and battery life is simpler than ever in 2026.',
      'For general productivity and coding, 16 GB of RAM and 512 GB NVMe storage is the new baseline standard.',
    ],
    coverImage: 'https://picsum.photos/seed/shopnest-blog-laptop/800/450',
    tags: ['tech', 'laptops', 'buying guide'],
    publishedAt: new Date(Date.now() - 14 * 86400000),
  },
];

// --- 10. Dummy Help Topics ---
const HELP_TOPICS = [
  {
    id: 'orders',
    label: 'Orders & Tracking',
    icon: 'LocalShipping',
    faqs: [
      { q: 'How do I track my order?', a: 'Once your order ships, go to Account > Orders and click Track Order to see live tracking updates.' },
      { q: 'Can I cancel an order after placing it?', a: 'Yes, orders can be cancelled immediately from your Orders page before they enter the "Shipped" status.' },
    ],
  },
  {
    id: 'payments',
    label: 'Payments & Refunds',
    icon: 'Payment',
    faqs: [
      { q: 'What payment methods are supported?', a: 'We support all major Credit/Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery.' },
      { q: 'How long do refunds take to process?', a: 'Refunds for returned items are credited back to your original payment method within 3 to 5 business days.' },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & Exchanges',
    icon: 'Autorenew',
    faqs: [
      { q: 'What is your return policy?', a: 'We offer an easy 7-day return policy on eligible items with doorstep pickup arranged at no extra cost.' },
    ],
  },
];

module.exports = {
  CATEGORIES,
  PRODUCTS,
  USERS,
  COUPONS,
  ADDRESSES,
  CARDS,
  ORDERS,
  REVIEWS,
  BLOG_POSTS,
  HELP_TOPICS,
  TESTIMONIALS: testimonialsData,
};

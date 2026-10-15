import { products } from './products';
import { seededRandom } from '@/utils/helpers';

/**
 * Secondary mock content: reviews, coupons, testimonials, notifications and
 * the seed rows a brand-new demo account starts with.
 *
 * Everything is generated from a fixed seed so the store looks identical on
 * every reload - a moving target makes UI work impossible to review.
 */

const REVIEWER_NAMES = [
  'Aarav Sharma', 'Diya Nair', 'Rohan Mehta', 'Ishita Banerjee', 'Kabir Singh',
  'Ananya Rao', 'Vivek Iyer', 'Meera Joshi', 'Arjun Patel', 'Sana Qureshi',
  'Nikhil Reddy', 'Tara Desai', 'Aditya Kulkarni', 'Priya Menon', 'Farhan Ali',
  'Rhea Kapoor', 'Siddharth Bose', 'Neha Gupta', 'Manav Chawla', 'Kavya Pillai',
];

const REVIEW_TITLES = {
  5: ['Exactly what was described', 'Worth every rupee', 'Better than I expected', 'Would buy again', 'Excellent build quality'],
  4: ['Very good, one small niggle', 'Happy with the purchase', 'Solid for the price', 'Does the job well'],
  3: ['Decent, but not remarkable', 'Fine for casual use', 'Mixed feelings', 'Okay for the price'],
  2: ['Not quite what I hoped', 'Some real issues', 'Disappointed by the finish'],
  1: ['Did not work out', 'Returned it'],
};

const REVIEW_BODIES = {
  5: [
    'Delivered two days ahead of the estimate and the packaging was proper - nothing rattling around. Using it daily for three weeks now with no complaints at all.',
    'I compared this against two pricier options in a store before ordering and honestly could not tell the difference in quality. Very happy I saved the money.',
    'The listing description matched reality exactly, which is rarer than it should be. Even the weight was accurate to the gram.',
    'Second one I have bought - the first was a gift and the person liked it enough that I got one for myself.',
  ],
  4: [
    'Really good overall. My only note is that the colour is a shade darker than the photos suggest, though I actually prefer it this way.',
    'Works exactly as advertised. Knocking off a star only because delivery took a day longer than the estimate showed at checkout.',
    'Great quality for the money. The instructions could be clearer but it took ten minutes to figure out.',
    'Very pleased. Would have liked a carry pouch included at this price, but that is a minor thing.',
  ],
  3: [
    'It does what it says. Nothing about it stands out either way - if you find it on discount it is a reasonable buy.',
    'Fine for light use. I would not rely on it for anything demanding, but for occasional use it is adequate.',
    'Average. The finish is good but the performance is middle of the road compared to what I had before.',
  ],
  2: [
    'The build feels flimsier than the photos suggest. Support was responsive when I asked about it, so two stars rather than one.',
    'Started showing wear within a fortnight of normal use. Expected more at this price point.',
  ],
  1: [
    'Arrived with a defect and I sent it back. The return pickup was smooth at least, and the refund came through in four days.',
  ],
};

const IMAGES_HINTS = ['Photo attached', null, null, null];

/**
 * Builds a deterministic review list for a product.
 * The rating spread is weighted toward the product's own average, so a 4.7
 * product does not end up with a wall of two-star reviews.
 */
function buildReviews(product) {
  const rand = seededRandom(product.slug);
  const count = Math.max(4, Math.min(14, Math.round(product.reviewCount / 260) + 4));
  const reviews = [];

  for (let i = 0; i < count; i += 1) {
    // Bias the rating toward the product average with a small random spread.
    const noise = (rand() - 0.5) * 2.2;
    const rating = Math.max(1, Math.min(5, Math.round(product.rating + noise)));
    const name = REVIEWER_NAMES[Math.floor(rand() * REVIEWER_NAMES.length)];
    const daysAgo = Math.floor(rand() * 240) + 2;

    reviews.push({
      id: `${product.id}-r${i + 1}`,
      productId: product.id,
      author: name,
      rating,
      title: REVIEW_TITLES[rating][Math.floor(rand() * REVIEW_TITLES[rating].length)],
      body: REVIEW_BODIES[rating][Math.floor(rand() * REVIEW_BODIES[rating].length)],
      verified: rand() > 0.18,
      helpfulCount: Math.floor(rand() * 84),
      photoNote: IMAGES_HINTS[Math.floor(rand() * IMAGES_HINTS.length)],
      photos: rand() > 0.75
        ? [1, 2].map((n) => `https://picsum.photos/seed/shopnest-rev-${product.slug}-${i}-${n}/240/240`)
        : [],
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  }

  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Review index keyed by product id. Built once at module load. */
export const reviewsByProduct = products.reduce((acc, p) => {
  acc[p.id] = buildReviews(p);
  return acc;
}, {});

/**
 * Rating histogram (5 -> 1) derived from the generated reviews, used by the
 * rating-breakdown bars on the product page.
 */
export function getRatingBreakdown(productId) {
  const list = reviewsByProduct[productId] ?? [];
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  list.forEach((r) => { counts[r.rating] += 1; });
  const total = list.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: Math.round((counts[star] / total) * 100),
  }));
}

/* ------------------------------------------------------------------ */
/* Coupons                                                             */
/* ------------------------------------------------------------------ */

const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString();

export const coupons = [
  { code: 'WELCOME10', title: '10% off your first order', type: 'percent', value: 10, maxDiscount: 800, minOrder: 999, expiresAt: daysFromNow(45), description: 'Applies to everything except grocery. One use per account.', category: 'All categories' },
  { code: 'NEST500', title: 'Flat INR 500 off above INR 4,999', type: 'flat', value: 500, minOrder: 4999, expiresAt: daysFromNow(21), description: 'Stacks with product-level discounts already shown.', category: 'All categories' },
  { code: 'TECH15', title: '15% off electronics', type: 'percent', value: 15, maxDiscount: 3000, minOrder: 9999, expiresAt: daysFromNow(12), description: 'Valid on phones, laptops, audio and cameras.', category: 'Electronics' },
  { code: 'STYLE25', title: '25% off fashion', type: 'percent', value: 25, maxDiscount: 1500, minOrder: 2499, expiresAt: daysFromNow(7), description: 'Clothing, shoes, bags and accessories.', category: 'Fashion' },
  { code: 'HOME1000', title: 'Flat INR 1,000 off furniture', type: 'flat', value: 1000, minOrder: 12999, expiresAt: daysFromNow(30), description: 'Furniture and lighting only.', category: 'Home & Living' },
  { code: 'FRESH20', title: '20% off grocery', type: 'percent', value: 20, maxDiscount: 400, minOrder: 799, expiresAt: daysFromNow(5), description: 'Pantry staples, coffee, tea and snacks.', category: 'Grocery' },
  { code: 'BIGDAY30', title: '30% off, sale weekend', type: 'percent', value: 30, maxDiscount: 5000, minOrder: 4999, expiresAt: daysFromNow(-3), description: 'This sale has ended. Watch the deals page for the next one.', category: 'All categories' },
  { code: 'MONSOON15', title: '15% off rainwear', type: 'percent', value: 15, maxDiscount: 900, minOrder: 1999, expiresAt: daysFromNow(-18), description: 'Expired at the end of the monsoon campaign.', category: 'Fashion' },
].map((c) => ({ ...c, isExpired: new Date(c.expiresAt) < new Date() }));

/* ------------------------------------------------------------------ */
/* Testimonials, notifications and account seed data                   */
/* ------------------------------------------------------------------ */

export const testimonials = [
  { id: 1, name: 'Shruti Kulkarni', role: 'Shopping with us since 2022', rating: 5, quote: 'The thing that keeps me here is that the delivery estimate is honest. If it says Thursday, it arrives Thursday, and on the two occasions it slipped I got a message before I had to ask.', avatarSeed: 'shruti' },
  { id: 2, name: 'Devang Shah', role: '48 orders', rating: 5, quote: 'I returned a pair of shoes that did not fit and the pickup happened the next morning. Refund was in my account before the courier had even scanned it back in.', avatarSeed: 'devang' },
  { id: 3, name: 'Anjali Verma', role: 'Verified buyer', rating: 4, quote: 'Product pages actually list fabric weights and dimensions instead of adjectives. It has cut my returns down to almost nothing because I know what I am ordering.', avatarSeed: 'anjali' },
  { id: 4, name: 'Rakesh Iyengar', role: 'Shopping with us since 2021', rating: 5, quote: 'Bought a coffee table, a chair and two lamps over eighteen months. Everything arrived without a scratch, which is not my experience elsewhere with furniture.', avatarSeed: 'rakesh' },
  { id: 5, name: 'Nusrat Jahan', role: '12 orders', rating: 5, quote: 'Support answered a question about warranty coverage in under four minutes, on a Sunday, with an actual answer rather than a link to a policy page.', avatarSeed: 'nusrat' },
  { id: 6, name: 'Pranav Deshmukh', role: 'Verified buyer', rating: 4, quote: 'Prices are not always the lowest on the internet, but stock counts are real and I have never had an order cancelled after payment. That is worth a small premium.', avatarSeed: 'pranav' },
];

/** Notifications a fresh demo account starts with. */
export const seedNotifications = [
  { id: 'n1', type: 'order', title: 'Your order is out for delivery', body: 'Order SN-4K2P91 will reach you today between 2 PM and 6 PM.', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), read: false, link: '/orders' },
  { id: 'n2', type: 'price', title: 'Price dropped on your wishlist', body: 'Sonora Halo ANC Over-Ear Headphones is now INR 21,999, down from INR 24,499.', createdAt: new Date(Date.now() - 9 * 3600000).toISOString(), read: false, link: '/wishlist' },
  { id: 'n3', type: 'deal', title: 'Flash sale starts at 6 PM', body: 'Up to 60 percent off electronics for four hours only.', createdAt: new Date(Date.now() - 26 * 3600000).toISOString(), read: false, link: '/deals' },
  { id: 'n4', type: 'order', title: 'Order delivered', body: 'Order SN-8M3X22 was delivered on Tuesday. Tell us how it went.', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), read: true, link: '/orders' },
  { id: 'n5', type: 'account', title: 'New sign-in on Chrome, Bengaluru', body: 'If this was not you, change your password from Settings.', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), read: true, link: '/settings' },
  { id: 'n6', type: 'wishlist', title: 'Back in stock', body: 'Kaira Handloom Cotton Kurta in Indigo is available again in size M.', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), read: true, link: '/wishlist' },
  { id: 'n7', type: 'deal', title: 'Coupon expiring soon', body: 'STYLE25 gives you 25 percent off fashion and expires in 7 days.', createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), read: true, link: '/coupons' },
];

export const seedAddresses = [
  {
    id: 'addr-1', label: 'Home', isDefault: true,
    fullName: 'Aarav Sharma', phone: '9845012345',
    line1: '412, Brigade Palm Court', line2: 'Yelahanka New Town',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560064',
  },
  {
    id: 'addr-2', label: 'Work', isDefault: false,
    fullName: 'Aarav Sharma', phone: '9845012345',
    line1: 'Level 6, Prestige Tech Park', line2: 'Marathahalli Outer Ring Road',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560103',
  },
];

export const seedCards = [
  { id: 'card-1', last4: '4521', brand: 'Visa', holder: 'Aarav Sharma', expiry: '08/29', isDefault: true },
  { id: 'card-2', last4: '8830', brand: 'Mastercard', holder: 'Aarav Sharma', expiry: '02/28', isDefault: false },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];

/** Courier partners used by the mock tracking timeline. */
export const DELIVERY_PARTNERS = [
  { name: 'NestExpress', phone: '1800 200 4455' },
  { name: 'BlueTrail Logistics', phone: '1800 419 7788' },
  { name: 'Meridian Couriers', phone: '1800 266 3311' },
];

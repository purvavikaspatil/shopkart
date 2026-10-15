import { slugify } from '@/utils/format';
import { products } from './products';

/** Blog articles, help-centre FAQs and the mock analytics behind /admin. */

const articles = [
  {
    title: 'How to read a laptop spec sheet without getting lost',
    category: 'Technology',
    author: 'Ritika Menon',
    readMinutes: 7,
    publishedAt: '2026-08-28',
    excerpt: 'Clock speeds and core counts are the least useful numbers on the page. Here is what actually predicts whether a machine will feel fast in two years.',
    body: [
      'Every laptop listing leads with a processor name and a core count, and almost none of that predicts how the machine will feel on a Tuesday morning with nineteen tabs open. The numbers that matter are sustained power, memory bandwidth and how the chassis handles heat.',
      'Sustained power is the wattage a laptop can hold indefinitely, not the peak it hits for thirty seconds during a benchmark. Two machines with identical chips can differ by forty percent in real work if one of them throttles after a minute. Look for the phrase "sustained TDP" in a spec sheet, or check a review that runs a fifteen-minute render.',
      'Memory bandwidth matters more than raw capacity past 16 GB for most people. Soldered LPDDR5X at 7500 MT/s will beat socketed DDR4 at 3200 for anything touching integrated graphics, which now includes photo editing and video scrubbing.',
      'Then there is the screen, which is the part you look at for eight hours a day and the part most buyers under-weight. A 400-nit panel is unusable next to a window at noon. Sixty hertz feels sluggish once you have used 120. And a glossy finish in a room with overhead lights is a mirror.',
      'Our rule of thumb: spend on the display and the keyboard, take the middle option on the processor, and buy the storage you need up front because upgrading later is rarely as easy as the marketing suggests.',
    ],
    tags: ['laptops', 'buying guide'],
  },
  {
    title: 'Fabric weights, explained in grams',
    category: 'Fashion',
    author: 'Devika Rao',
    readMinutes: 5,
    publishedAt: '2026-08-14',
    excerpt: 'GSM is the single most useful number on a clothing label, and most stores do not print it. Here is what each range feels like on skin.',
    body: [
      'GSM stands for grams per square metre, and it tells you how much fabric is in a garment. It is the closest thing clothing has to an honest spec.',
      'Below 140 GSM you are in sheer territory. Cotton at that weight is a summer shirt you can see through in strong light. It will be cool and it will not last five years.',
      'From 140 to 180 GSM is the standard t-shirt range. Most fast-fashion tees sit at the bottom of this band, which is why they lose shape after a season. Between 180 and 220 GSM is the sweet spot for a tee you wear weekly.',
      'Above 240 GSM you are into heavyweight territory. These hold their shape, drape properly off the shoulder and cost more because there is simply more cotton in them. They also take longer to dry, which matters during a Mumbai monsoon.',
      'For denim the unit is ounces per square yard rather than GSM. Ten ounces is lightweight and comfortable immediately. Fourteen ounces is stiff for a month and then moulds to you. Anything above sixteen is a project, not a pair of jeans.',
    ],
    tags: ['fashion', 'materials'],
  },
  {
    title: 'A small-apartment furniture checklist',
    category: 'Home',
    author: 'Aniket Bhalla',
    readMinutes: 6,
    publishedAt: '2026-07-30',
    excerpt: 'Measure the lift, not just the room. Five checks that prevent a sofa becoming a very expensive doorstop.',
    body: [
      'The most common furniture return we handle is not about quality. It is a sofa that could not get into the flat.',
      'Measure the narrowest point of the journey, which is usually the lift diagonal or a landing turn, not the door. A standard Indian residential lift has an internal diagonal of about 180 cm, and a three-seater sofa is often 190 cm long before packaging.',
      'Check whether the item ships assembled. A coffee table that arrives in four pieces can go up a staircase that a built table cannot.',
      'Think about the wall behind, too. A bookshelf rated to 25 kg per shelf needs an anchor point, and drywall partitions in newer builds will not take a strap without a proper fixing.',
      'Finally, leave 60 cm of walkway between furniture pieces. It sounds generous on a floor plan and feels tight in practice, particularly around a dining table where chairs need to pull out.',
    ],
    tags: ['furniture', 'home'],
  },
  {
    title: 'Sunscreen for Indian skin tones, without the grey cast',
    category: 'Lifestyle',
    author: 'Priya Menon',
    readMinutes: 4,
    publishedAt: '2026-07-11',
    excerpt: 'Mineral filters leave a white film on deeper skin. Tinted formulations and newer filters fix it, if you know what to look for.',
    body: [
      'Zinc oxide is a physical filter that sits on the surface of skin and scatters light. That is exactly why it leaves a cast, and why deeper skin tones have historically been served badly by mineral sunscreen.',
      'Two things fix it. The first is tinting: iron oxides added to the formula counteract the white and add a slight colour that blends. The second is particle size, though micronised zinc trades some of the cast for a slightly different set of trade-offs.',
      'If you prefer chemical filters, look for newer generation options rather than the older ones that break down within two hours of sun exposure. The photostability difference is significant.',
      'Whatever you choose, the quantity is the part everyone gets wrong. Two finger-lengths for the face and neck, reapplied every two to three hours outdoors. Half the amount gives you roughly a third of the labelled protection, not half.',
    ],
    tags: ['beauty', 'skincare'],
  },
  {
    title: 'Five signs a discount is not really a discount',
    category: 'Shopping guides',
    author: 'Rahul Nanda',
    readMinutes: 5,
    publishedAt: '2026-06-22',
    excerpt: 'A struck-through price only means something if the item ever sold at it. Here is how to check.',
    body: [
      'The strikethrough price on a listing is the maximum retail price, and there is no rule saying anything was ever sold at it. A 70 percent discount from an invented number is a 0 percent discount.',
      'Check price history. Many browser extensions track this, and if a product has sat at the "sale" price for eight months, that is simply the price.',
      'Watch for bundle inflation, where a cheap accessory is added to justify a higher headline price. The bundle is worth what you would pay for each part separately, and often less.',
      'Be suspicious of countdown timers that reset. A genuine flash sale ends. A timer that restarts at midnight is a design pattern, not a deadline.',
      'Finally, compare the unit price rather than the pack price on anything consumable. A 750 g pack at a 20 percent discount is frequently more expensive per gram than the 500 g pack at full price.',
    ],
    tags: ['shopping', 'deals'],
  },
  {
    title: 'What actually matters in a pair of running shoes',
    category: 'Product guides',
    author: 'Sameer Fernandes',
    readMinutes: 6,
    publishedAt: '2026-06-05',
    excerpt: 'Pronation charts sold a lot of shoes and predicted very little. Fit, stack and drop are the three numbers worth knowing.',
    body: [
      'For twenty years running shops sorted people by pronation and sold them a matching category of shoe. The research since has been consistently unable to show that this reduces injury.',
      'What does correlate with comfort is fit. Your foot swells during a run, so shoes should have a thumb-width of space at the toe and hold securely at the midfoot without pressure.',
      'Stack height is the amount of foam under your foot. High stack, above 35 mm, protects legs on long runs and feels less connected. Low stack gives ground feel and works for shorter, faster efforts.',
      'Drop is the height difference between heel and forefoot. Eight to ten millimetres is the comfortable default. Lower drops load the calf and Achilles more, so change gradually if you switch.',
      'Rotate two pairs if you run more than four times a week. Foam needs about 24 hours to recover its properties, and a rotation extends the life of both pairs beyond what either would manage alone.',
    ],
    tags: ['running', 'shoes'],
  },
];

export const blogPosts = articles.map((a, i) => ({
  id: i + 1,
  slug: slugify(a.title),
  cover: `https://picsum.photos/seed/shopnest-blog-${slugify(a.title)}/1200/640`,
  authorAvatar: `https://picsum.photos/seed/shopnest-author-${slugify(a.author)}/120/120`,
  ...a,
}));

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export const blogCategories = [...new Set(blogPosts.map((p) => p.category))];

/* ------------------------------------------------------------------ */
/* Help centre                                                         */
/* ------------------------------------------------------------------ */

export const helpTopics = [
  {
    id: 'orders', label: 'Orders and delivery', icon: 'LocalShipping',
    faqs: [
      { q: 'When will my order arrive?', a: 'Standard delivery takes 4-6 business days, express takes 2-3, and same-day is available on select metro pincodes for orders placed before 12 PM. The exact estimate for your address shows on the product page once you enter a pincode.' },
      { q: 'Can I change my delivery address after ordering?', a: 'Yes, until the order moves to Packed. Open the order from Your orders, choose Change address, and pick another saved address in the same city. Cross-city changes need a cancellation and a fresh order.' },
      { q: 'My order says delivered but I have not received it.', a: 'Check with building security and neighbours first, since our couriers leave a note when they hand a parcel over. If it is still missing after 24 hours, raise it from the order page and we will open an investigation, which usually closes within 48 hours.' },
      { q: 'Do you deliver to my pincode?', a: 'We ship to over 19,000 pincodes across India. Enter your pincode on any product page to check serviceability and the delivery window before you order.' },
    ],
  },
  {
    id: 'returns', label: 'Returns and refunds', icon: 'AssignmentReturn',
    faqs: [
      { q: 'How long do I have to return something?', a: 'Seven days from delivery for most categories. Grocery, innerwear and opened beauty products are not returnable for hygiene reasons, and this is stated on the product page before you order.' },
      { q: 'When do I get my refund?', a: 'Refunds are initiated as soon as the courier scans the item back in, usually the same day as pickup. It takes 3-5 working days to reach a card and 1-2 days to reach a UPI or bank account.' },
      { q: 'Do I pay for return shipping?', a: 'No. Return pickup is free for every eligible order, including when you simply changed your mind.' },
      { q: 'Can I exchange for a different size instead?', a: 'Yes, on clothing and footwear. Choose Exchange rather than Return and pick the new size. We ship the replacement as soon as the pickup is scanned.' },
    ],
  },
  {
    id: 'payments', label: 'Payments and pricing', icon: 'Payments',
    faqs: [
      { q: 'Which payment methods do you accept?', a: 'Credit and debit cards, UPI, net banking from 50+ banks, and cash on delivery on orders under INR 20,000. This demo store does not process real payments.' },
      { q: 'Is cash on delivery available everywhere?', a: 'It is available on most pincodes for orders below INR 20,000, with a handling fee of INR 29. Some remote pincodes are prepaid only.' },
      { q: 'Why was my card declined?', a: 'The most common reasons are an incorrect CVV, an expired card, or your bank blocking an online transaction. Your bank will usually send an SMS explaining which. No amount is captured on a declined attempt.' },
      { q: 'Can I use two coupons on one order?', a: 'One coupon per order. Product-level discounts already shown on the listing are separate and always apply on top.' },
    ],
  },
  {
    id: 'account', label: 'Account and privacy', icon: 'ManageAccounts',
    faqs: [
      { q: 'How do I delete my account?', a: 'Go to Settings, then Privacy, then Delete account. We remove personal data within 30 days, keeping only the invoice records that tax law requires us to hold.' },
      { q: 'How do I stop marketing emails?', a: 'Settings, then Notifications, then turn off Email. Order and delivery updates continue, since those are transactional.' },
      { q: 'Can I turn off personalised recommendations?', a: 'Yes. Settings, then Privacy, then Personalised recommendations. The homepage falls back to general best sellers.' },
    ],
  },
];

export const popularQuestions = [
  'Where is my order?',
  'How do I return an item?',
  'When will my refund arrive?',
  'How do I change my delivery address?',
  'Do you deliver to my pincode?',
  'How do I apply a coupon?',
];

/* ------------------------------------------------------------------ */
/* Admin analytics                                                     */
/* ------------------------------------------------------------------ */

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

export const revenueSeries = MONTHS.map((month, i) => ({
  month,
  revenue: [1840000, 2120000, 3480000, 2260000, 2010000, 2340000, 2580000, 2720000, 2410000, 2890000, 3150000, 3420000][i],
  orders: [1240, 1410, 2380, 1520, 1360, 1590, 1740, 1830, 1610, 1950, 2110, 2290][i],
  refunds: [64000, 71000, 138000, 82000, 69000, 77000, 88000, 91000, 79000, 96000, 104000, 112000][i],
}));

export const categorySales = [
  { name: 'Electronics', value: 12840000, share: 41 },
  { name: 'Fashion', value: 7320000, share: 23 },
  { name: 'Home & Living', value: 4980000, share: 16 },
  { name: 'Beauty', value: 2410000, share: 8 },
  { name: 'Sports', value: 1890000, share: 6 },
  { name: 'Watches', value: 1120000, share: 4 },
  { name: 'Grocery', value: 690000, share: 2 },
];

export const trafficSeries = [
  { day: 'Mon', visitors: 12400, conversions: 384 },
  { day: 'Tue', visitors: 11800, conversions: 356 },
  { day: 'Wed', visitors: 13100, conversions: 421 },
  { day: 'Thu', visitors: 14600, conversions: 468 },
  { day: 'Fri', visitors: 18200, conversions: 612 },
  { day: 'Sat', visitors: 21400, conversions: 748 },
  { day: 'Sun', visitors: 19700, conversions: 690 },
];

/** Top-selling products, derived from the real catalogue so the tables agree. */
export const topProducts = [...products]
  .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
  .slice(0, 8)
  .map((p, i) => ({
    id: p.id,
    title: p.title,
    thumbnail: p.thumbnail,
    category: p.category,
    price: p.price,
    stock: p.stock,
    unitsSold: 2400 - i * 180 + ((p.id * 37) % 120),
    revenue: p.price * (2400 - i * 180),
  }));

const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Diya Nair', 'Rohan Mehta', 'Ishita Banerjee', 'Kabir Singh',
  'Ananya Rao', 'Vivek Iyer', 'Meera Joshi', 'Arjun Patel', 'Sana Qureshi',
  'Nikhil Reddy', 'Tara Desai',
];

const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export const adminCustomers = CUSTOMER_NAMES.map((name, i) => ({
  id: `CUS-${1000 + i}`,
  name,
  email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@example.com`,
  city: CITIES[i % CITIES.length],
  orders: 34 - i * 2,
  lifetimeValue: 486000 - i * 31000,
  joinedAt: new Date(2024, i % 12, 3 + i).toISOString(),
  segment: i < 3 ? 'VIP' : i < 7 ? 'Repeat' : 'New',
  avatar: `https://picsum.photos/seed/shopnest-cust-${i}/80/80`,
}));

const ADMIN_STATUSES = ['Delivered', 'Shipped', 'Packed', 'Placed', 'Cancelled', 'Returned'];

export const adminOrders = Array.from({ length: 24 }, (_, i) => {
  const customer = adminCustomers[i % adminCustomers.length];
  const product = products[(i * 7) % products.length];
  const qty = (i % 3) + 1;
  return {
    id: `SN-${9000 + i * 13}`,
    customer: customer.name,
    email: customer.email,
    date: new Date(Date.now() - i * 43200000).toISOString(),
    items: qty,
    product: product.title,
    total: product.price * qty,
    status: ADMIN_STATUSES[i % ADMIN_STATUSES.length],
    payment: ['UPI', 'Card', 'Net banking', 'Cash on delivery'][i % 4],
  };
});

/** Inventory rows: real catalogue stock, bucketed for the status chips. */
export const inventoryRows = products.slice(0, 40).map((p) => ({
  id: p.id,
  title: p.title,
  thumbnail: p.thumbnail,
  sku: `SKU-${String(p.id).padStart(4, '0')}`,
  category: p.category,
  price: p.price,
  stock: p.stock,
  status: p.stock === 0 ? 'Out of stock' : p.stock < 20 ? 'Low stock' : 'In stock',
}));

export const adminStats = {
  revenue: revenueSeries.reduce((s, m) => s + m.revenue, 0),
  orders: revenueSeries.reduce((s, m) => s + m.orders, 0),
  customers: 48210,
  products: products.length,
  conversionRate: 3.42,
  averageOrderValue: Math.round(
    revenueSeries.reduce((s, m) => s + m.revenue, 0) / revenueSeries.reduce((s, m) => s + m.orders, 0),
  ),
  refundRate: 2.8,
};

/* ------------------------------------------------------------------ */
/* About page content                                                  */
/* ------------------------------------------------------------------ */

export const companyStats = [
  { label: 'Orders delivered', value: '2.4 million' },
  { label: 'Pincodes served', value: '19,400+' },
  { label: 'Brand partners', value: '1,280' },
  { label: 'Average delivery time', value: '2.9 days' },
];

export const companyValues = [
  { title: 'Publish the real number', body: 'Stock counts, delivery windows and fabric weights are printed as they are. When something is out of stock we say so rather than quietly extending the estimate.', icon: 'FactCheck' },
  { title: 'Returns without an argument', body: 'Seven days, free pickup, no questionnaire about why. A return that takes three messages to arrange is a return policy in name only.', icon: 'AssignmentReturn' },
  { title: 'Pay sellers on time', body: 'Our brand partners are settled within 14 days of delivery, not 90. Small makers cannot float a quarter of working capital for us.', icon: 'Handshake' },
  { title: 'Less packaging, honestly measured', body: 'We publish our packaging weight per order every quarter. It went down 31 percent last year and we expect it to get harder from here.', icon: 'Recycling' },
];

export const companyTimeline = [
  { year: '2019', title: 'Started in a Bengaluru garage', body: 'Three people, 200 products, and a spreadsheet standing in for an order management system.' },
  { year: '2021', title: 'Opened the first regional warehouse', body: 'Hyderabad went live, cutting South India delivery times from six days to two.' },
  { year: '2023', title: 'Crossed a million orders', body: 'And rebuilt the returns flow after realising it was the single biggest source of support tickets.' },
  { year: '2025', title: 'Brand partner programme', body: 'Opened the platform to 400 independent Indian makers with 14-day settlement terms.' },
  { year: '2026', title: 'Same-day in seven cities', body: 'Same-day delivery running in Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Pune and Kolkata.' },
];

export const teamMembers = [
  { name: 'Ananya Krishnan', role: 'Chief Executive', bio: 'Previously ran supply chain for a national grocery chain. Still personally reads every one-star review.' },
  { name: 'Farhan Sheikh', role: 'Head of Engineering', bio: 'Built the catalogue search that made stock counts real-time instead of nightly.' },
  { name: 'Meghna Pillai', role: 'Head of Buying', bio: 'Fifteen years in retail buying. Rejects roughly nine of every ten products pitched to us.' },
  { name: 'Yash Bhatia', role: 'Head of Operations', bio: 'Owns the delivery promise. Publishes the on-time percentage internally every Monday.' },
  { name: 'Sneha Iyer', role: 'Head of Design', bio: 'Redesigned the returns flow into four taps, which cut return-related tickets by half.' },
  { name: 'Imran Qadri', role: 'Head of Partnerships', bio: 'Brings independent Indian makers onto the platform and fights for their settlement terms.' },
].map((m) => ({ ...m, avatar: `https://picsum.photos/seed/shopnest-team-${slugify(m.name)}/200/200` }));

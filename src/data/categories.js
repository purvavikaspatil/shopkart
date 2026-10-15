import { slugify } from '@/utils/format';

/**
 * Category tree aligned with the 10 categories and 200 products in ShopNest:
 * 1. Clothing
 * 2. Electronics
 * 3. Mobiles
 * 4. Laptops
 * 5. Footwear
 * 6. Home & Kitchen
 * 7. Beauty & Personal Care
 * 8. Sports & Fitness
 * 9. Books
 * 10. Furniture
 */
const raw = [
  {
    name: 'Clothing',
    icon: 'Checkroom',
    tagline: 'Everyday staples and weekend statement pieces',
    description:
      'Fabric weights, fit notes and a size chart on every product page. Free 7-day exchanges if the fit is not right the first time.',
    color: '#B4456F',
    subcategories: ['Men', 'Women', 'Kids', 'Activewear', 'Ethnic Wear'],
    banner: 'clothing-hero',
  },
  {
    name: 'Electronics',
    icon: 'Devices',
    tagline: 'Audio, cameras, accessories and smart tech',
    description:
      'Hand-picked tech from verified brands. Every listing shows real stock counts, warranty terms and what is in the box.',
    color: '#3D48D6',
    subcategories: ['Headphones', 'Cameras', 'Smart Watches', 'Audio', 'Accessories'],
    banner: 'electronics-hero',
  },
  {
    name: 'Mobiles',
    icon: 'Smartphone',
    tagline: 'Latest 5G smartphones and dependable daily drivers',
    description:
      'Flagship cameras, high refresh-rate AMOLED panels, and dependable two-day battery lives from verified brands.',
    color: '#0284C7',
    subcategories: ['Smartphones', 'Flagships', 'Budget Phones', 'Accessories'],
    banner: 'mobiles-hero',
  },
  {
    name: 'Laptops',
    icon: 'LaptopMac',
    tagline: 'Creator ultrabooks, gaming beasts and office workhorses',
    description:
      'Colour-calibrated displays, multi-core processing power, and sustained performance cooling for work and play.',
    color: '#4F46E5',
    subcategories: ['Ultrabooks', 'Gaming Laptops', 'Office Laptops', 'Creator Editions'],
    banner: 'laptops-hero',
  },
  {
    name: 'Footwear',
    icon: 'RollerSkating',
    tagline: 'Sneakers, formal shoes, trainers and slip-ons',
    description:
      'Cushioned soles, premium leathers, and ergonomic fits designed for daily commuting and athletic performance.',
    color: '#EA580C',
    subcategories: ['Sneakers', 'Running Shoes', 'Formal Shoes', 'Sandals', 'Boots'],
    banner: 'footwear-hero',
  },
  {
    name: 'Home & Kitchen',
    icon: 'Kitchen',
    tagline: 'Cookware, appliances and everyday home essentials',
    description:
      'Heavy-gauge stainless steel, non-toxic coatings, and precision kitchen appliances built for daily cooking.',
    color: '#D97706',
    subcategories: ['Cookware', 'Small Appliances', 'Storage', 'Dining', 'Bakeware'],
    banner: 'kitchen-hero',
  },
  {
    name: 'Beauty & Personal Care',
    icon: 'Spa',
    tagline: 'Skincare, haircare, grooming and fragrances',
    description:
      'Full ingredient transparency, batch dates and cruelty-free certification on each product. Dermatologist tested.',
    color: '#DB2777',
    subcategories: ['Skincare', 'Haircare', 'Fragrance', 'Grooming', 'Bath & Body'],
    banner: 'beauty-hero',
  },
  {
    name: 'Sports & Fitness',
    icon: 'FitnessCenter',
    tagline: 'Gym equipment, sports gear and athletic apparel',
    description:
      'Tested by athletes across gyms, trails and tracks. Load ratings and high-durability fabrics.',
    color: '#16A34A',
    subcategories: ['Fitness Equipment', 'Yoga & Pilates', 'Outdoor & Camping', 'Sportswear'],
    banner: 'sports-hero',
  },
  {
    name: 'Books',
    icon: 'AutoStories',
    tagline: 'Bestselling fiction, business, self-help and classics',
    description:
      'Curated reading lists from literary classics to modern breakthroughs in science, leadership, and personal growth.',
    color: '#7C3AED',
    subcategories: ['Fiction', 'Non-Fiction', 'Business & Tech', 'Biographies', 'Self-Help'],
    banner: 'books-hero',
  },
  {
    name: 'Furniture',
    icon: 'Chair',
    tagline: 'Solid wood tables, ergonomic seating and modern storage',
    description:
      'Solid teak, oak and walnut frames, ergonomic task chairs, and modular living room furniture with assembly assistance.',
    color: '#9333EA',
    subcategories: ['Chairs', 'Tables', 'Sofas', 'Beds', 'Office Furniture', 'Storage'],
    banner: 'furniture-hero',
  },
];

export const categories = raw.map((c, index) => ({
  id: index + 1,
  slug: slugify(c.name),
  image: `https://picsum.photos/seed/shopnest-cat-${slugify(c.name)}/800/600`,
  banner: `https://picsum.photos/seed/shopnest-banner-${c.banner}/1600/500`,
  ...c,
  subcategories: c.subcategories.map((s) => ({ name: s, slug: slugify(s) })),
}));

/** Flat list of every subcategory, with its parent attached. */
export const allSubcategories = categories.flatMap((c) =>
  c.subcategories.map((s) => ({ ...s, category: c.name, categorySlug: c.slug, color: c.color })),
);

export const categoryNames = categories.map((c) => c.name);

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}

export function getCategoryByName(name) {
  return categories.find((c) => c.name.toLowerCase() === String(name).toLowerCase()) || null;
}

/**
 * Cards shown in the homepage category rail. Displays all 10 categories.
 */
export const featuredCategoryCards = categories.map((c) => ({
  label: c.name,
  to: `/category/${c.slug}`,
  image: c.image,
  color: c.color,
  icon: c.icon,
}));

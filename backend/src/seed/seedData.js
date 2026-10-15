require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Product = require('../models/ProductSchema');
const Category = require('../models/CategorySchema');
const User = require('../models/UserSchema');
const Coupon = require('../models/CouponSchema');
const Address = require('../models/AddressSchema');
const Card = require('../models/CardSchema');
const Order = require('../models/OrderSchema');
const Review = require('../models/ReviewSchema');
const BlogPost = require('../models/BlogPostSchema');
const HelpTopic = require('../models/HelpTopicSchema');

const {
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
} = require('../utils/inMemoryStore');

async function seed() {
  console.log('=== ShopNest Database Seeder Starting ===');
  const connected = await connectDB();
  if (!connected) {
    console.error('✘ Cannot run database seed script: MongoDB is not connected.');
    console.log('Please ensure your IP is whitelisted on Atlas or start a local MongoDB instance.');
    process.exit(1);
  }

  try {
    console.log('Clearing old collections...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Coupon.deleteMany({}),
      Address.deleteMany({}),
      Card.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      BlogPost.deleteMany({}),
      HelpTopic.deleteMany({}),
    ]);

    console.log('Seeding 10 Categories...');
    await Category.insertMany(CATEGORIES);

    console.log(`Seeding ${PRODUCTS.length} Products across 10 Categories...`);
    await Product.insertMany(PRODUCTS);

    console.log(`Seeding ${USERS.length} Users (Admin + Customers)...`);
    await User.insertMany(USERS);

    console.log('Seeding Coupons, Addresses, Cards, Orders, Reviews, and Editorial content...');
    await Coupon.insertMany(COUPONS);
    await Address.insertMany(ADDRESSES);
    await Card.insertMany(CARDS);
    await Order.insertMany(ORDERS);
    await Review.insertMany(REVIEWS);
    await BlogPost.insertMany(BLOG_POSTS);
    await HelpTopic.insertMany(HELP_TOPICS);

    console.log('\n======================================================');
    console.log('  ShopNest Database Seeded Successfully!');
    console.log(`  - Categories: ${CATEGORIES.length}`);
    console.log(`  - Products:   ${PRODUCTS.length}`);
    console.log(`  - Users:      ${USERS.length}`);
    console.log('    1. Admin:   abhale.parth07@gmail.com / Parth@1234');
    console.log('    2. Demo:    demo@example.com / password123');
    console.log('    3. User 3:  priya.sharma@example.com / password123');
    console.log('    4. User 4:  rohan.mehta@example.com / password123');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('✘ Error seeding database:', err);
    process.exit(1);
  }
}

seed();

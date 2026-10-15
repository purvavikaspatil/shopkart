/**
 * add-products.js
 * Logs in as an admin user, then POSTs every product in products_seed.json
 * to the ShopNest API, one request per product.
 *
 * Requires Node.js 18+ (built-in fetch). Run with:
 *   node add-products.js
 */

const fs = require('fs');
const path = require('path');

// ---- Config — edit these ----
const BASE_URL = 'http://localhost:8000/api';
const ADMIN_EMAIL = 'abhale.parth07@gmail.com';
const ADMIN_PASSWORD = 'Parth@1234';
// -------------------------------

async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Login returned non-JSON (status ${res.status}):\n${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    throw new Error(`Login failed: ${data.message || res.statusText}`);
  }
  return data.token;
}

async function createProduct(token, product) {
  const res = await fetch(`${BASE_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `"${product.title}" returned non-JSON (status ${res.status}):\n${text.slice(0, 300)}`,
    );
  }

  if (!res.ok) {
    throw new Error(`Failed to create "${product.title}": ${data.message || res.statusText}`);
  }
  return data;
}

async function upload() {
  console.log('Logging in as admin...');
  const token = await login();
  console.log('Logged in. Token acquired.');

  const { products } = require('./crazy.json')
  console.log(`Found ${products.length} products to create.`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const created = await createProduct(token, product);
      success++;
      console.log(`✔ Created: ${created.title} (${created._id})`);
    } catch (err) {
      failed++;
      console.error(`✘ ${err.message}`);
    }
  }

  console.log(`\nDone. ${success} created, ${failed} failed.`);
}
module.exports = upload
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 8000;

connectDB().then((connected) => {
  app.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`  ShopNest Backend Server is ONLINE on port ${port}`);
    console.log(`  API Root: http://localhost:${port}/api`);
    console.log(`  Database Status: ${connected ? 'CONNECTED (MongoDB Live)' : 'FALLBACK / MEMORY MODE'}`);
    console.log(`==================================================\n`);
  });
}).catch((err) => {
  console.error('Server startup exception:', err);
  app.listen(port, () => {
    console.log(`ShopNest server running on port ${port} (standalone mode)`);
  });
});
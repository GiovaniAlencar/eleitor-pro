const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create api directory if it doesn't exist
if (!fs.existsSync('api')) {
  fs.mkdirSync('api');
}

// Create database directory and SQLite file
if (!fs.existsSync('api/database')) {
  fs.mkdirSync('api/database', { recursive: true });
}

const dbPath = path.join('api/database', 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

// Copy environment file
fs.copyFileSync('.env.example', 'api/.env');

console.log('API setup completed successfully!');
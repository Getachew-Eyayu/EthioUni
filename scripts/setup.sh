#!/bin/bash

echo "🚀 Starting EthioUni Setup..."

# Check Node.js version
echo "✓ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "⚠️  .env.local not found. Please copy .env.example to .env.local and fill in your values."
  echo "   cp .env.example .env.local"
else
  echo "✓ .env.local found"
  
  # Try to push schema
  echo "🔄 Pushing database schema..."
  npm run db:push || echo "⚠️  Database push failed. Make sure DATABASE_URL is set correctly."
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo ""

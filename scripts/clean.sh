#!/bin/bash

echo "🧹 Cleaning up..."

rm -rf .next
rm -rf node_modules
rm -rf dist
rm -rf build

echo "✅ Clean complete!"
echo "Run 'npm install' to reinstall dependencies"

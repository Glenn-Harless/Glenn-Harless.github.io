#!/bin/bash
# Portfolio deployment script

echo "🚀 Starting portfolio deployment..."

# Build data
echo "📊 Building project data..."
python build.py

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Exiting."
    exit 1
fi

# Use minified files in production
echo "📦 Preparing production files..."
cp index.html index.prod.html
sed -i.bak 's/styles.css/styles.min.css/g' index.prod.html
sed -i.bak 's/script.js/script.min.js/g' index.prod.html
rm index.prod.html.bak

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p dist
cp -r data dist/
cp index.prod.html dist/index.html
cp styles.min.css dist/
cp script.min.js dist/
cp robots.txt dist/
cp sitemap.xml dist/
cp 404.html dist/

# Clean up
rm index.prod.html

echo "✅ Deployment preparation complete!"
echo "📂 Files ready in dist/ directory"

# Optional: Deploy to GitHub Pages
if [ "$1" = "--github-pages" ]; then
    echo "🌐 Deploying to GitHub Pages..."
    # This assumes you have gh-pages branch set up
    git add dist -f
    git commit -m "Deploy to GitHub Pages"
    git subtree push --prefix dist origin gh-pages
    echo "✅ Deployed to GitHub Pages!"
fi
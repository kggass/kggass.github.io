#!/bin/bash
# Build script to minify CSS and JS files

echo "Minifying CSS files..."
pnpm dlx clean-css-cli -o css/style.min.css css/style.css
pnpm dlx clean-css-cli -o css/responsive.min.css css/responsive.css

echo "Minifying and obfuscating JS file..."
pnpm dlx terser js/main.js --compress --mangle -o js/main.min.js

echo "Build complete!"

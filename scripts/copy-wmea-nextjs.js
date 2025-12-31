/**
 * Script to copy WMEA embedded app files to Next.js public directory
 *
 * This script copies files from node_modules/@nuralogix.ai/web-measurement-embedded-app/dist
 * to public/wmea/ so they can be served as static files.
 *
 * Usage: node scripts/copy-wmea-nextjs.js
 */

const fs = require("fs");
const path = require("path");

const srcDir = path.join(
  __dirname,
  "../node_modules/@nuralogix.ai/web-measurement-embedded-app/dist"
);
const destDir = path.join(__dirname, "../public/wmea");

function copyRecursive(srcDir, destDir) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Read all entries in source directory
  const entries = fs.readdirSync(srcDir);

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry);
    const destPath = path.join(destDir, entry);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Check if source directory exists
if (!fs.existsSync(srcDir)) {
  console.error(`❌ Source directory not found: ${srcDir}`);
  console.error(
    "   Make sure @nuralogix.ai/web-measurement-embedded-app is installed."
  );
  process.exit(1);
}

try {
  console.log("📦 Copying WMEA embedded app files...");
  console.log(`   From: ${srcDir}`);
  console.log(`   To: ${destDir}`);

  copyRecursive(srcDir, destDir);

  console.log("✅ WMEA files copied successfully!");
  console.log(`   Files are now available at: /wmea/`);
} catch (error) {
  console.error("❌ Error copying WMEA files:", error.message);
  process.exit(1);
}

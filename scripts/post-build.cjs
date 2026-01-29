const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const EN_DIR = path.join(OUT_DIR, 'en');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function deleteRecursiveSync(pathToDelete) {
  if (fs.existsSync(pathToDelete)) {
    fs.rmSync(pathToDelete, { recursive: true, force: true });
  }
}

async function main() {
  console.log('🚀 Starting post-build script...');

  // 1. 处理 en 目录下的内容 (包括子页面和 en/index.html)
  if (fs.existsSync(EN_DIR)) {
    console.log('📦 Moving "en" directory content to root...');
    try {
      const items = fs.readdirSync(EN_DIR);
      for (const item of items) {
        const srcPath = path.join(EN_DIR, item);
        const destPath = path.join(OUT_DIR, item);
        copyRecursiveSync(srcPath, destPath);
      }
      console.log('✅ Directory content moved.');
      deleteRecursiveSync(EN_DIR);
      console.log('🗑️  Removed "en" directory.');
    } catch (err) {
      console.error('❌ Error moving en directory:', err);
    }
  }

  // 2. 检查 en.html (兼容 trailingSlash: false)
  const enHtmlPath = path.join(OUT_DIR, 'en.html');
  const indexHtmlPath = path.join(OUT_DIR, 'index.html');

  if (fs.existsSync(enHtmlPath)) {
    console.log('🔄 Renaming en.html to index.html...');
    try {
      fs.renameSync(enHtmlPath, indexHtmlPath);
      console.log('✅ Renamed successfully.');
    } catch (err) {
      console.error('❌ Error renaming en.html:', err);
    }
  }

  console.log('✨ Post-build complete! Default locale is now served at root.');
}

main();

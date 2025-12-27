const fs = require('fs');
const path = require('path');

const DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

const platform = process.env.CAPACITOR_PLATFORM_NAME || '';
const projectDirPath = process.env.CAPACITOR_ROOT_DIR || process.cwd();
const webDirPath = process.env.CAPACITOR_WEB_DIR || 'dist';

console.log('\tAlternate Icons hook - platform:', platform);

const imgDir = path.resolve(projectDirPath, webDirPath);

if (!fs.existsSync(imgDir)) {
  console.warn('\t[SKIPPED] Icons source directory does not exist:', imgDir);
  process.exit(0);
}

const files = fs
  .readdirSync(imgDir)
  .filter(
    name =>
      name.indexOf('ic_icon') > -1 &&
      /\.png$/i.test(name)
  )
  .sort();

if (files.length === 0) {
  console.warn('\t[SKIPPED] No icon files starting with "ic_icon" and ending with .png found in', imgDir);
  process.exit(0);
}

if (platform === 'android') {
  copyIconsAndroid(files);
} else if (platform === 'ios') {
  enableIosAlternateAppIcons();
} else {
  console.log('\t[SKIPPED] Platform not handled by Alternate Icons hook:', platform);
}

function copyIconsAndroid(files) {
  const androidResBaseDir = path.resolve(
    projectDirPath,
    'android',
    'app',
    'src',
    'main',
    'res'
  );

  files.forEach((file, index) => {
    const srcPath = path.join(imgDir, file);
    const buffer = fs.readFileSync(srcPath);
    const baseName = `ic_icon${index + 1}`;

    DENSITIES.forEach(density => {
      const destDir = path.join(androidResBaseDir, `mipmap-${density}`);
      const destPath = path.join(destDir, `${baseName}.png`);
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destPath, buffer);
      console.log(`\t[SUCCESS][android] Copied ${file} -> ${destPath}`);
    });
  });
}

function enableIosAlternateAppIcons() {
  const pbxprojPath = path.resolve(
    projectDirPath,
    'ios',
    'App',
    'App.xcodeproj',
    'project.pbxproj'
  );

  if (!fs.existsSync(pbxprojPath)) {
    console.warn('\t[SKIPPED][ios] project.pbxproj not found:', pbxprojPath);
    return;
  }

  let content = fs.readFileSync(pbxprojPath, 'utf8');

  if (content.includes('ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS')) {
    console.log('\t[SKIPPED][ios] ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS already set.');
    return;
  }

  const lines = content.split('\n');
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('ASSETCATALOG_COMPILER_APPICON_NAME') && line.includes('AppIcon')) {
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      const newLine = `${indent}ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS = YES;`;
      lines.splice(i, 0, newLine);
      i++;
      modified = true;
    }
  }

  if (!modified) {
    console.warn('\t[WARNING][ios] Did not find ASSETCATALOG_COMPILER_APPICON_NAME lines to patch.');
    return;
  }

  content = lines.join('\n');
  fs.writeFileSync(pbxprojPath, content, 'utf8');
  console.log('\t[SUCCESS][ios] Enabled ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS in all build configs.');
}
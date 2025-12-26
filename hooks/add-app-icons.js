const fs = require('fs');
const path = require('path');
const os = require('os');

const DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

const platform = process.env.CAPACITOR_PLATFORM_NAME || '';
const projectDirPath = process.env.CAPACITOR_ROOT_DIR || process.cwd();
const webDirPath = process.env.CAPACITOR_WEB_DIR || 'dist';
let tmpDir;

console.log('\tAlternate Icons hook - platform:', platform);

const unzipAndCopyIcons = (zipDirectory, platform) => {
  let zipFilePath = path.resolve(zipDirectory, 'alternateicons.zip');
    if (!fs.existsSync(zipFilePath)) {
        const foundZipFile = fs.readdirSync(zipDirectory).find(f => f.toLowerCase().startsWith('alternateicons') && f.toLowerCase().endsWith('.zip'));
        if (!foundZipFile) {
            console.error('\t[SKIPPED] alternateicons.zip does not seem to exist. Skipping this action');
            return
        }
        zipFilePath = path.resolve(zipDirectory, foundZipFile);
    }

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alternateicons-'));
    try {
        execSync(`unzip -qq "${zipFilePath}" -d "${tmpDir}"`);
    } catch (err) {
        console.error('\t[ERROR] Failed to unzip file:', err.message);
        process.exit(1);
    }

  const files = fs
  .readdirSync(tmpDir)
  .filter(
    name =>
      name.indexOf('ic_icon') > -1 &&
      /\.png$/i.test(name)
  )
  .sort();

  if (files.length === 0) {
    console.warn('\t[SKIPPED] No icon files starting with "ic_icon" and ending with .png found in', tmpDir);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.exit(0);
  }
  if (platform === 'android') {
    copyIconsAndroid(files);
  } else if (platform === 'ios') {
    copyIconsIos(files);
    enableIosAlternateAppIcons();
  } else {
    console.log('\t[SKIPPED] Platform not handled by Alternate Icons hook:', platform);
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('\t[FINISH] Temporary files cleaned up.');
}

const copyIconsAndroid = (files) =>{
  const androidResBaseDir = path.resolve(
    projectDirPath,
    'android',
    'app',
    'src',
    'main',
    'res'
  );

  files.forEach((file, index) => {
    const srcPath = path.join(tmpDir, file);
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

const copyIconsIos = (files) =>{
  const iosAssetsBaseDir = path.resolve(
    projectDirPath,
    'ios',
    'App',
    'App',
    'Assets.xcassets'
  );

  if (!fs.existsSync(iosAssetsBaseDir)) {
    console.warn('\t[SKIPPED] iOS Assets.xcassets directory does not exist:', iosAssetsBaseDir);
    return;
  }

  const appIconSetDir = path.join(iosAssetsBaseDir, 'AppIcon.appiconset');
  const appIconContentsPath = path.join(appIconSetDir, 'Contents.json');

  if (!fs.existsSync(appIconContentsPath)) {
    console.warn('\t[SKIPPED] AppIcon.appiconset/Contents.json not found:', appIconContentsPath);
    return;
  }

  let appIconContents;
  try {
    appIconContents = JSON.parse(fs.readFileSync(appIconContentsPath, 'utf8'));
  } catch (e) {
    console.error('\t[ERROR] Failed to parse AppIcon Contents.json:', e);
    return;
  }

  files.forEach((file, index) => {
    const srcPath = path.join(tmpDir, file);
    const buffer = fs.readFileSync(srcPath);

    const iconName = `icon${index + 1}`; 
    const altIconSetDir = path.join(iosAssetsBaseDir, `${iconName}.appiconset`);
    fs.mkdirSync(altIconSetDir, { recursive: true });

    const altContents = {
      images: [],
      info: appIconContents.info
    };

    appIconContents.images.forEach((imgDef, imgIndex) => {
      const origFilename = imgDef.filename || `AppIcon-${imgIndex}.png`;
      const ext = path.extname(origFilename) || '.png';
      const base = path.basename(origFilename, ext);

      const newFilename = `${base}-${iconName}${ext}`;
      const destPath = path.join(altIconSetDir, newFilename);

      fs.writeFileSync(destPath, buffer);

      const newImgDef = Object.assign({}, imgDef, {
        filename: newFilename
      });

      altContents.images.push(newImgDef);
    });

    fs.writeFileSync(
      path.join(altIconSetDir, 'Contents.json'),
      JSON.stringify(altContents, null, 2)
    );

    console.log(`\t[SUCCESS][ios] Cloned AppIcon.appiconset -> ${iconName}.appiconset using ${file}`);
  });
}


const enableIosAlternateAppIcons = () =>{
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

unzipAndCopyIcons(webDirPath, platform);
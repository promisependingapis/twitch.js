const fs = require('fs');

const packageRaw = fs.readFileSync('./package.json', 'utf8');
const packageJson = JSON.parse(packageRaw);

packageJson.main = './src/main.js';
packageJson.types = './src/main.d.ts';

delete packageJson.scripts;

fs.writeFileSync('./build/package.json', JSON.stringify(packageJson, null, 2));

if (fs.existsSync('./build/tsconfig.tsbuildinfo')) {
  fs.unlinkSync('./build/tsconfig.tsbuildinfo');
}

fs.copyFileSync('./.npmignore', './build/.npmignore');
fs.copyFileSync('./LICENSE', './build/LICENSE');
fs.copyFileSync('./README.md', './build/README.md');

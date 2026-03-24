const fs = require('fs');
const path = require('path');

const DAYS_OLD = 365; // change if needed
const now = Date.now();

function scan(dir) {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.git') return;

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(scan(fullPath));
    } else {
      const ageDays = (now - stat.mtimeMs) / (1000 * 60 * 60 * 24);

      if (ageDays > DAYS_OLD) {
        results.push({
          file: fullPath,
          days: Math.floor(ageDays)
        });
      }
    }
  });

  return results;
}

const unusedFiles = scan('./');

fs.writeFileSync(
  'unused-files.json',
  JSON.stringify(unusedFiles, null, 2)
);

console.log("Found:", unusedFiles.length);

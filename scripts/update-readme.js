const fs = require('fs');

const repo = process.env.GITHUB_REPOSITORY;

if (!fs.existsSync('unused-files.json')) {
  console.log("No data");
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync('unused-files.json'));

let table = `
## 🧹 Unused Files (older than 1 year)

| File | Last Updated | Age | Delete |
|------|-------------|-----|--------|
`;

data.forEach(f => {
  const deleteLink = `https://github.com/${repo}/blob/main/${f.file}`;

  table += `| ${f.file} | ${f.lastUpdated} | ${f.ageYears} yrs | [Delete](${deleteLink}) |\n`;
});

let readme = fs.existsSync('README.md') ? fs.readFileSync('README.md', 'utf-8') : '';

const markerStart = "<!-- CLEANUP_START -->";
const markerEnd = "<!-- CLEANUP_END -->";

const newSection = `${markerStart}\n${table}\n${markerEnd}`;

if (readme.includes(markerStart)) {
  readme = readme.replace(
    new RegExp(`${markerStart}[\\s\\S]*${markerEnd}`),
    newSection
  );
} else {
  readme += "\n\n" + newSection;
}

fs.writeFileSync('README.md', readme);

console.log("README updated");

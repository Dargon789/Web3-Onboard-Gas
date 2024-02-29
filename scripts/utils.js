const jsonfile = require('jsonfile');
const glob = require('glob');
const path = require('path');

// This function reads all package.json files to collect package names
async function getAllPackageNames() {
  return new Promise((resolve, reject) => {
    glob('packages/*/package.json', async (err, files) => {
      if (err) {
        reject('Error finding package.json files:', err);
        return;
      }

      const packageNames = [];
      for (const file of files) {
        try {
          const packageJson = await jsonfile.readFile(path.resolve(file));
          packageNames.push(packageJson.name);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
        }
      }
      resolve(packageNames);
    });
  });
}

module.exports = {
    getAllPackageNames
}
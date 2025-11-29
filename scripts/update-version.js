const glob = require('glob');
const path = require('path');
const jsonfile = require('jsonfile');
const {getAllPackageNames} = require("./utils");

// Get the target version from the command line arguments
// Read the version from the root package.json
const rootPackageJsonPath = path.resolve('package.json');
const rootPackageJson = jsonfile.readFileSync(rootPackageJsonPath);
const targetVersion = rootPackageJson.version;

if (!targetVersion) {
  console.error('No version found in root package.json');
  process.exit(1);
}

// Function to update package.json dependencies
async function updatePackageJson(filePath, packageNames) {
  let fileUpdated = false;
  const packageJson = await jsonfile.readFile(filePath);

  // Update package version if it is in the packages list
  if (packageNames.includes(packageJson.name)) {
    packageJson.version = targetVersion;
    fileUpdated = true;
  }

  // Update dependencies, devDependencies, peerDependencies
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(depName => {
        if (packageNames.includes(depName)) {
          packageJson[depType][depName] = `^${targetVersion}`;
          fileUpdated = true;
        }
      });
    }
  });

  // Write the updated package.json back to file
  if (fileUpdated) {
    await jsonfile.writeFile(filePath, packageJson, { spaces: 2 });
    console.log(`Updated ${filePath}`);
  }
}

(async () => {
  const packageNames = await getAllPackageNames();

  glob('packages/**/package.json', async (err, files) => {
    if (err) {
      console.error('Error finding package.json files:', err);
      return;
    }

    // Update each found package.json
    for (const file of files) {
      await updatePackageJson(path.resolve(file), packageNames);
    }
  });
})();
const glob = require('glob');
const execa = require('execa');
const path = require('path');

const prefix = '@subwallet-connect';

// Function to publish a package
async function publishPackage(packagePath) {
  try {
    const { stdout } = await execa('npm', ['publish', '--access', 'public'], { cwd: packagePath });
    console.log(stdout);
  } catch (error) {
    console.error(`Failed to publish package at ${packagePath}:`, error.stderr);
  }
}

// Find and publish all packages with the specified prefix
glob('packages/*/package.json', async (err, files) => {
  if (err) {
    return console.error('Error finding package.json files:', err);
  }

  for (const file of files) {
    const packageJsonPath = path.resolve(file);
    const packageJson = require(packageJsonPath);

    if (packageJson.name && packageJson.name.startsWith(prefix)) {
      console.log(`Publishing ${packageJson.name}...`);
      await publishPackage(path.dirname(packageJsonPath));
    }
  }
});

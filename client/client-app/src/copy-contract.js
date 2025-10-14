const fs = require('fs-extra'); // Make sure to install fs-extra: npm install fs-extra
const path = require('path');

// Find the project root by looking for package.json
const projectRoot = path.resolve(__dirname, '..', '..'); // Assumes this script is in client/src

const sourcePath = path.resolve(projectRoot, 'build', 'contracts', 'VotingSystem.json');
const destinationPath = path.resolve(projectRoot, 'client', 'src', 'artifacts', 'VotingSystem.json');

fs.ensureDirSync(path.dirname(destinationPath));

fs.copy(sourcePath, destinationPath)
  .then(() => console.log('VotingSystem.json copied successfully to src/artifacts/'))
  .catch(err => console.error(`Error copying VotingSystem.json from ${sourcePath} to ${destinationPath}:`, err));
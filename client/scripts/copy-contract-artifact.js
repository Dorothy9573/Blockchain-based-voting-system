// client/scripts/copy-contract-artifact.js
const fs = require('fs-extra');
const path = require('path');

// Source is relative to the project root (where truffle-config.js is)
// We assume 'client' is a sibling to 'build'
const sourcePath = path.resolve(__dirname, '..', '..', 'build', 'contracts', 'VotingSystem.json');
// Destination is inside the client's src directory
const destinationPath = path.resolve(__dirname, '..', 'src', 'artifacts', 'VotingSystem.json');

console.log(`Attempting to copy from: ${sourcePath}`);
console.log(`Attempting to copy to: ${destinationPath}`);

fs.copy(sourcePath, destinationPath)
  .then(() => console.log('VotingSystem.json copied successfully to client/src/artifacts/'))
  .catch(err => {
    console.error('Error copying VotingSystem.json:', err);
    console.error('Please ensure you have run `truffle migrate --network sepolia` from your project root and that the build/contracts/VotingSystem.json file exists.');
    process.exit(1); // Exit with an error code if copy fails
  });
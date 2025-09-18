# Blockchain-based-voting-system
This project is a decentralized, secure, and transparent e-voting system built on blockchain technology. It aims to address the common challenges of traditional voting, such as a lack of transparency, vulnerability to fraud, and inefficient vote tallying.

Features
For Voters:
Secure Authentication: Log in with a cryptocurrency wallet (e.g., MetaMask).

Anonymous Voting: Cast your vote securely and anonymously.

Vote Verification: Independently verify that your vote has been recorded on the blockchain.

Live Results: View real-time, tamper-proof election results.

For Administrators:
Election Management: Create and configure new elections.

Voter Authorization: Authorize eligible voters to participate.

Real-time Tallies: Monitor vote counts as they are submitted to the blockchain.

Technical Stack
The system is built on a hybrid architecture, combining off-chain data management with on-chain security.

Client Layer: React.js

Application Layer: Node.js with Express.js

Smart Contract: voting.sol, deployed on the Sepolia Ethereum Testnet

Off-Chain Database: For managing sensitive user data and election metadata.

Getting Started
Prerequisites
Node.js (v14 or higher)

npm or yarn

A web browser with a crypto wallet extension (e.g., MetaMask) configured for the Sepolia Testnet.

Installation
Clone the repository:

git clone [https://github.com/Dorothy9573/Blockchain-based-voting-system.git](https://github.com/Dorothy9573/Blockchain-based-voting-system.git)
cd Blockchain-based-voting-system

Install dependencies:

npm install

Running the Application
Start the Node.js server:

node app.js

Start the React application:

npm start

The application will now be running on http://localhost:3000.

Smart Contract
The voting.sol smart contract handles all the core voting logic. It is responsible for:

Registering voters

Managing candidates

Handling vote submissions

Tallying results

Thank you!

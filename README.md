📌 Blockchain-Based Voting System

A decentralized and secure electronic voting platform built using Blockchain Technology to ensure transparency, prevent vote manipulation, and allow voters to confirm their votes independently.

This project leverages Ethereum Blockchain and Web3 to provide trustless and tamper-proof election results.

✅ Features
For Administrators

Open & close elections

Add candidates

Authorize voters

Monitor real-time vote counts

For Voters

Connect wallet using MetaMask

Cast votes anonymously

Verify votes on the blockchain

View real-time results securely

Tech Stack
Layer	Technology
Frontend	React.js (Web3 UI)
Backend	Node.js + Express.js
Blockchain	Solidity Smart Contract (Sepolia Testnet via Alchemy)
Web3	MetaMask + web3.js
Hosting	Frontend → Vercel
Backend → Render
Smart Contract

File: VotingSystem.sol

Network: Sepolia Ethereum Testnet

Purpose:

Store candidates

Allow authorized voting

Tally votes immutably

🚀 Deployment

✅ Frontend deployed on Vercel
✅ Backend deployed on Render

The backend exposes API endpoints:

https://blockchain-based-voting-system-va5h.onrender.com


The frontend dynamically communicates with the deployed backend —
so no local server is required ✅

🧩 Local Development (Optional)
🔹 Prerequisites

Node.js (v16+ recommended)

MetaMask installed in browser

Sepolia Testnet wallet configured

🔹 Clone the repository
git clone https://github.com/Dorothy9573/Blockchain-based-voting-system.git
cd Blockchain-based-voting-system

🔹 Install dependencies
Server
cd server
npm install

Client
cd ../client
npm install

🔹 Run locally
Start backend
cd server
npm start


Server runs on:
👉 http://localhost:5000

Start frontend
cd client
npm start


Frontend runs on:
👉 http://localhost:3000

🔐 Environment Variables

Create a .env file inside /server:

ALCHEMY_API_KEY=your_sepolia_api_key_here

📝 Scripts Overview
Location	Script	Description
/client	npm start	Start React frontend
/server	npm start	Start Node backend
📄 License

This project is licensed under the MIT License.

Acknowledgment

Built using:

Ethereum Blockchain

Alchemy RPC

Web3 & MetaMask

React + Node.js stack

🎯 Project Goal

To enforce trust, privacy, and transparency in digital voting systems using modern decentralized technologies.
const express = require("express");
const cors = require("cors");
const path = require("path");
const Web3 = require("web3");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Sepolia via Alchemy
const web3 = new Web3(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || "YOUR_API_KEY_HERE"}`);
const contractAddress = "0x8E7AB13e7703888FCD0953582BD633e66675F778";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "name": "candidates",
    "outputs": [
      {"internalType": "uint256","name": "id","type": "uint256"},
      {"internalType": "string","name": "name","type": "string"},
      {"internalType": "uint256","name": "voteCount","type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{"internalType": "uint256","name": "_candidateId","type": "uint256"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// API: Get candidates
app.get("/api/candidates", async (req, res) => {
  try {
    const count = await votingContract.methods.candidatesCount().call();
    const candidates = [];

    for (let i = 1; i <= count; i++) {
      const c = await votingContract.methods.candidates(i).call();
      candidates.push({
        id: c.id,
        name: c.name,
        votes: c.voteCount
      });
    }

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Vote
app.post("/api/vote", async (req, res) => {
  try {
    const { candidateId, voterAddress } = req.body;

    const tx = await votingContract.methods.vote(candidateId).send({
      from: voterAddress,
      gas: 300000
    });

    res.json({
      success: true,
      transactionHash: tx.transactionHash
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Start Server
app.listen(5000, () => {
  console.log("Backend running on port 5000");
  console.log("Connected to Sepolia Contract");
});

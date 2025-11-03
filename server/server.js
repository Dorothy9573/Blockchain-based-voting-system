// server.js
import express from "express";
import cors from "cors";
import Web3 from "web3";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Sepolia via Alchemy
const web3 = new Web3(
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || "YOUR_API_KEY_HERE"}`
);

const contractAddress = "0x8E7AB13e7703888FCD0953582BD633e66675F778";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "candidates",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "voteCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "candidatesCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_candidateId", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
        votes: c.voteCount,
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
      gas: 300000,
    });

    res.json({
      success: true,
      transactionHash: tx.transactionHash,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("Connected to Sepolia Contract");
});

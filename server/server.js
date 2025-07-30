const express = require('express');
const { Web3 } = require('web3');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors({
  origin: 'http://localhost:3000' // Frontend URL
}));
app.use(express.json());

// 1. Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545'); 

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
          "name": "",
          "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 3. Use your actual contract address
const contractAddress = "0xE287304F43eC2B7eb044628a66419b1E27dCEd5A"; 
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// 4. API Endpoints
app.post('/api/vote', async (req, res) => {
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

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/candidates', async (req, res) => {
  try {
    const candidateCount = await votingContract.methods.candidatesCount().call();
    const candidates = [];
    
    for (let i = 1; i <= candidateCount; i++) {
      const candidate = await votingContract.methods.candidates(i).call();
      candidates.push({
        id: candidate.id,
        name: candidate.name,
        votes: candidate.voteCount
      });
    }
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
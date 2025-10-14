// src/App.js

import React, { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import VotingSystem from './artifacts/VotingSystem.json';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import VoterPage from './pages/VoterPage';

function App() {
  const [account, setAccount] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [electionOpen, setElectionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // New state to force VoterPage to re-sync after an admin reset
  const [authorizedVotersReset, setAuthorizedVotersReset] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const provider = await detectEthereumProvider();
      if (!provider) { 
        alert("Please install MetaMask!"); 
        setLoading(false);
        return; 
      }
      
      const web3 = new Web3(provider);
      
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      setAccount(currentAccount);

      const expectedChainId = '0xaa36a7'; 
      const currentChainId = await provider.request({ method: 'eth_chainId' });
      if (currentChainId !== expectedChainId) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: expectedChainId }],
          });
        } catch (switchError) {
          console.error("Could not switch network. Please do so manually in MetaMask.", switchError);
          setLoading(false);
          return;
        }
      }

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingSystem.networks[networkId];
      if (!deployedNetwork) { 
        alert("Contract not deployed to this network.");
        setLoading(false); 
        return; 
      }
      const instance = new web3.eth.Contract(VotingSystem.abi, deployedNetwork.address);
      setContractInstance(instance);

      const adminAddr = await instance.methods.admin().call();
      setIsAdmin(currentAccount.toLowerCase() === adminAddr.toLowerCase());

      const openStatus = await instance.methods.electionOpen().call();
      setElectionOpen(openStatus);
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. See console for details.");
      setAccount('');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContractInstance(null);
    setIsAdmin(false);
    setElectionOpen(false);
    navigate('/');
  };

  const resetVotersState = () => {
    // This function is called by AdminPage to trigger a state reset
    setAuthorizedVotersReset(prev => !prev);
  };

  useEffect(() => {
    const provider = window.ethereum;
    if (provider) {
      provider.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setLoading(false);
        }
      });
      
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        connectWallet();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
        setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        Connecting wallet...
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">Voting System</div>
        <div className="nav-links">
          <Link to="/" className="home-link">Home</Link>
          {account && (
            <span className="wallet-address">{account.slice(0, 6)}...{account.slice(-4)}</span>
          )}
          {isAdmin && (
            <button className="admin-access-btn" onClick={() => navigate('/admin')}>
              Admin Access
            </button>
          )}
          {account ? (
            <button className="connect-wallet-btn" onClick={disconnectWallet}>Disconnect</button>
          ) : (
            <button className="connect-wallet-btn" onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage account={account} connectWallet={connectWallet} isAdmin={isAdmin} />} />
          
          <Route path="/admin" element={
            isAdmin ? (
              <AdminPage 
                contract={contractInstance} 
                account={account} 
                electionOpen={electionOpen} 
                setElectionOpen={setElectionOpen}
                resetVotersState={resetVotersState} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          
          <Route path="/vote" element={
            account && contractInstance ? (
              <VoterPage 
                contract={contractInstance} 
                account={account} 
                electionOpen={electionOpen}
                authorizedVotersReset={authorizedVotersReset} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </div>
      
      <footer className="app-footer"><p>Powered by Ethereum Blockchain</p></footer>
    </div>
  );
}

export default () => (
  <Router>
    <App />
  </Router>
);
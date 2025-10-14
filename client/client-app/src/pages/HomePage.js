// src/pages/HomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // You'll need to create this CSS file

const HomePage = ({ account, connectWallet, isAdmin }) => {
  const navigate = useNavigate();

  const handleEnterSystem = () => {
    if (account) {
      // Securely navigate based on the isAdmin state
      navigate(isAdmin ? '/admin' : '/vote');
    } else {
      connectWallet();
    }
  };

  return (
    <section className="hero">
      <div className="blockchain-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15L12 9L19 15M5 15L12 21M5 15V9M19 15L12 21M19 15V9M12 21V9M12 9V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1>Blockchain-Based Voting System</h1>
      <p>A decentralized voting platform powered by Ethereum blockchain technology. Secure, transparent, and easy to use.</p>
      <button
        className="enter-system-btn"
        onClick={handleEnterSystem}
      >
        {account ? 'ENTER THE VOTING SYSTEM' : 'CONNECT WALLET TO ENTER'}
      </button>
    </section>
  );
};

export default HomePage;
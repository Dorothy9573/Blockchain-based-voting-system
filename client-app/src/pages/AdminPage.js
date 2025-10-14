// src/pages/AdminPage.js

import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = ({ contract, account, electionOpen, setElectionOpen, resetVotersState }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voterAddress, setVoterAddress] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [modalAction, setModalAction] = useState(null); // 'start', 'end', or 'reset'

  useEffect(() => {
    if (contract) {
      loadCandidates();
    }
  }, [contract, electionOpen]);

  const loadCandidates = async () => {
    const candidatesCount = await contract.methods.candidatesCount().call();
    const loadedCandidates = [];
    for (let i = 1; i <= candidatesCount; i++) {
      const candidate = await contract.methods.candidates(i).call();
      loadedCandidates.push({
        id: candidate.id,
        name: candidate.name,
        voteCount: candidate.voteCount,
      });
    }
    setCandidates(loadedCandidates);
  };

  const handleToggleElection = async () => {
    try {
      await contract.methods.toggleElection().send({ from: account });
      const newStatus = await contract.methods.electionOpen().call();
      setElectionOpen(newStatus);
      if (!newStatus) {
        await loadCandidates();
      }
    } catch (error) {
      console.error("Error toggling election:", error);
      alert("Error toggling election. Check console for details.");
    }
    setShowConfirmation(false);
    setModalAction(null);
  };

  const handleResetElection = async () => {
    try {
      await contract.methods.resetElection().send({ from: account });
      setCandidates([]);
      setElectionOpen(false);
      alert("Election has been reset successfully!");
      resetVotersState(); // Call the new function here!
    } catch (error) {
      console.error("Error resetting election:", error);
      alert("Error resetting election. Check console for details.");
    }
    setShowConfirmation(false);
    setModalAction(null);
  };

  const addVoter = async () => {
    if (!voterAddress.trim()) return;
    try {
      await contract.methods.addVoter(voterAddress).send({ from: account });
      alert(`Voter ${voterAddress} authorized successfully!`);
      setVoterAddress('');
    } catch (error) {
      alert("Error authorizing voter. Check console for details.");
      console.error("Error authorizing voter:", error);
    }
  };

  const addCandidate = async () => {
    if (!candidateName.trim()) return;
    try {
      await contract.methods.addCandidate(candidateName).send({ from: account });
      alert(`Candidate ${candidateName} added successfully!`);
      setCandidateName('');
      await loadCandidates();
    } catch (error) {
      alert("Error adding candidate. Check console for details.");
      console.error("Error adding candidate:", error);
    }
  };

  const openConfirmationModal = (action) => {
    setModalAction(action);
    setShowConfirmation(true);
  };

  const getModalText = () => {
    if (modalAction === 'start') {
      return 'Do you want to start the election?';
    } else if (modalAction === 'end') {
      return 'Are you sure you want to end the election? This cannot be undone.';
    } else if (modalAction === 'reset') {
      return 'Are you sure you want to reset the entire election? This will delete all candidates, voters, and votes.';
    }
    return '';
  };

  const handleModalAgree = () => {
    if (modalAction === 'start' || modalAction === 'end') {
      handleToggleElection();
    } else if (modalAction === 'reset') {
      handleResetElection();
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className={`election-status ${electionOpen ? 'open' : 'closed'}`}>
          ELECTION STATUS: {electionOpen ? 'Election in progress' : 'Election has not started'}
        </div>
      </div>

      <div className="admin-content">
        {/* Election Control Section */}
        <div className="admin-section">
          <h2>Election Controls</h2>
          {!electionOpen && candidates.length === 0 && (
            <p className="status-message">Add candidates and then start the election.</p>
          )}

          {/* Start Election Button */}
          {!electionOpen && candidates.length > 0 && (
            <button className="admin-button start-election" onClick={() => openConfirmationModal('start')}>
              START ELECTION
            </button>
          )}

          {/* End Election Button */}
          {electionOpen && (
            <button className="admin-button end-election" onClick={() => openConfirmationModal('end')}>
              END ELECTION
            </button>
          )}

          {/* Reset Election Button */}
          {!electionOpen && candidates.length > 0 && (
            <button 
              className="admin-button" 
              onClick={() => openConfirmationModal('reset')} 
              style={{ backgroundColor: '#e74c3c', marginTop: '1rem' }}
            >
              RESET ELECTION
            </button>
          )}
        </div>

        {/* Manage Voters & Candidates Section */}
        <div className="admin-section">
          <h2>Manage Voters & Candidates</h2>
          <div className="admin-input-group">
            <label>Voter's Address</label>
            <input
              type="text"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              placeholder="Enter voter's address (e.g., 0x...)"
            />
            <button className="admin-button add-voter" onClick={addVoter} disabled={!voterAddress.trim()}>
              AUTHORIZE VOTER
            </button>
          </div>
          <div className="admin-input-group">
            <label>Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
            />
            <button className="admin-button add-candidate" onClick={addCandidate} disabled={!candidateName.trim()}>
              ADD CANDIDATE
            </button>
          </div>
        </div>

        {/* Results Display Section */}
        {candidates.length > 0 && (
          <div className="admin-section results-summary">
            <h2>{electionOpen ? 'LIVE RESULTS' : 'FINAL RESULTS'}</h2>
            <div className="candidates-grid">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <div className="candidate-name">{candidate.name}</div>
                  <div className="vote-count">{candidate.voteCount.toString()} votes</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>{getModalText()}</p>
            <div className="modal-buttons">
              <button className="admin-button cancel-button" onClick={() => setShowConfirmation(false)}>
                DISAGREE
              </button>
              <button className="admin-button confirm-button" onClick={handleModalAgree}>
                AGREE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
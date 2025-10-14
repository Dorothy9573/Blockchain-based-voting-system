// src/pages/VoterPage.js

import React, { useState, useEffect } from 'react';
import './VoterPage.css';

const VoterPage = ({ contract, account, electionOpen, authorizedVotersReset }) => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // New state for voter authorization
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract && account) {
      loadVoterData();
    }
  }, [contract, account, electionOpen, authorizedVotersReset]);

  const loadVoterData = async () => {
    setLoading(true);
    try {
      const authorizedStatus = await contract.methods.authorizedVoters(account).call();
      setIsAuthorized(authorizedStatus);

      const votedStatus = await contract.methods.voters(account).call();
      setHasVoted(votedStatus);

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
    } catch (error) {
      console.error('Error loading voter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidateId) {
      alert('Please select a candidate to vote.');
      return;
    }
    if (!isAuthorized) {
      alert('You are not authorized to vote.');
      return;
    }
    if (hasVoted) {
      alert('You have already voted!');
      return;
    }
    if (!electionOpen) {
      alert('The election is not open for voting.');
      return;
    }
    try {
      await contract.methods.vote(selectedCandidateId).send({ from: account });
      alert('Your vote has been cast successfully!');
      await loadVoterData();
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Error casting vote. Please check the console.');
    }
  };

  if (loading) {
    return <div className="voter-container">Loading...</div>;
  }

  return (
    <div className="voter-container">
      <div className="voter-header">
        <h1>Voter's Dashboard</h1>
        <p className={`election-status ${electionOpen ? 'open' : 'closed'}`}>
          ELECTION STATUS: {electionOpen ? 'Election in progress' : 'Election has not started'}
        </p>
      </div>

      <div className="voter-content">
        {!isAuthorized ? (
          <div className="status-message">
            <p>Your wallet address is not authorized to vote in this election. Please contact the administrator.</p>
          </div>
        ) : hasVoted ? (
          <div className="status-message">
            <p>Thank you for voting. Your vote has been recorded.</p>
          </div>
        ) : (
          !electionOpen && (
            <div className="status-message">
              <p>The election is currently closed. You cannot vote at this time.</p>
            </div>
          )
        )}

        {isAuthorized && !hasVoted && electionOpen && (
          <div className="vote-section">
            <h3>Select your candidate:</h3>
            <div className="candidates-grid">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`candidate-card ${selectedCandidateId === candidate.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                  >
                    <div className="candidate-name">{candidate.name}</div>
                  </div>
                ))
              ) : (
                <p>No candidates have been added yet.</p>
              )}
            </div>
            {candidates.length > 0 && (
              <button className="vote-button" onClick={handleVote} disabled={!selectedCandidateId}>
                Submit Vote
              </button>
            )}
          </div>
        )}

        {isAuthorized && (hasVoted || !electionOpen) && candidates.length > 0 && (
          <div className="results-section">
            <h3>{electionOpen ? 'Live Results' : 'Final Results'}</h3>
            <div className="results-grid">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="result-card">
                  <div className="candidate-name">{candidate.name}</div>
                  <div className="vote-count">{candidate.voteCount.toString()} votes</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterPage;
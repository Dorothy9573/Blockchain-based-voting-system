// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    address public admin;
    bool public electionOpen;
    
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters; // Tracks if an authorized voter has voted
    mapping(address => bool) public authorizedVoters; // Tracks which wallets are authorized to vote
    address[] public authorizedVoterList;
    uint public candidatesCount;

    event ElectionToggled(bool isOpen);
    event Voted(address voter, uint candidateId);
    event CandidateAdded(uint candidateId, string name);
    event VoterAuthorized(address voterAddress);
    event ElectionReset();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyWhenOpen() {
        require(electionOpen, "Election closed");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionOpen = false;
    }

    function toggleElection() public onlyAdmin {
        electionOpen = !electionOpen;
        emit ElectionToggled(electionOpen);
    }
    
    function resetElection() public onlyAdmin {
        require(!electionOpen, "Cannot reset election while it is open");
        
        // Clear all candidates
        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        candidatesCount = 0;
        
        // Clear all voters and their voting status using the authorizedVoterList
        for (uint i = 0; i < authorizedVoterList.length; i++) {
            delete voters[authorizedVoterList[i]];
            delete authorizedVoters[authorizedVoterList[i]];
        }
        
        // Clear the list of authorized voters itself
        delete authorizedVoterList;
        
        emit ElectionReset();
    }

    function addVoter(address _voterAddress) public onlyAdmin {
        require(_voterAddress != address(0), "Invalid address");
        require(!authorizedVoters[_voterAddress], "Voter is already authorized");

        authorizedVoters[_voterAddress] = true;
        authorizedVoterList.push(_voterAddress);
        emit VoterAuthorized(_voterAddress);
    }

    function vote(uint _candidateId) public onlyWhenOpen {
        require(authorizedVoters[msg.sender], "Voter is not authorized");
        require(!voters[msg.sender], "Voter has already cast their vote");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    function addCandidate(string memory _name) public onlyAdmin {
        _addCandidate(_name);
    }

    function _addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function getCandidate(uint _id) public view returns (uint, string memory, uint) {
        require(_id > 0 && _id <= candidatesCount, "Invalid candidate ID");
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.voteCount);
    }
}
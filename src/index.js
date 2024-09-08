const dotenv = require('dotenv');
const { ethers } = require('ethers');
const express = require('express');
const bodyParser = require('body-parser');
const { contractABI } = require('./abi');
dotenv.config();

const provider = new ethers.InfuraProvider('sepolia', process.env.INFURA_API_KEY);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const votingContract = new ethers.Contract(contractAddress, contractABI, wallet);

const app = express();
app.use(bodyParser.json());

app.post('/vote', async (req, res) => {
    const { candidateId } = req.body;
    try {
        const tx = await votingContract.vote(candidateId);
        console.log(`Voting for candidate ${candidateId}...`);
        await tx.wait();
        res.send('Vote successful!');
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).send('Error voting');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

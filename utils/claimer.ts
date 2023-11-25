import { ethers } from 'ethers';
import fs from 'fs/promises';
import log4js from 'log4js';
import dotenv from 'dotenv';

dotenv.config();

const ClaimContractAddress = process.env.CLAIMER_ADDRESS || '<TOKEN_CLAIMER_VIA_MERKLE_PROOF_ADDRESS>';
const exp_url = process.env.EXP_URL || 'https://explorer.zksync.io/tx/';
log4js.configure({
  appenders: { file: { type: 'file', filename: './data/tx_data/logs/transactions.log' } },
  categories: { default: { appenders: ['file'], level: 'info' } },
});

const logger = log4js.getLogger();

interface AddressData {
  address: string;
  amount: number;
  proof: string[];
}

async function loadData(): Promise<AddressData[]> {
  const { amounts, proofs } = JSON.parse(
    await fs.readFile('./data/tx_data/get_proofs.json', 'utf-8')
  );

  return amounts.map((amountData: any) => ({
    address: amountData.address,
    amount: amountData.amount,
    proof: proofs.find((proofData: any) => proofData.address === amountData.address)?.proof || [],
  }));
}

async function getAmountForAddress(address: string): Promise<number | undefined> {
  const merkleProofs = await loadData();
  const addressData = merkleProofs.find(data => data.address.toLowerCase() === address.toLowerCase());
  return addressData?.amount;
}

async function getProofForAddress(address: string): Promise<string[] | undefined> {
  const merkleProofs = await loadData();
  const addressData = merkleProofs.find(data => data.address.toLowerCase() === address.toLowerCase());
  return addressData?.proof;
}

export async function sendClaimTransactions() {
  try {
    const privateKeys: string[] = (await fs.readFile('./data/private_keys.txt', 'utf-8'))
      .split('\n')
      .map(key => key.trim())
      .filter(Boolean);

    const rpcs: string[] = (await fs.readFile('./data/rpcs.txt', 'utf-8'))
      .split('\n')
      .map(rpc => rpc.trim())
      .filter(Boolean);

    if (privateKeys.length !== rpcs.length) {
      throw new Error('❗Number of private keys does not match the number of RPCs');
    }

    const contractAddress = ClaimContractAddress;
    const contractABI: ethers.utils.Fragment[] = JSON.parse(await fs.readFile('./data/abi.json', 'utf-8'));

    for (let i = 0; i < privateKeys.length; i++) {
      const privateKey = privateKeys[i];
      const rpcUrl = rpcs[i];

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      const address = wallet.address;

      const amount = await getAmountForAddress(address);
      const proof = await getProofForAddress(address);

      if (amount === undefined || proof === undefined) {
        console.error(`❌ Txn data is not available for address: ${address}`);
        logger.error(`Txn data is not available for address: ${address}`);
        continue;
      }

      const proofStringArray = proof.map(item => ethers.utils.hexlify(item));

      const amountBN = ethers.utils.parseEther(amount.toString());
      const gasLimit = 600000; // Set an appropriate gas limit

      const contract = new ethers.Contract(contractAddress, contractABI, wallet);
      const tx = await contract.claim(proofStringArray, amountBN, {
        gasLimit: gasLimit,
      });

      try {
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          console.log(`✅ Claim transaction successful for address: ${address}`);
          console.log(`View on Blockchain explorer: ${exp_url}${exp_url}${tx.hash}`);
          logger.info(`Claim transaction successful for address: ${address}. Transaction Hash: ${exp_url}${tx.hash}`);
        } else {
          console.log(`❌ Claim transaction failed for address: ${address}`);
          logger.error(`Claim transaction failed for address: ${address}. Transaction Hash: ${exp_url}${tx.hash}`);
        }
      } catch (error: any) {
        console.error(`❌ Error processing claim transactions for address ${address}:`, error.message);
        logger.error(`Error processing claim transactions for address ${address}: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error processing claim transactions:', error.message);
    logger.error(`Error processing claim transactions: ${error.message}`);
  }
}

// Uncomment the line below to run the function to process claim transactions for multiple wallets
//sendClaimTransactions();

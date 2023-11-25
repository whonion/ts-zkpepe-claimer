import axios from 'axios';
import * as fs from 'fs/promises';
import * as log4js from 'log4js';

const HEADERS = {
  'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
  'Accept': 'application/json, text/plain, */*',
  'Referer': 'https://www.zksyncpepe.com/airdrop',
  'sec-ch-ua-mobile': '?0',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'X-KL-saas-Ajax-Request': 'Ajax_Request',
  'sec-ch-ua-platform': '"Windows"',
};

async function fetchMerkleProof(address: string): Promise<string[] | null> {
  try {
    const response = await axios.get(`https://www.zksyncpepe.com/resources/amounts/${address}.json`, { headers: HEADERS });
    getLogger().info(`${address}: ${JSON.stringify(response.data)}`);
    return response.data.proof;
  } catch (error: any) {
    getLogger().error(`❌ Failed to fetch Merkle proof for address ${address}: ${error.message}`);
    return null;
  }
}

export async function fetchAndSaveAmounts() {
  try {
    const addresses: string[] = (await fs.readFile('./data/addresses.txt', 'utf-8')).split('\n').map(address => address.trim().toLowerCase());

    for (const address of addresses) {
      const proof = await fetchMerkleProof(address);
      if (proof) {
        const filePath = `./data/tx_data/proofs/${address}_amount.txt`;

        try {
          await fs.writeFile(filePath, JSON.stringify(proof, null, 2));
          //getLogger().info(`✅ Proof for ${address} saved successfully at ${filePath}`);
        } catch (error: any) {
          //getLogger().error(`❌ Error writing to ${filePath}: ${error.message}`);
        }
      }
    }

    console.log('✅ All amounts fetched and saved');
  } catch (error: any) {
    console.log(`❌ An error occurred: ${error.message}`);
  }
}

function getLogger() {
  log4js.configure({
    appenders: { file: { type: 'file', filename: './data/tx_data/amounts.log', layout: { type: 'messagePassThrough' } } },
    categories: { default: { appenders: ['file'], level: 'info' } },
  });

  return log4js.getLogger();
}
//fetchAndSaveAmounts();

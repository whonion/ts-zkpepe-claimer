import fs from 'fs/promises';

interface AmountData {
  address: string;
  amount: number;
}

interface ProofData {
  address: string;
  proof: string[];
}

async function readAmountsAndProofs(): Promise<{ amounts: AmountData[], proofs: ProofData[] }> {
  try {
    const amountsRaw = await fs.readFile('./data/tx_data/amounts.log', 'utf-8');
    const proofsRaw = await fs.readFile('./data/tx_data/proofs.log', 'utf-8');

    const amounts: AmountData[] = parseAmounts(amountsRaw);
    const proofs: ProofData[] = parseProofs(proofsRaw);

    return { amounts, proofs };
  } catch (error:any) {
    console.error('Error reading files:', error.message);
    throw error;
  }
}

function parseAmounts(amountsRaw: string): AmountData[] {
  const amounts: AmountData[] = [];
  const lines = amountsRaw.split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;

    const [address, amountString] = line.split(':');
    const amountArray = JSON.parse(amountString.trim());
    const amount = amountArray[0]; // Assuming the amount is the first element in the array

    if (isNaN(amount)) {
      console.error(`Parsed amount NaN for address ${address}, setting it to 0`);
    }

    amounts.push({ address, amount: isNaN(amount) ? 0 : amount });
  }

  return amounts;
}

function parseProofs(proofsRaw: string): ProofData[] {
  const proofs: ProofData[] = [];
  const lines = proofsRaw.split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;

    const [address, proofString] = line.split(':');
    const proof = JSON.parse(proofString.trim());

    proofs.push({ address, proof });
  }

  return proofs;
}

async function saveJsonFile(data: any, filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Successfully created 'get_proofs.json' to ${filePath}`);
  } catch (error:any) {
    console.error('Error saving JSON file:', error.message);
    throw error;
  }
}

// Example usage:
export async function ParseLogs() {
  try {
    const { amounts, proofs } = await readAmountsAndProofs();
    //console.log('Amounts:', amounts);
    //console.log('Proofs:', proofs);

    // Save to JSON file
    await saveJsonFile({ amounts, proofs }, './data/tx_data/get_proofs.json');
  } catch (error:any) {
    console.error('Error:', error.message);
  }
}

//ParseLogs();

// main.ts
import { fetchAndSaveProofs } from './utils/getproof';
import { SumTokens } from './utils/sumtokens';
import { fetchAndSaveAmounts } from './utils/getamount';
import { ParseLogs } from './utils/parselog';
import { sendClaimTransactions } from './utils/claimer';

async function main() {
  try {
    // Call the function to fetch proofs and write to a file
    await fetchAndSaveProofs();
    await fetchAndSaveAmounts();
    await ParseLogs();
    SumTokens('./data/tx_data/amounts.log');

    // Call the function to send claim transactions
    //await sendClaimTransactions();
  } catch (error: any) {
    console.error('❌ An error occurred:', error.message);
  }
}
// Run the main function
main();

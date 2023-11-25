import * as fs from 'fs';
import * as readline from 'readline';

async function parseCsv(inputFilePath: string, outputFilePath: string): Promise<void> {
    const inputStream = fs.createReadStream(inputFilePath);
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity,
    });

    const addresses: string[] = [];

    for await (const line of rl) {
        const [, address] = line.split(',');
        if (address) {
            addresses.push(address);
        }
    }

    rl.close();

    // Write addresses to addresses.txt
    fs.writeFileSync(outputFilePath, addresses.join('\n'), 'utf-8');
}

const inputFilePath = './data/result.csv';
const outputFilePath = './data/addresses.txt';

parseCsv(inputFilePath, outputFilePath)
    .then(() => console.log('✅ All Addresses extracted and written to addresses.txt'))
    .catch((error) => console.error('Error:', error));

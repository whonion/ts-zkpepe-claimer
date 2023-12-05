import * as fs from 'fs';

//const filePath = './data/tx_data/amounts.log';

function calculateSum(data: string): number {
    const regex = /\[(\d+)\]/g;
    let match;
    let sum = 0;

    while ((match = regex.exec(data)) !== null) {
        const number = parseInt(match[1], 10);
        sum += number;
    }

    return sum;
}

export function SumTokens(filePath: string): void {
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const rows = fileData.split(/\r?\n/);

        let totalSum = 0;
        let totalLines = 0;

        for (const row of rows) {
            if (row.trim() !== '') {  // Ignore empty lines
                const sum = calculateSum(row);
                totalSum += sum;
                totalLines += 1;
            }
        }      
        console.log('Total number of wallets:', totalLines);
        console.log('Total amount of $ZKPEPE tokens:', totalSum);
    } catch (error: any) {
        console.error('Error reading the file:', error.message);
    }
}

//SumTokens(filePath);

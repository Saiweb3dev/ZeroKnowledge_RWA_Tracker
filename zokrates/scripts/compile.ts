import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const zokratesPath = 'path/to/zokrates'; // Adjust this to your Zokrates binary location
const circuitPath = path.join(__dirname, '../circuits/asset_verifier.zok');
const outputPath = path.join(__dirname, '../generated');

async function compileCircuit(): Promise<void> {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        exec(`${zokratesPath} compile -i ${circuitPath} -o ${outputPath}/out`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Compilation error: ${error}`);
                return reject(error);
            }
            console.log('Circuit compiled successfully');
            resolve();
        });
    });
}

compileCircuit().catch(console.error);
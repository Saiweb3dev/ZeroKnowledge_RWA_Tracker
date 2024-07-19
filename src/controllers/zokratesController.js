// src/controllers/zokratesController.js
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const execPromise = util.promisify(exec);

// Construct the relative path
const ZOK_FILE_PATH = path.resolve(__dirname, '..', '..', 'zokrates', 'circuits', 'Zok_Prover.zok');
const ZOKRATES_PATH = 'zokrates'; 

const runZokrates = async (req, res) => {
    try {
        const { reqAddress, reqId, reqData, OrgAddress, OrgId, OrgData } = req.body;

        console.log(`Using Zokrates file: ${ZOK_FILE_PATH}`);

        // Compile the Zokrates code
        const { stdout: compileOutput } = await execPromise(`${ZOKRATES_PATH} compile -i "${ZOK_FILE_PATH}"`);

        // Setup
        const { stdout: setupOutput } = await execPromise(`${ZOKRATES_PATH} setup`);

        // Prepare the witness arguments
        const witnessArgs = [...reqAddress, reqId, reqData, ...OrgAddress, OrgId, OrgData].join(' ');

        // Compute witness
        const { stdout: computeWitnessOutput } = await execPromise(`${ZOKRATES_PATH} compute-witness -a ${witnessArgs}`);

        // Generate proof
        const { stdout: generateProofOutput } = await execPromise(`${ZOKRATES_PATH} generate-proof`);

        // Verify proof
        const { stdout: verifyOutput } = await execPromise(`${ZOKRATES_PATH} verify`);

        const verificationResult = verifyOutput.includes('PASSED') ? 'Verification passed' : 'Verification failed';

        res.json({
            message: 'Zokrates operations completed successfully',
            compileOutput,
            setupOutput,
            computeWitnessOutput,
            generateProofOutput,
            verificationResult,
            verifyOutput
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Zokrates execution failed', details: error.message });
    }
};

module.exports = {
    runZokrates
};
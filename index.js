import { withdrawalOKX } from './src/OKX.js';
import { generateRandomAmount, getDecimalCount, log, parseFile, timeout } from './src/other.js';
import readline from 'readline-sync';
import * as dotenv from 'dotenv';
dotenv.config();

const withdrawFromOKX = async(addressTo) => {
    try {
        const amountToken = generateRandomAmount(process.env.Amount_Withdraw_Min, process.env.Amount_Withdraw_Max, getDecimalCount(process.env.Amount_Withdraw_Max) + 1);
        const apiSecret = process.env.apiSecret;
        const apiKey = process.env.apiKey;
        const apiPassphrase = process.env.apiPassphrase;
        const coin = process.env.coin;
        const chain = process.env.chain;
        const fee = process.env.fee;

        await withdrawalOKX(coin, amountToken, addressTo, fee, chain, apiSecret, apiKey, apiPassphrase).then((res) => {
            if (res.data.msg == '') {
                console.log(res.data.data);
                log('info', 'green', `Successful Withdraw ${amountToken}${coin} transaction id: ${res.data.data}, toAddress: ${addressTo}`);
            } else {
                log('error', 'red', `Error transaction: ${res.data.msg}, toAddress: ${addressTo}`);
            }
        });
    } catch (err) {
        log('error', 'red', err.message);
        return;
    }
}

(async() => {
    const address = parseFile('address.txt');
    const mainStage = [
        'Start',
    ];

    const index = readline.keyInSelect(mainStage, 'Choose stage!');
    if (index == -1) { process.exit() };
    log('info', 'green', `Start ${mainStage[index]}`);
    
    for (let i = 0; i < address.length; i++) {
        let pauseWalletTime = generateRandomAmount(process.env.TIMEOUT_WALLET_SEC_MIN * 1000, process.env.TIMEOUT_WALLET_SEC_MAX * 1000, 0);
        try {
            log('info', 'blue', `Deposit Address ${i+1}: ${address}`);
        } catch (err) { console.log(err.message); }; //throw new Error('Error: Add Deposit Address!')

        if (index == 0) {
            await withdrawFromOKX(address[i]);
        }

        await timeout(pauseWalletTime);
    }

    log('info', 'bgMagentaBright', 'Process End!');
})();
import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export const balanceOKX = async(coin, apiSecret, apiKey, apiPassphrase) => {
    const date = Date.now()/1000
    const sign = Base64.stringify(hmacSHA256(date + 'GET' + `/api/v5/asset/balances?ccy=${coin}`, apiSecret));
    const response = await axios.get('https://www.okx.com' + `/api/v5/asset/balances?ccy=${coin}`, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': apiKey,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': apiPassphrase,
            'OK-ACCESS-TIMESTAMP': date,
        }
    });

    return response.data.data[0];
}

export const withdrawalOKX = async(coin, amount, address, fee, chain, apiSecret, apiKey, apiPassphrase) => {
    const date = Date.now()/1000
    const data = JSON.stringify({ 
        ccy: coin,
        amt: amount,
        dest: '4',
        toAddr: address,
        fee: fee,
        chain: chain,
    });
    const sign = Base64.stringify(hmacSHA256(date + 'POST' + '/api/v5/asset/withdrawal' + data, apiSecret));
    const response = await axios.post('https://www.okx.com/api/v5/asset/withdrawal', data, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': apiKey,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': apiPassphrase,
            'OK-ACCESS-TIMESTAMP': date,
        }
    });

    return response;
}

export const sendToMaster = async(coin, amount, apiSecret, apiKey, apiPassphrase) => {
    const date = Date.now()/1000
    const data = JSON.stringify({ 
        ccy: coin,
        amt: amount,
        from: '6',
        to: '6',
        type: '3',
    });

    const sign = Base64.stringify(hmacSHA256(date + 'POST' + `/api/v5/asset/transfer` + data, apiSecret));
    const response = await axios.post('https://www.okx.com' + `/api/v5/asset/transfer`, data, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': apiKey,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': apiPassphrase,
            'OK-ACCESS-TIMESTAMP': date,
        }
    });

    return response;
}
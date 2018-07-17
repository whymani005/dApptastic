/*
//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

//run with local daemon
// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', {protocol: 'http'});

export default ipfs;
*/

//https://www.npmjs.com/package/ipfs-mini
//https://medium.com/coinmonks/a-gentle-intro-to-building-a-full-stack-dapp-on-ethereum-part-3-c48e99b4d3e8
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const setJSON = (obj) => {
    return new Promise((resolve, reject) => {
        ipfs.addJSON(obj, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        });
    });
}

export const getJSON = (hash) => {
    return new Promise((resolve, reject) => {
        ipfs.catJSON(hash, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}



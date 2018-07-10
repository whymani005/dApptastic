//https://github.com/SilentCicero/react-dapp-boilerplate/blob/master/app/web3.js

import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') { 
  //inside browser & metamask is available
  web3 = new Web3(window.web3.currentProvider);
  console.log('[getWeb3] Injected web3 detected.');
} else { 
  //we are on server OR user doesn't have metamask
  //console.warn("No web3 detected. 
  //Falling back to http://127.0.0.1:8545. 
  //You should remove this fallback when you deploy live, 
  //as it's inherently insecure.

  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
  web3 = new Web3(provider);
  console.log('[getWeb3] No web3 instance injected, using local web3.');
}

export default web3;
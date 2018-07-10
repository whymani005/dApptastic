import { Connect, SimpleSigner } from 'uport-connect';

//export let uport = new Connect('TruffleBox');

//essentially connected our react app with uPort decentralized platform
//uPort has deployed registeries only on certain test networks - rinkeby or ropsten or kovan


export let uport = new Connect('dApptastic_test', {
  clientId: '2owP5S2LZSLz6Vk3hVy2gEEwmVqucW6PDc3',
  network: 'rinkeby',
  signer: SimpleSigner('ba0a59261c095812c7c4374d6f03b91d8bbfa2442f270fecc96dfe6c293bf0eb')
});


export const web3 = uport.getWeb3();

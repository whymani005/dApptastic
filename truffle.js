//http://truffleframework.com/docs/advanced/configuration
//https://truffleframework.com/tutorials/using-infura-custom-provider

//usage: truffle migrate --network local

var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = process.env.MNEMONIC;
var infuraToken = process.env.INFURA_TOKEN;

//connect to a network and unlock an account for use on that network
module.exports = {
  networks: {
    local: {
	    host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
	  },
    ropsten: {
      provider: function() { 
      	return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/'+infuraToken) 
	    },
      network_id: 3
    },
    rinkeby: {
      provider: function() { 
      	return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/'+infuraToken) 
	    },
      network_id: 4
    },
    mainnet: {
      provider: function() { 
      	return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/'+infuraToken) 
	    },
      network_id: 1
    }
  }
};

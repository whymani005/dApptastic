*WORK IN PROGRESS*

# dApptastic
A dApp to help you become a more fantastic version of you!

### Setup <h2>
* `git clone`
* `npm install truffle -g`
* `npm install ganace-cli -g`
* `cd /into/project/root`
* `npm install`. Creates node_modules directory

### Run <h2>
* In terminal `ganache-cli`. Leave terminal tab open
* In terminal `cd path/to/project`
* `truffle compile`. Will compile all contracts and create build directory
* `truffle migrate --reset --network local`. Will deploy all contracts to your locally running chain
* `truffle test ./test/[fileName].js`. Will test all functions in that file
* `truffle test`. Will run all tests
* `npm run start`. Serves up UI on localhost:3000

### Info <h2>
If you have problems, delete `/build` and maybe `/node_modules` and re-run the steps above.\
You can find the design wiki [here](https://github.com/whymani005/dApptastic/wiki).

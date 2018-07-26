*WORK IN PROGRESS*

# dApptastic
A dApp to help you become a more fantastic version of you!\
You can find a detailed design wiki [here](https://github.com/whymani005/dApptastic/wiki).

### Setup <h2>
* `git clone`
* `npm install truffle -g`
* `npm install ganace-cli -g`
* `cd /into/project/root`
* `npm install`. Creates node_modules directory

### Run <h2>
* In terminal `ganache-cli`. Leave terminal tab open
* In browser, login to Metamask with the seed phrase on 127.0.0.0:8454, and verify accounts created match what's shown.
* In another terminal `cd path/to/project`
* `truffle compile`. Will compile all contracts and create build directory
* `truffle migrate --reset --network local`. Will deploy all contracts to your locally running chain
* `truffle test ./test/[fileName].js`. Will test all functions in that file
* `truffle test`. Will run all tests
* `npm run start`. Serves up UI on localhost:3000

### Troubleshooting <h2>
* If you have problems, delete `/build` and maybe `/node_modules` and re-run the steps above.\
* If you have problems logging in from UI using uport:
  * Check the console log of the browser: If the error is related to JWT timestamp - try updating your UPort app and try again. Not much documentation on this, but here is a [ref](https://medium.com/uport/uport-library-breaking-change-8a9fdd3b7059). This issue has been intermittent.

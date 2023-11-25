[![Status](https://img.shields.io/badge/Project%20Stage-Development-yellowgreen.svg)](https://github.com/whonion/ts-zkpepe-claimer/blob/main/) [![Build TS](https://github.com/whonion/ts-zkpepe-claimer/actions/workflows/build.yml/badge.svg)](https://github.com/whonion/ts-zkpepe-claimer/actions/workflows/build.yml) ![Node Version](https://img.shields.io/badge/Node.js-20.9.0-blue.svg) [![ts-node](https://img.shields.io/badge/ts--node-10.9.1-brightgreen)](https://www.npmjs.com/package/ts-node) [![viem](https://img.shields.io/badge/viem-1.19.9-blue)](https://www.npmjs.com/package/viem) ![Axios Version](https://img.shields.io/badge/axios-1.6.2-red.svg) ![Ethers Version](https://img.shields.io/badge/ethers-5.7.2-red.svg) [![HitCount](https://hits.dwyl.com/whonion/ts-zkpepe-claimer.svg)](https://hits.dwyl.com/whonion/ts-zkpepe-claimer)</br>
## zkpepe-claimer
![ts-zkpepe-claimer](https://www.zksyncpepe.com/assets/pic1.5fa188ad.png)<br>
### Preview VS Code
![Preview VS Code](https://github.com/whonion/ts-zkpepe-claimer/blob/main/.github/preview.gif?raw=true)<br>
### TypeScript impelementation of zkpepe's claimer via merkle-proof getting back-end [zkpepe.com](https://www.zksyncpepe.com/airdrop)

### Install `Node.js`
```sh
sudo apt install git
sudo apt install nodejs
sudo apt install npm
node -v
npm -v
```
### Clone repo and install dependencies
```sh
git clone https://github.com/whonion/ts-zkpepe-claimer.git
cd ts-zkpepe-claimer
npm i
npm i -g typescript
npm i -g ts-node
```
### Module's description:
 - `main.ts` -  The direct module that performs obtaining proofs,amounts, claim and swap claimed tokens;
 - `parsecsv.ts` - The module parses a csv file with addresses and creates a list of clean addresses for the main script to work with;<br>
*example.csv*
```csv
1,0x4648451b5F87FF8F0F7D622bD40574bb97E25980,69420;;;;;
2,0xA807248277aa8b2CcD935E10aF6315F6C94Dc9C2,69420;;;;;
3,0x8FEd78F00B2992dd4E36884d11C21d6227FFa073,69420;;;;;
4,0x3c8c8718eeFBB8B85e2b859789410620Fa6e549E,69420;;;;;
5,0x4c5e78392cc2F1634391539990aa6E213c846Dc1,69420;;;;;
6,0x98032C58408e9681E1AFF9bA398436Bb315D3d30,69420;;;;;
7,0xbbBb0731fb53a7C1A87AF3280319E9a91e318b88,69420;;;;;
```
 - `parselog.ts` - The module for create `data/tx_data/get_proof.json`-file
 - `getproof.ts` - The module for getting merkle-proofs from the back-end;
 - `getamount.ts` - The module for getting amounts from the back-end;
 - `claimer.ts` - The module for claiming tokens from a token distributor contract;
 - `swap.ts` - The module for quick sales claimed tokens;
### Required actions:
 - rename `data/addresses.txt.example` to `data/addresses.txt` and add your eligible addresses;
 - rename `data/rpcs.txt.example` to `data/rpcs.txt` and add your private instant rpc zkSync Era;
 - rename `data/private_keys.txt.example` to `data/private_keys.txt` and add the corresponding `addresses.txt` private keys;
 - rename `data/proxies.txt.example` to `data/proxies.txt` and add your private proxies in format `IP:PORT:login:password`;
## Run Script
```sh
npm run start
```
## Run individual modules:
```sh
npm run proof #get proofs
npm run amount #get amounts
npm run parsecsv #make addresses.txt from result.csv
npm run createjson #make 'get_proof.json' from logs
npm run claim #make claim
npm run swap #make swap
```


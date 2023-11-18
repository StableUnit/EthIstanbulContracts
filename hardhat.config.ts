import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-truffle5";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

const envPath = "./.env";
dotenv.config({ path: envPath });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    accounts.forEach((account) => console.log(account.address));
});

const { INFURA_API_KEY, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY } = process.env;

const accountsTestnet = [
    process.env.PRIVATE_KEY_TESTNET_DEPLOYER,
    process.env.PRIVATE_KEY_TESTNET_ADMIN,
    process.env.PRIVATE_KEY_TESTNET_DAO,
    // process.env.PRIVATE_KEY_TESTNET_USER_1,
    // process.env.PRIVATE_KEY_TESTNET_USER_2,
];

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
    // Hardhat-deploy plugin extends the HardhatConfig's object with an optional namedAccounts field.
    // learn more https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
    namedAccounts: {
        deployer: 0,
        admin: {
            // core team
            default: 1,
            goerli: "0xE2661235b116781a7b30D4a675898cF9E61298Df",
        },
        dao: {
            // DAO multisig address or local EOA for testing
            default: 2,
            goerli: "0xdf92E30b3E8Ad232577087E036c1fDc6138bB2e9",
        },
        randomAccount: 3,
        userAccount: 4,
        liquidatorAccount: 5,
        alice: 6,
        bob: 7,
        carl: 8,
    },
    solidity: {
        compilers: [
            {
                // Some dependencies such as Uniswap_v3 require legacy solc version
                version: "0.7.6",
            },
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1,
                        details: {
                            yul: true,
                        },
                    },
                },
            },
        ],
    },
    networks: {
        hardhat: {
            // Fork of SEPOLIA
            forking: {
                url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
                blockNumber: 4719230,
            },
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
            minGasPrice: 5_000_000_000,
            blockGasLimit: 5_000_000_000,
            gas: 20_000_000,
            gasPrice: 3_000_000_000, // such a big amount can be used for contract deployment
        },
        ropsten: {
            url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
        matic: {
            url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
            gasPrice: 150_000_000_000, // such a big amount can be used for contract deployment
            accounts: accountsTestnet,
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: {
            mainnet: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
            polygonMumbai: POLYGONSCAN_API_KEY,
        },
    },
    mocha: {
        timeout: 80_000,
    },
    paths: {
        deploy: "deploy",
        deployments: "submodule-artifacts",
        imports: "imports",
    },
};

export default config;

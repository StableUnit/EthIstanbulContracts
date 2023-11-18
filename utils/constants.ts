// check https://docs.uniswap.org/contracts/v3/reference/deployments
import { ethers } from "hardhat";
import {ADDRESS_ZERO, createBN1e18} from "../test/test-utils";

export const UNISWAP_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const ORACLE_IDS = {
    MOCK_ORACLE: 1,
    CHRONICLE: 2,
    UNISWAP: 3
};

export type NetworkNameType = "localhost" | "sepolia" | "mainnet";

export const SUPPORTED_TOKENS = ["ETH"];
export const isNetworkSupported = (networkName: NetworkNameType) => ["sepolia", "mainnet", "localhost"].includes(networkName);

export const getMockAddress = async (name: string) => {
    return (await ethers.getContract(name)).address;
};

export const MOCK_TOKENS = ["MockWBTC"];

export const getMockConfig = async (networkName: NetworkNameType) => {
    if (networkName !== "localhost") return undefined;

    return [
        {
            name: "MockWBTC",
            address: await getMockAddress("MockWBTC"),
            decimals: 8,
            price: createBN1e18(20000),
        },
    ];
};

export const SEPOLIA = {
    USDT: {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        chroniclePriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        decimals: 18,
    },
    ETH: {
        address: ADDRESS_ZERO,
        chroniclePriceFeed: "0x90430C5b8045a1E2A0Fc4e959542a0c75b576439",
        decimals: 18,
    },
    AAVE_POOL_ADDRESS: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
};

export const getConstants = (networkName: NetworkNameType) => {
    switch (networkName) {
        case "localhost":
        case "mainnet":
        case "sepolia":
        default:
            return SEPOLIA;
    }
};

export type ConstantsType = typeof SEPOLIA;
export type ConstantsTokenType = typeof SEPOLIA.ETH;

export const SELF_KISSER_ABI = [
    "function selfKiss(address oracle, address who)",
    "function selfKiss(address oracle)",
];
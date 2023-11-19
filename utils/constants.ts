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
    if (name === 'ETH') return ADDRESS_ZERO;
    return (await ethers.getContract(name)).address;
};

export const MOCK_TOKENS = ["MockSHIB", "ETH"];

export const getMockConfig = async (networkName: NetworkNameType) => {
    if (networkName !== "localhost") return undefined;

    return [
        {
            name: "ETH",
            address: ADDRESS_ZERO,
            decimals: 18,
            price: createBN1e18(1969),
        },
        {
            name: "MockSHIB",
            address: await getMockAddress("MockSHIB"),
            decimals: 18,
            price: createBN1e18(2, 14), // 0.0002
        },
    ];
};

export const SEPOLIA = {
    USDT: {
        address: "0xa1d7f71cbbb361a77820279958bac38fc3667c1a",
        chroniclePriceFeed: "0xF78A4e093Cd2D9F57Bb363Cc4edEBcf9bF3325ba",
        decimals: 18,
    },
    DAI: {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        chroniclePriceFeed: "0x16984396EE0903782Ba8e6ebfA7DD356B0cA3841",
        decimals: 18,
    },
    ETH: {
        address: ADDRESS_ZERO,
        chroniclePriceFeed: "0x90430C5b8045a1E2A0Fc4e959542a0c75b576439",
        decimals: 18,
    },
    SELF_KISSER: '0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d',
};

export const MAINNET = {
    ETH: {
        address: ADDRESS_ZERO,
        chroniclePriceFeed: "0x64DE91F5A373Cd4c28de3600cB34C7C6cE410C85",
        decimals: 18,
    },
    SELF_KISSER: '',
};

export const getConstants = (networkName: NetworkNameType) => {
    switch (networkName) {
        case "mainnet":
            return MAINNET;
        case "localhost":
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
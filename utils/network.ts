import { ethers } from "hardhat";
import { NetworkNameType } from "./constants";

export const getNetworkInfo: () => Promise<NetworkNameType> = async () => {
    const network = await ethers.provider.getNetwork();
    let networkName = network.name as NetworkNameType;

    // homestead - is the name for the local hardhat network
    if (network.name === "unknown" || network.name === "homestead") {
        networkName = "localhost";
    }

    return networkName;
};

export const sleep = (ms: number) => {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
};

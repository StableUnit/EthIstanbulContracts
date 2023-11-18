import { ethers } from "hardhat";

const { BigNumber } = ethers;

export const BLOCKS_IN_MINUTE = 4;
export const BLOCKS_IN_HOUR = BLOCKS_IN_MINUTE * 60;
export const BLOCKS_IN_DAY = BLOCKS_IN_HOUR * 24;

// Mine {blockNumber} blocks. The time between them is 1 second
export async function waitNBlocks(blockNumber: number) {
    await ethers.provider.send("hardhat_mine", [`0x${blockNumber.toString(16)}`]);
}

// Increase time for {seconds} seconds for the next block and mine that block
export async function waitAndMine(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
}

// Return timestamp of the last block
export const latest = async () => {
    const block = await ethers.provider.getBlock("latest");
    return BigNumber.from(block.timestamp);
};

// Return number of the last block
export const getLastBlockNumber = async () => {
    const lastBlock = await ethers.provider.getBlock("latest");
    return lastBlock.number;
};

export const duration = {
    seconds(val) {
        return val;
    },
    minutes(val) {
        return val * this.seconds(60);
    },
    hours(val) {
        return val * this.minutes(60);
    },
    days(val) {
        return val * this.hours(24);
    },
    weeks(val) {
        return val * this.days(7);
    },
    years(val) {
        return val * this.days(365);
    },
};

import { verify } from "../utils/verify";
import {ethers} from "hardhat";
import {MockSHIB, SuOracleAggregator} from "../typechain-types";
import {ADDRESS_ZERO} from "../test/test-utils";

async function main() {
    const mockSHIB = (await ethers.getContract("MockSHIB")) as MockSHIB;
    const suOracleAggregator = (await ethers.getContract("SuOracleAggregator")) as SuOracleAggregator;

    await verify("SuOracleAggregator");
    await verify("MockOracle");
    await verify("MeawLend", 'contracts/lending/MeawLend.sol:MeawLend', [mockSHIB.address, ADDRESS_ZERO, suOracleAggregator.address]);
    await verify("MockSHIB");
    await verify("SuAccessControlSingleton");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

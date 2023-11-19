import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {ADDRESS_ZERO} from "../test/test-utils";
import {MockSHIB, SuOracleAggregator} from "../typechain-types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const mockSHIB = (await ethers.getContract("MockSHIB")) as MockSHIB;
    const suOracleAggregator = (await ethers.getContract("SuOracleAggregator")) as SuOracleAggregator;

    await deployments.deploy("MeawLend", { from: deployer, args: [mockSHIB.address, ADDRESS_ZERO, suOracleAggregator.address] });
    console.log("✅ DeployLend done");
};
export default func;
func.tags = ["DeployLend"];

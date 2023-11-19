import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {ADDRESS_ZERO} from "../test/test-utils";
import {MockSHIB} from "../typechain-types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    await deployments.deploy("MockSHIB", { from: deployer });
    const mockSHIB = (await ethers.getContract("MockSHIB")) as MockSHIB;

    await deployments.deploy("MeawLend", { from: deployer, args: [mockSHIB.address, ADDRESS_ZERO] });
    console.log("✅ DeployLend done");
};
export default func;
func.tags = ["DeployLend"];

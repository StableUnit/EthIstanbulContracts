import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { deployAndCheckFactory } from "../utils/deploy";
import { SuAccessControlSingleton, SuOracleAggregator } from "../typechain-types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const deployProxy = deployAndCheckFactory(hre.deployments);

    const accessControl = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suOracleAggregator = (await ethers.getContract("SuOracleAggregator")) as SuOracleAggregator;

    const topStakersAddress = await deployProxy("TopStakers", [accessControl.address]);
    const exchangeModuleAddress = await deployProxy("Exchange", [
        accessControl.address,
        suOracleAggregator.address,
        topStakersAddress,
    ]);
    await deployProxy("ArbitrageHelper", [accessControl.address, exchangeModuleAddress]);
    console.log("✅ DeployExchange done");
};
export default func;
func.tags = ["Core", "DeployExchange"];

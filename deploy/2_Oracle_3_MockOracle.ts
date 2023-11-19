import * as typechainTypes from "hardhat/types";
import * as hardhatDeployTypes from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { MockOracle } from "../typechain-types";
import { getMockConfig } from "../utils/constants";
import { getNetworkInfo } from "../utils/network";

const func: hardhatDeployTypes.DeployFunction = async (hre: typechainTypes.HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const networkName = await getNetworkInfo();

    const deployOptions = {
        from: deployer,
        log: true,
        waitConfirmations: 1,
    };

    await deployments.deploy("MockOracle", deployOptions);

    const mockOracle = (await ethers.getContract("MockOracle")) as MockOracle;
    await deployments.deploy("MockSHIB", { from: deployer });
    const config = await getMockConfig(networkName);

    for (const asset of config) {
        const trx = await mockOracle.setFiatPrice1e18(asset.address, asset.price);
        await trx.wait();
        console.log(`✅ setFiatPrice for ${asset.name} finished successful`);
    }

    console.log("✅ setMockTokenPrice finished successful");
};
export default func;
func.tags = ["Oracle", "MockOracle"];

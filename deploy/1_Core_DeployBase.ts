import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getNamedAccounts } from "hardhat";
import { deployAndCheckFactory } from "../utils/deploy";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployer, dao, admin } = await getNamedAccounts();
    const deployProxy = deployAndCheckFactory(hre.deployments);

    // There should be dao and admin to give them roles in last script
    if (!dao || !admin) {
        console.error("No dao or admin!");
        return;
    }

    // To create correct initial config of our protocol in 1 - 5 scripts we give deployer DAO_ROLE and ADMIN_ROLE,
    // but this roles will be revoked for DAO and admin addresses in the last TransferOwnership script,
    // so at the end deployer will have no roles in our protocol
    const accessControlAddress = await deployProxy("SuAccessControlSingleton", [deployer]);
    await deployProxy("SuOracleAggregator", [accessControlAddress]);
};
export default func;
func.tags = ["Core", "DeployBaseContracts"];

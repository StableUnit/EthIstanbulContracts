import * as typechainTypes from "hardhat/types";
import * as hardhatDeployTypes from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { SuAccessControlSingleton, SuOracleAggregator, SuUniV3Oracle } from "../typechain-types";
import {
    UNISWAP_FACTORY_ADDRESS,
    ConstantsType,
    getConstants,
    isNetworkSupported,
    NetworkNameType,
} from "../utils/constants";
import { getNetworkInfo } from "../utils/network";
import { deployAndCheckFactory } from "../utils/deploy";

export interface UniswapV3AssetType {
    address: string;
    poolFee: number;
}

let constants: ConstantsType;

// returns information about assets for setting to oracle
export const getUniswapV3NetworkAsset = async (networkName: NetworkNameType): Promise<UniswapV3AssetType[]> => {
    if (!isNetworkSupported(networkName)) return undefined;

    return [
        { address: constants.ETH.address, poolFee: 3000 },
    ];
};

const func: hardhatDeployTypes.DeployFunction = async (hre: typechainTypes.HardhatRuntimeEnvironment) => {
    const networkName = await getNetworkInfo();
    const { deployments, getNamedAccounts } = hre;
    const deployProxy = deployAndCheckFactory(deployments);

    const { deployer } = await getNamedAccounts();
    constants = getConstants(networkName) as ConstantsType;
    const assets = await getUniswapV3NetworkAsset(networkName);

    const suAccessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suOracleAggregator = (await ethers.getContract("SuOracleAggregator")) as SuOracleAggregator;

    await deployProxy("SuUniV3Oracle", [
        suAccessControlSingleton.address,
        UNISWAP_FACTORY_ADDRESS,
        constants.USDT.address,
        suOracleAggregator.address,
    ]);

    const oracleContract = (await ethers.getContract("SuUniV3Oracle", deployer)) as SuUniV3Oracle;

    for (const asset of assets) {
        const tx = await oracleContract.enableAssetPool(asset.address, asset.poolFee);
        await tx.wait();
        console.log("✅ enableAssetPool success for", asset.address);
    }
};
export default func;
func.tags = ["Oracle", "UniswapContracts"];

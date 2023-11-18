import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {SuAccessControlSingleton, SuChronicleOracle} from "../typechain-types";
import { deployProxy } from "../test/test-utils";
import { getNetworkInfo } from "../utils/network";
import {
    ConstantsTokenType,
    getConstants,
    SUPPORTED_TOKENS,
    isNetworkSupported,
    NetworkNameType, SELF_KISSER_ABI,
} from "../utils/constants";

export const getChronicleAsset = async (networkName: NetworkNameType) => {
    if (!isNetworkSupported(networkName)) return undefined;
    const constants = getConstants(networkName);

    return SUPPORTED_TOKENS.map((v) => constants[v]).filter((v) => v) as ConstantsTokenType[];
};

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const networkName = await getNetworkInfo();
    const assets = await getChronicleAsset(networkName);
    if (!assets) {
        console.error(`No assets for network ${networkName}`);
        return;
    }

    // deploy SuChronicleOracle contract
    const suAccessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    await deployProxy("SuChronicleOracle", [suAccessControlSingleton.address]);
    const oracleContract = (await ethers.getContract("SuChronicleOracle", deployer)) as SuChronicleOracle;
    // Need to have access to latestRoundData() in feed
    const selfKisser = await ethers.getContractAt(SELF_KISSER_ABI, '0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d', deployer);

    for (const asset of assets) {
        const tx = await oracleContract.setAssetFeed(asset.address, asset.chroniclePriceFeed);
        await tx.wait();
        await selfKisser['selfKiss(address,address)'](asset.chroniclePriceFeed, oracleContract.address);
    }

    console.log(`✅ setAssetFeed finished successful. number of assets: ${Object.values(assets).length}`);
};
export default func;
func.tags = ["Oracle", "ChronicleOracle"];

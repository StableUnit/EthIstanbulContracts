import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { MockOracle, SuChronicleOracle, SuOracleAggregator } from "../typechain-types";
import { getNetworkInfo } from "../utils/network";
import { ORACLE_IDS, ConstantsType, getConstants, getMockAddress, MOCK_TOKENS } from "../utils/constants";

const func: DeployFunction = async () => {
    const networkName = await getNetworkInfo();

    // Mock oracle is needed only for testnet, where there is no real tokens and where chainlink don't work.
    // Locally, in hardhat we fork mainnet, so we don't need mocks and mockOracle
    const suOracleAggregator = (await ethers.getContract("SuOracleAggregator")) as SuOracleAggregator;
    const mockOracle = (await ethers.getContractOrNull("MockOracle")) as MockOracle | null;
    const suChronicleOracle = (await ethers.getContractOrNull("SuChronicleOracle")) as SuChronicleOracle | null;

    if (mockOracle) {
        const trx = await suOracleAggregator.setOracleImplementation(ORACLE_IDS.MOCK_ORACLE, mockOracle.address);
        await trx.wait();
    }
    if (suChronicleOracle) {
        await suOracleAggregator.setOracleImplementation(ORACLE_IDS.CHRONICLE, suChronicleOracle.address);
    }
    console.log("✅ setOracleImplementation finished successful");

    if (mockOracle) {
        const mockOracleAddresses = await Promise.all([...MOCK_TOKENS].map((v) => getMockAddress(v)));

        for (const tokenAddress of mockOracleAddresses) {
            const trx = await suOracleAggregator.setOracleIdForAssets([tokenAddress], [ORACLE_IDS.MOCK_ORACLE]);
            await trx.wait();
        }
    }

    if (suChronicleOracle) {
        const constants = getConstants(networkName) as ConstantsType;

        const chainlinkOracleAddresses = [constants.USDT.address, constants.ETH.address]

        for (const tokenAddress of chainlinkOracleAddresses) {
            const trx = await suOracleAggregator.setOracleIdForAssets([tokenAddress], [ORACLE_IDS.CHRONICLE]);
            await trx.wait();
        }
    }

    console.log("✅ setting of token prices finished successful");
};

export default func;
func.tags = ["Oracle", "OracleAggregator"];

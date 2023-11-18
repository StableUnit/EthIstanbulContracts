import { ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ADDRESS_ZERO, BN_1E18, deployProxy } from "../test-utils";
import { MockOracle, MockWBTC, SuAccessControlSingleton, SuOracleAggregator } from "../../typechain-types";
import { ORACLE_IDS } from "../../utils/constants";

describe("SuOracleAggregator", () => {
    let btcToken: MockWBTC;
    let mockOracle: MockOracle;
    let suOracleAggregator: SuOracleAggregator;
    let daoSigner: SignerWithAddress;

    const oracleId = ORACLE_IDS.MOCK_ORACLE;
    const btcToUsd = 30000;
    const btcToUsdBN = BN_1E18.mul(btcToUsd);

    beforeEach(async () => {
        const { dao } = await getNamedAccounts();
        daoSigner = await ethers.getSigner(dao);

        const btcFactory = await ethers.getContractFactory("MockWBTC");
        const oracleFactory = await ethers.getContractFactory("MockOracle");

        btcToken = (await btcFactory.deploy()) as MockWBTC;
        mockOracle = (await oracleFactory.deploy()) as MockOracle;
        const authControl = (await deployProxy("SuAccessControlSingleton", [dao])) as SuAccessControlSingleton;

        await mockOracle.setFiatPrice1e18(btcToken.address, btcToUsdBN);

        suOracleAggregator = (await deployProxy("SuOracleAggregator", [authControl.address])) as SuOracleAggregator;
        await suOracleAggregator.connect(daoSigner).setOracleImplementation(oracleId, mockOracle.address);
        await suOracleAggregator.connect(daoSigner).setOracleIdForAssets([btcToken.address], oracleId);
    });

    describe("constructor", () => {
        it("should succeed", async () => {
            expect(await suOracleAggregator.assetToOracle(btcToken.address)).to.equal(oracleId);
            expect(await suOracleAggregator.oracleImplementations(oracleId)).to.equal(mockOracle.address);
        });
    });

    describe("getFiatPrice1e18", () => {
        it("should succeed", async () => {
            const price = await suOracleAggregator.getFiatPrice1e18(btcToken.address);
            expect(price.toString()).to.equal(btcToUsdBN.toString());
        });

        it("should fail with no added token", async () => {
            // it's hardhat bug (if we call getFiatPrice1e18(usdtToken.address) then we will receive
            // RangeError: Maximum call stack size exceeded)
            // https://github.com/TrueFiEng/Waffle/issues/95
            const trx = suOracleAggregator.getFiatPrice1e18(ADDRESS_ZERO);
            await expect(trx).to.be.reverted;
        });
    });

    describe("setOracleImplementation", () => {
        it("should succeed", async () => {
            await suOracleAggregator.connect(daoSigner).setOracleImplementation(oracleId, mockOracle.address);
            expect(await suOracleAggregator.oracleImplementations(oracleId)).to.equal(mockOracle.address);
        });

        it("should fail with no id", async () => {
            const trx = suOracleAggregator.connect(daoSigner).setOracleImplementation(0, mockOracle.address);
            await expect(trx).to.be.reverted;
        });

        it("should fail with null address", async () => {
            const trx = suOracleAggregator.connect(daoSigner).setOracleImplementation(oracleId, ADDRESS_ZERO);
            await expect(trx).to.be.reverted;
        });
    });

    describe("setOracleIdForAssets", () => {
        it("should succeed", async () => {
            await suOracleAggregator.connect(daoSigner).setOracleImplementation(oracleId, mockOracle.address);
            await suOracleAggregator.connect(daoSigner).setOracleIdForAssets([btcToken.address], oracleId);
            expect(await suOracleAggregator.assetToOracle(btcToken.address)).to.equal(oracleId);
        });

        it("should fail with no oracleImplementations", async () => {
            const trx = suOracleAggregator.connect(daoSigner).setOracleIdForAssets([btcToken.address], oracleId + 1);
            await expect(trx).to.be.reverted;
        });
    });
});

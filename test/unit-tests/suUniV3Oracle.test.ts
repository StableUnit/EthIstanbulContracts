import { deployments, ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {BN_1E18, BN_1E6, BN_1E8} from "../test-utils";
import { SuUniV3Oracle } from "../../typechain-types";
import { ConstantsType, getConstants } from "../../utils/constants";
import { getNetworkInfo } from "../../utils/network";

describe("SuUniV3Oracle", () => {
    let suUniV3Oracle: SuUniV3Oracle;
    let daoSigner: SignerWithAddress;
    let adminSigner: SignerWithAddress;
    let constants: ConstantsType;

    beforeEach(async () => {
        const { dao, admin } = await getNamedAccounts();
        const networkName = await getNetworkInfo();

        daoSigner = await ethers.getSigner(dao);
        adminSigner = await ethers.getSigner(admin);
        constants = getConstants(networkName) as ConstantsType;

        await deployments.fixture(["Core", "Oracle"]);
        suUniV3Oracle = (await ethers.getContract("SuUniV3Oracle")) as SuUniV3Oracle;
    });

    /** Test runs on mainnet fork to avoid complex logic of creation pools, addiing liqudiity.
     * As result, here we have realtime ETH and BTC prices
     */
    describe("Check prices", () => {
        it("ETH price", async function () {
            const ethPrice = await suUniV3Oracle.getFiatPrice1e18(constants.ETH.address);
            console.log("ETH price: ", ethPrice.div(BN_1E18).toString());
            expect(ethPrice).to.be.gte(BN_1E18.mul(1_000));
            expect(ethPrice).to.be.lte(BN_1E18.mul(5_000));
        });

        it("USDT price", async function () {
            const usdtPrice = await suUniV3Oracle.getFiatPrice1e18(constants.USDT.address);
            const usdtPriceE18 = usdtPrice.mul(BN_1E8).div(BN_1E18);
            console.log("USDT price: ", usdtPriceE18.div(BN_1E18).toString());
            expect(usdtPriceE18).to.be.gte(BN_1E6.div(100).mul(95));
            expect(usdtPriceE18).to.be.lte(BN_1E6.div(100).mul(105));
        });
    });
});

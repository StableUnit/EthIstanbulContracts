import {deployments, ethers, getNamedAccounts} from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {SuChronicleOracle } from "../../typechain-types";
import {BN_1E18} from "../test-utils";
import {ConstantsType, getConstants} from "../../utils/constants";
import {getNetworkInfo} from "../../utils/network";

describe("SuChronicleOracle", () => {
    let suOracle: SuChronicleOracle;
    let daoSigner: SignerWithAddress;
    let constants: ConstantsType;

    beforeEach(async () => {
        const { dao } = await getNamedAccounts();
        const networkName = await getNetworkInfo();

        daoSigner = await ethers.getSigner(dao);
        constants = getConstants(networkName) as ConstantsType;

        await deployments.fixture(["Core", "Oracle"]);

        suOracle = (await ethers.getContract("SuChronicleOracle")) as SuChronicleOracle;
    });

    describe("Check prices", () => {
        it("ETH price", async function () {
            const ethPrice = await suOracle.getFiatPrice1e18(constants.ETH.address);
            console.log("ETH price: ", ethPrice.div(BN_1E18).toString());
            expect(ethPrice).to.be.gte(BN_1E18.mul(1_000));
            expect(ethPrice).to.be.lte(BN_1E18.mul(5_000));
        });
    });
});

import { ethers, upgrades } from "hardhat";
import { DeploymentsExtension } from "hardhat-deploy/types";
import { expect } from "chai";
import { getContractAddress } from "@ethersproject/address";

export const deployAndCheckFactory =
    (deployments: DeploymentsExtension) => async (contractName: string, args?: any[], expectedAddress?: string) => {
        const { save, getExtendedArtifact } = deployments;

        const contractFactory = await ethers.getContractFactory(contractName);

        const proxyContract = await upgrades.deployProxy(contractFactory, args);
        // console.log("start", contractName, "with hash", proxyContract.deployTransaction.hash);
        await proxyContract.deployed();

        console.log(`Contract ${contractName} is deployed with proxy address ${proxyContract.address}`);

        if (expectedAddress) {
            expect(proxyContract.address).to.equal(expectedAddress);
        }

        // save proxy address to the artifacts
        const artifact = await getExtendedArtifact(contractName);
        await save(contractName, {
            address: proxyContract.address,
            ...artifact,
        });

        return proxyContract.address;
    };

export const getNextDeploymentProxyAddress = async (deployer: string, inc = 1) => {
    const transactionCount = await ethers.provider.getTransactionCount(deployer);

    return getContractAddress({
        from: deployer,
        nonce: transactionCount + inc,
    });
};

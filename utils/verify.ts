import { deployments, run } from "hardhat";

export const verify = async (contractName, contractPath?, constructorArguments?) => {
    try {
        const Contract = await deployments.get(contractName);

        // hardhat documentation says that we need to use "verify:verify" subtask
        // but it doesn't work with proxy
        if (constructorArguments) {
            await run("verify:verify", {
                address: Contract.address,
                contract: contractPath,
                constructorArguments,
            });
        } else {
            await run("verify", {
                address: Contract.address,
                contract: contractPath,
            });
        }

        console.log(`✅ ${contractName} verified`);
    } catch (e) {
        console.log(`❌ ${contractName}'s verification failed: ${e.message}`);
    }
};

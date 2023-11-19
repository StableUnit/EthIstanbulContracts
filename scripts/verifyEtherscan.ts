import { verify } from "../utils/verify";

async function main() {
    await verify("SuOracleAggregator");
    await verify("MockOracle");
    await verify("MeawLend");
    await verify("MockSHIB");
    await verify("SuAccessControlSingleton");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

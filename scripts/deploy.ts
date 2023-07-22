import { ethers } from "hardhat";
import { HYPERLANE_MAILBOX } from "../constants/deployments";

async function main() {
  const Router = await ethers.getContractFactory("Router");
  const router = await Router.deploy(HYPERLANE_MAILBOX);

  await router.deployed();

  console.log(`Router deployed to ${router.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

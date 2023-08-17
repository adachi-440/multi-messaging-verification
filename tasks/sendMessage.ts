import { task, types } from "hardhat/config";

task("TASK_SEND_MESSAGE", "Send message using router")
  .addParam<string>("router", "router contract address", "", types.string)
  .addParam<number>("chainid", "destination chain id", 0, types.int)
  .addParam<string>("recipient", "recipient address", "", types.string)
  .addParam<string>("message", "message", "", types.string)
  .addVariadicPositionalParam("adapters")
  .setAction(
    async (taskArgs, hre): Promise<null> => {
      console.log(taskArgs);
      const routerAddress = taskArgs.router,
        chainid = taskArgs.chainid,
        recipient = taskArgs.recipient,
        message = taskArgs.message,
        adapters = taskArgs.adapters;

      const router = await hre.ethers.getContractAt("Router", routerAddress);
      const messageBytes = hre.ethers.utils.hexlify(hre.ethers.utils.toUtf8Bytes(message));

      try {
        const fees = await router.estimateGasFees(chainid, 1000000, messageBytes, adapters);
        console.log("Estimated gas fees:", fees);
        console.log("Sending message. This may take a few minutes..");
        console.log(messageBytes);
        const tx = await router.sendMessage(chainid, recipient, messageBytes, adapters, fees, { gasLimit: 30000000, value: 0 });
        await tx.wait();
        console.log(`✅ [${hre.network.name}] Message sent! tx: ${tx.hash}`);
      } catch (e: any) {
        if (e.error.message.includes("The chainId + address is already trusted")) {
          console.log("*source already set*")
        } else {
          console.log(`❌ [${hre.network.name}] Fail to send message`)
        }
        console.log(e)
      }
      return null;
    }
  );

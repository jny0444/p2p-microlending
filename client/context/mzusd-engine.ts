import { getPrivKey } from "@/lib/privKey";
import { networkFromName } from "@stacks/network";
import {
  AnchorMode,
  broadcastTransaction,
  Cl,
  cvToJSON,
  fetchCallReadOnlyFunction,
  makeContractCall,
  principalCV,
} from "@stacks/transactions";

const CONTRACT_ADDRESS = "ST3J2X81CCA3JFX6HKM10FCJFXT9PW4E7DMQG1D49";
const CONTRACT_NAME = "mzusd-engine-v1_1_0";

export async function depositCollateral(amount: number) {
  const functionArgs = [Cl.uint(amount)];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "deposit",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
    amount: amount,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

export async function withdrawCollateral(amount: number) {
  const functionArgs = [Cl.uint(amount)];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "withdraw",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

export async function mint(amount: number) {
  const functionArgs = [Cl.uint(amount)];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "mint-mzusd",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

export async function burn(amount: number) {
  const functionArgs = [Cl.uint(amount)];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "burn-mzusd",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

export async function getVaultInfo(user: string) {
  const user_1 = principalCV(user);

  const response = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-vault-info",
    functionArgs: [user_1],
    senderAddress: CONTRACT_ADDRESS,
    network: networkFromName("testnet"),
  });

  if (response.type === "ok") {
    const vaultInfo = cvToJSON(response.value);
    console.log("Vault Info:", vaultInfo);
    return vaultInfo;
  } else {
    console.error("Error fetching vault info:", response);
    return;
  }
}

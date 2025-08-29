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
const CONTRACT_NAME = "mzusd-v1_0_0";

export async function transfer(
  amount: number,
  sender: string,
  recipient: string,
  memo: string
) {
  const functionArgs = [
    Cl.uint(amount),
    Cl.principal(sender),
    Cl.principal(recipient),
    memo
      ? Cl.some(Cl.buffer(Buffer.from(memo, "utf8").slice(0, 34)))
      : Cl.none(),
  ];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "transfer",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

export async function getName() {
  const response = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-name",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: networkFromName("testnet"),
  });

  if (response.type === "ok") {
    const coin = cvToJSON(response.value);
    console.log("FT name", coin);
    return coin;
  } else {
    console.error("Error fetching", response);
    return;
  }
}

export async function getSymbol() {
  const response = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-symbol",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: networkFromName("testnet"),
  });

  if (response.type === "ok") {
    const coin = cvToJSON(response.value);
    console.log("FT name", coin);
    return coin;
  } else {
    console.error("Error fetching", response);
    return;
  }
}

export async function getDecimals() {
  const response = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-decimals",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: networkFromName("testnet"),
  });

  if (response.type === "ok") {
    const coin = cvToJSON(response.value);
    console.log("FT name", coin);
    return coin;
  } else {
    console.error("Error fetching", response);
    return;
  }
}

export async function getmzUSDBalance(address: string) {
  const user = principalCV(address);

  const response = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-balance",
    functionArgs: [user],
    senderAddress: CONTRACT_ADDRESS,
    network: networkFromName("testnet"),
  });

  if (response.type === "ok") {
    const balance = cvToJSON(response.value);
    console.log("mzUSD Balance:", balance);
    return balance;
  } else {
    console.error("Error fetching mzUSD balance:", response);
    return;
  }
}

export async function getTotalSupply() {
  const response = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-total-supply",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: networkFromName("testnet"),
  });

  if (response.type === "ok") {
    const balance = cvToJSON(response.value);
    console.log("mzUSD Balance:", balance);
    return balance;
  } else {
    console.error("Error fetching mzUSD balance:", response);
    return;
  }
}

export async function mintmzUSD(amount: number, recipient: string) {
  const functionArgs = [Cl.uint(amount), Cl.principal(recipient)];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "mint",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

export async function burnmzUSD(amount: number, recipient: string) {
  const functionArgs = [Cl.uint(amount), Cl.principal(recipient)];

  const privKey = await getPrivKey();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "burn",
    functionArgs: functionArgs,
    senderKey: privKey,
    network: "testnet",
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });

  console.log("Transaction broadcasted:", broadcastResponse.txid);
}

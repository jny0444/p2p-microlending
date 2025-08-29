"use client";

import {
  connect,
  disconnect,
  getLocalStorage,
  isConnected,
  request,
} from "@stacks/connect";
import { useState } from "react";
import { getUserAddress } from "./privKey";

export async function connectWallet() {
  if (isConnected()) {
    console.log("Already authenticated");
    disconnect();
    return;
  }
  const response = await connect();
  console.log("connected: ", response.addresses);
  const address = await getUserAddress();
  return address;
}

export async function disconnectWallet() {
  if (!isConnected()) {
    console.log("Not Connected");
    return;
  }
  disconnect();
  console.log("User Disconnected");
}

export async function handleWallet() {
  const [address, setAddress] = useState("");

  const response = await connect();

  const data = getLocalStorage();
  const stxAddresses = data?.addresses.stx;

  if (stxAddresses && stxAddresses.length > 0) {
    const address = stxAddresses[0].address;
    console.log("STX Address:", address);

    setAddress(address);
  }
}

"use client";

import { getmzUSDBalance } from "@/context/mock-token";
import { getUserAddress } from "@/lib/privKey";
import { useState } from "react";

export default async function NewSwap() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState("");

  const address = await getUserAddress();

  setUser(address);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getmzUSDBalance(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <input
        value={}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Enter user address"
      /> */}
      <button type="submit">Get Vault Info</button>
    </form>
  );
}

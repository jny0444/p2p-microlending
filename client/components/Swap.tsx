"use client";

import { useState, useEffect } from "react";
import { CaretDown, CurrencyBtcIcon } from "@phosphor-icons/react";
import {
  depositCollateral,
  withdrawCollateral,
  mint,
  burn,
  getVaultInfo,
  getCurrentBtcPrice,
} from "@/context/mz-engine";
import {
  getmzUSDBalance,
  getTotalSupply,
  getName,
  getSymbol,
  getDecimals,
} from "@/context/mzusd";
import {
  depositCollateral as depositCollateralMzUSD,
  withdrawCollateral as withdrawCollateralMzUSD,
  mint as mintMzUSD,
  burn as burnMzUSD,
  getVaultInfo as getVaultInfoMzUSD,
} from "@/context/mzusd-engine";

const Swap = () => {
  const [activeTab, setActiveTab] = useState("swap");
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [btcPrice, setBtcPrice] = useState(0);
  const [mzUSDBalance, setMzUSDBalance] = useState(0);
  const [vaultInfo, setVaultInfo] = useState<any>(null);

  // Form states
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Get current BTC price
      const price = await getCurrentBtcPrice();
      if (price) setBtcPrice(price.value || 0);

      // Get mzUSD balance if user address is available
      if (userAddress) {
        const balance = await getmzUSDBalance(userAddress);
        if (balance) setMzUSDBalance(balance.value || 0);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleSwap = async () => {
    if (!payAmount || !receiveAmount) return;

    setIsLoading(true);
    try {
      const payValue = parseFloat(payAmount);
      const receiveValue = parseFloat(receiveAmount);

      if (payValue > 0 && receiveValue > 0) {
        // Mint mzUSD based on BTC collateral
        await mint(receiveValue);
        console.log("Swap completed: Minted", receiveValue, "mzUSD");
      }
    } catch (error) {
      console.error("Error during swap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceive = async () => {
    if (!payAmount || !receiveAmount) return;

    setIsLoading(true);
    try {
      const payValue = parseFloat(payAmount);
      const receiveValue = parseFloat(receiveAmount);

      if (payValue > 0 && receiveValue > 0) {
        // Burn mzUSD to receive BTC
        await burn(payValue);
        console.log("Receive completed: Burned", payValue, "mzUSD");
      }
    } catch (error) {
      console.error("Error during receive:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollateral = async () => {
    if (!collateralAmount) return;

    setIsLoading(true);
    try {
      const amount = parseFloat(collateralAmount);
      if (amount > 0) {
        await depositCollateral(amount);
        console.log("Collateral added:", amount, "BTC");
        setCollateralAmount("");
        // Refresh vault info
        if (userAddress) {
          const vault = await getVaultInfo(userAddress);
          setVaultInfo(vault);
        }
      }
    } catch (error) {
      console.error("Error adding collateral:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawCollateral = async () => {
    if (!withdrawAmount) return;

    setIsLoading(true);
    try {
      const amount = parseFloat(withdrawAmount);
      if (amount > 0) {
        await withdrawCollateral(amount);
        console.log("Collateral withdrawn:", amount, "BTC");
        setWithdrawAmount("");
        // Refresh vault info
        if (userAddress) {
          const vault = await getVaultInfo(userAddress);
          setVaultInfo(vault);
        }
      }
    } catch (error) {
      console.error("Error withdrawing collateral:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBalanceDisplay = () => {
    if (activeTab === "swap" || activeTab === "receive") {
      return mzUSDBalance.toFixed(2);
    } else if (activeTab === "add") {
      return mzUSDBalance.toFixed(2);
    } else if (activeTab === "withdraw") {
      return vaultInfo?.collateral || "0";
    }
    return "-";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "swap":
        return (
          <div>
            <div className="bg-background/10 p-4 rounded-2xl mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-background/70">You pay</span>
                <span className="text-sm text-background/70">
                  Balance: {getBalanceDisplay()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="bg-transparent text-2xl w-full outline-none"
                />
                <button className="flex items-center gap-2 bg-accent/20 hover:bg-accent/40 duration-300 p-2 rounded-full text-white">
                  <CurrencyBtcIcon size={24} />
                  <span className="font-bold">BTC</span>
                  <CaretDown size={16} />
                </button>
              </div>
            </div>

            <div className="bg-background/10 p-4 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-background/70">You receive</span>
                <span className="text-sm text-background/70">
                  Balance: {mzUSDBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  className="bg-transparent text-2xl w-full outline-none"
                  disabled
                />
                <button className="flex items-center gap-2 bg-accent/20 hover:bg-accent/40 duration-300 p-2 rounded-full text-white">
                  <div className="w-6 h-6 rounded-full bg-white"></div>
                  <span className="font-bold">mzUSD</span>
                  <CaretDown size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSwap}
              disabled={isLoading || !payAmount || !receiveAmount}
              className="w-full bg-accent text-background rounded-2xl p-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Swap BTC for mzUSD"}
            </button>
          </div>
        );
      case "receive":
        return (
          <div className="text-center">
            <div className="bg-background/10 p-4 rounded-2xl mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-background/70">You pay</span>
                <span className="text-sm text-background/70">
                  Balance: {mzUSDBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="bg-transparent text-2xl w-full outline-none"
                />
                <button className="flex items-center gap-2 bg-accent/20 hover:bg-accent/40 duration-300 p-2 rounded-full text-white">
                  <div className="w-6 h-6 rounded-full bg-white"></div>
                  <span className="font-bold">mzUSD</span>
                  <CaretDown size={16} />
                </button>
              </div>
            </div>

            <div className="bg-background/10 p-4 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-background/70">You receive</span>
                <span className="text-sm text-background/70">
                  Balance: {getBalanceDisplay()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  className="bg-transparent text-2xl w-full outline-none"
                />
                <button className="flex items-center gap-2 bg-accent/20 hover:bg-accent/40 duration-300 p-2 rounded-full text-white">
                  <CurrencyBtcIcon size={24} />
                  <span className="font-bold">BTC</span>
                  <CaretDown size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleReceive}
              disabled={isLoading || !payAmount || !receiveAmount}
              className="w-full bg-accent text-background rounded-2xl p-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Burn mzUSD for BTC"}
            </button>
          </div>
        );
      case "add":
        return (
          <div>
            <div className="bg-background/10 p-4 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-background/70">
                  Amount to add
                </span>
                <span className="text-sm text-background/70">
                  Balance: {getBalanceDisplay()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="bg-transparent text-2xl w-full outline-none"
                />
                <button className="flex items-center gap-2 bg-accent/20 hover:bg-accent/40 duration-300 p-2 rounded-full text-white">
                  <CurrencyBtcIcon size={24} />
                  <span className="font-bold">BTC</span>
                  <CaretDown size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddCollateral}
              disabled={isLoading || !collateralAmount}
              className="w-full bg-accent text-background rounded-2xl p-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Add Collateral"}
            </button>
          </div>
        );
      case "withdraw":
        return (
          <div>
            <div className="bg-background/10 p-4 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-background/70">
                  Amount to withdraw
                </span>
                <span className="text-sm text-background/70">
                  Collateral: {getBalanceDisplay()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-transparent text-2xl w-full outline-none"
                />
                <button className="flex items-center gap-2 bg-accent/20 hover:bg-accent/40 duration-300 p-2 rounded-full text-white">
                  <CurrencyBtcIcon size={24} />
                  <span className="font-bold">BTC</span>
                  <CaretDown size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleWithdrawCollateral}
              disabled={isLoading || !withdrawAmount}
              className="w-full bg-accent text-background rounded-2xl p-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Withdraw Collateral"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton = ({
    label,
    tabName,
  }: {
    label: string;
    tabName: string;
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        activeTab === tabName
          ? "bg-accent text-background"
          : "text-background/70 hover:bg-background/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-lg mx-auto bg-foreground text-background rounded-4xl p-4 border border-accent/20">
      <div className="flex flex-wrap justify-between items-center mb-4 bg-background/10 rounded-lg p-1">
        <TabButton label="Swap" tabName="swap" />
        <TabButton label="Receive" tabName="receive" />
        <TabButton label="Add Collateral" tabName="add" />
        <TabButton label="Withdraw Collateral" tabName="withdraw" />
      </div>

      {renderContent()}
    </div>
  );
};

export default Swap;

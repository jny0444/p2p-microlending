"use client";
import Image from "next/image";
import {
  useSlidingLogo,
  useDivExpansion,
} from "@/animations/home-page/Animations";
import drops from "@/public/logo/drops.svg";
import {
  ArrowSquareOutIcon,
  HandsPrayingIcon,
  LinkIcon,
  MouseScrollIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { connectWallet } from "@/lib/contract";
import { useState } from "react";

export default function Hero() {
  const slidingLogo = useSlidingLogo();
  const [divExpansion, buttonExpansion] = useDivExpansion();
  const [address, setAddress] = useState("");

  const handleConnectWallet = async () => {
    const addr = await connectWallet();
    if (addr) {
      setAddress(addr?.slice(0, 6) + "..." + addr?.slice(-4));
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-0.5 p-0.5 h-screen">
        <div className="relative flex-1/3 bg-foreground text-background rounded-4xl flex items-center justify-center">
          <span className="font-serif text-9xl flex items-center">
            <HandsPrayingIcon size={120} weight="duotone" />
            Welcome
          </span>
          <Link
            href={"https://www.stacks.co/"}
            target="_blank"
            className="absolute top-0 right-0 p-5 border-b-2 border-l-2 border-background rounded-bl-md">
            <LinkIcon size={32} weight="duotone" />
          </Link>
        </div>
        <div
          ref={divExpansion}
          className="flex gap-0.5 origin-center h-0 opacity-0 overflow-hidden">
          <div className="flex-1 bg-accent text-background rounded-4xl flex flex-col items-center justify-center">
            <span className="text-6xl font-bold">Built on Stacks.</span>{" "}
            <span className="text-6xl font-bold">Liquidity Enabled.</span>
          </div>
          <div
            ref={buttonExpansion}
            className="w-0 bg-accent text-background rounded-4xl flex flex-col gap-2 p-0 opacity-0 justify-center overflow-hidden">
            <button onClick={handleConnectWallet} className="cursor-pointer flex-1/3 bg-foreground border border-foreground hover:bg-background hover:text-foreground active:scale-99 duration-300 rounded-t-4xl rounded-b-lg whitespace-nowrap text-xl flex items-center justify-center gap-2">
              {address ? address : "Connect Wallet"}
              <WalletIcon size={22} weight="duotone" className="shrink-0" />
            </button>
            <Link
              href={"/swap"}
              className="cursor-pointer flex-1/3 bg-foreground border border-foreground hover:bg-background hover:text-foreground active:scale-99 duration-300 rounded-lg whitespace-nowrap text-xl flex items-center justify-center gap-2">
              Open App{" "}
              <ArrowSquareOutIcon
                size={22}
                weight="duotone"
                className="shrink-0"
              />
            </Link>
            <button className="cursor-pointer flex-1/3 bg-foreground border border-foreground hover:bg-background hover:text-foreground active:scale-99 duration-300 rounded-b-4xl rounded-t-lg whitespace-nowrap text-xl flex items-center justify-center gap-2">
              Know More{" "}
              <MouseScrollIcon
                size={22}
                weight="duotone"
                className="shrink-0"
              />
            </button>
          </div>
        </div>
        <div className="flex-1/3 bg-foreground text-background rounded-4xl overflow-hidden">
          <div
            ref={slidingLogo}
            className="h-full flex items-center gap-15 pr-15">
            {Array.from({ length: 30 }).map((_, index) => (
              <Image
                key={index}
                src={drops}
                alt="drops"
                width={200}
                className="shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import Card from "@/components/Card";
import Image from "next/image";

import drops from "@/public/logo/drops.svg";
import { BankIcon, HandCoinsIcon, ReceiptIcon } from "@phosphor-icons/react";

export default function What() {
  const features = [
    {
      icon: BankIcon,
      className: "absolute top-40 left-0",
      title: "Liquidity from BTC",
      desc: "Unlock over $1 trillion in latent Bitcoin capital through Stacks L2, enabling programmable Bitcoin with secure, decentralized liquidity solutions.",
    },
    {
      icon: HandCoinsIcon,
      className: "absolute top-20 -right-5",
      title: "BTC backed Stable Coin",
      desc: "Access sBTC, a 1:1 Bitcoin-backed asset that brings your BTC to Layer 2 while maintaining the security and trust of the Bitcoin network.",
    },
    {
      icon: ReceiptIcon,
      className: "absolute bottom-10 right-5",
      title: "Micro Lending Services",
      desc: "Participate in Bitcoin DeFi protocols built on Stacks, offering micro lending services with Bitcoin finality and smart contract capabilities.",
    },
  ];

  return (
    <section className="py-30">
      <div className="container mx-auto">
        <div className="mx-auto flex gap-3 items-center max-w-2xl">
          <h1 className="text-4xl whitespace-nowrap font-serif bg-foreground text-background px-4 py-2 rounded-lg">
            So, What is It?
          </h1>
          <p className="text-pretty">
            Our platform leverages the power of the Stacks blockchain to provide
            instant, low-cost transactions that work seamlessly.
          </p>
        </div>
        <div className="relative py-60">
          <h1 className="relative flex items-center justify-center">
            <Image src={drops} alt="drops" width={160} />
            <div className="absolute size-70 rounded-full bg-accent/20" />
            <div className="absolute size-100 rounded-full bg-accent/10" />
          </h1>
          <div>
            {features.map((feature, index) => (
              <Card
                key={index}
                icon={feature.icon}
                className={feature.className}
                title={feature.title}
                desc={feature.desc}
              />
            ))}
            <div className="absolute w-60 h-1.5 bg-[#222033] top-90 left-90" />
            <div className="absolute w-30 h-1.5 rotate-45 bg-[#222033] top-[19.9rem] left-65" />
            <div className="absolute w-60 h-1.5 bg-[#222033] top-65 right-90" />
            <div className="absolute w-23 h-1.5 -rotate-45 bg-[#222033] top-57 right-71" />
            <div className="absolute w-40 h-1.5 bg-[#222033] bottom-50 right-120" />
            <div className="absolute w-15 h-1.5 rotate-45 bg-[#222033] bottom-45 right-108" />
          </div>
        </div>
      </div>
    </section>
  );
}

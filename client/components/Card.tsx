"use client";
import { CurrencyDollarIcon, type IconProps } from "@phosphor-icons/react";

interface CardProps {
  className?: string;
  title: string;
  desc: string;
  icon: React.ComponentType<IconProps>;
}

export default function Card({
  className,
  title,
  desc,
  icon: Icon,
}: CardProps) {
  return (
    <div
      className={`${className} bg-accent/10 w-fit p-4 rounded-2xl min-w-lg max-w-lg`}>
      <h1 className="flex items-center gap-2 font-medium text-2xl bg-accent/20 p-2 rounded-lg font-serif">
        <Icon size={25} weight="duotone" className="ml-2" />
        {title}
      </h1>
      <p className="mt-3 px-1 text-sm text-foreground/80">{desc}</p>
    </div>
  );
}

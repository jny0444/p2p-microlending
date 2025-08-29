import "@/styles.css";
import type { Metadata } from "next";

import SmoothScroll from "@/providers/SmoothScroll";

export const metadata: Metadata = {
  title: "drops",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased selection:text-background selection:bg-foreground`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

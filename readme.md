# P2P Microlending on Stacks

A decentralized peer-to-peer microlending platform built on the Stacks blockchain.

## Features

- Collateralized lending and borrowing
- LP token support
- Vault management
- Instant, low-cost transactions

## Demo
[link](https://www.loom.com/share/3cda550b14ca4ec5b49e660f6d70c3b6?sid=9acb757c-19c5-4f6a-887b-1d11095b5791)

## Project Structure

- `client/` — Next.js frontend
- `contracts/` — Clarity smart contracts
- `deployments/` — Deployment scripts and configs
- `settings/` — Project settings

## Getting Started

1. **Install dependencies:**
   ```sh
   cd client
   pnpm install
   ```

2. **Run the development server:**
   ```sh
   pnpm dev
   ```

3. **Smart Contracts:**
   - Contracts are in [`contracts/`](contracts/)
   - Use [Clarinet](https://docs.hiro.so/clarinet/get-started) for local development and testing

## Scripts

- `pnpm dev` — Start frontend dev server
- `pnpm build` — Build frontend
- `pnpm start` — Start production server
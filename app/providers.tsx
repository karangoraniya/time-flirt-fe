'use client';
import * as React from 'react';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { optimismGoerli, zoraTestnet, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect, useState } from 'react';
import { Chain } from '@wagmi/core';

const PROJECT_ID = `${process.env.NEXT_PUBLIC_WALLET_PROJECT_ID}`;

export const modeSepolia = {
  id: 919,
  name: 'Mode Sepolia',
  network: 'Mode Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Mode Sepolia',
    symbol: 'Mode',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.mode.network/'] },
    default: { http: ['https://sepolia.mode.network/'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'mode-sepolia-explorer',
      url: 'https://sepolia.explorer.mode.network/',
    },
    default: {
      name: 'mode-sepolia-explorer',
      url: 'https://sepolia.explorer.mode.network/',
    },
  },
} as const satisfies Chain;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismGoerli, zoraTestnet, polygonMumbai, modeSepolia],

  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Chad Vault',
  projectId: PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

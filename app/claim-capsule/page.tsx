'use client';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

type ChainConfig = {
  contractAddress: `0x${string}`;
  explorer: string;
};

const chainConfig: Record<string, ChainConfig> = {
  // Optimism Goerli
  option1: {
    contractAddress: '0x32eF3BE4Bb15492Ca859e5b1776E55671ED81A79',
    explorer: 'https://goerli-optimism.etherscan.io/tx/',
  },

  // Zora Testnet
  option2: {
    contractAddress: '0x662c66962B02Ebd79Fdc204e21065b268A15e920',
    explorer: 'https://testnet.explorer.zora.energy/tx/',
  },

  // Mumbai
  option3: {
    contractAddress: '0xc84eaC7F76b17A78EF6bdb915B5d8BFb5c9f10d2',
    explorer: 'https://mumbai.polygonscan.com/tx/',
  },
  // Mode Testnet
  option4: {
    contractAddress: '0x9c774Ba3c07D9526c0a658D1e6FE001D0E9fF1B7',
    explorer: 'https://sepolia.explorer.mode.network/tx/',
  },
};

const Claim = () => {
  const [tokenId, setTokenId] = useState('');
  const [selectedOption, setSelectedOption] = useState('option1');

  const mintABI = [
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'claimFlirt',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  //   const contractAddress = '0x201A4d04C7b52BF4d8EC9eFE888b98e7ECdbf31C';
  // const contractAddress = '0x32eF3BE4Bb15492Ca859e5b1776E55671ED81A79'; //op
  const multiCont = chainConfig[selectedOption];

  const { config } = usePrepareContractWrite({
    address: multiCont.contractAddress,
    abi: mintABI,
    functionName: 'claimFlirt',
    args: [tokenId],
  });
  console.log(selectedOption, 'vjjckjdkcdkc');

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <Toaster />
      <div className="bg-gradient-to-r from-black via-purple-900 to-black min-h-screen flex flex-col items-center p-8">
        <h1 className="text-white text-4xl mb-4">
          Claim Your Time Flirt Capsule
        </h1>
        <div className="w-full max-w-md">
          <label className="mb-2">
            Token Id
            <input
              className="bg-white/[0.15] text-white border-none rounded p-2 mb-2 w-full"
              type="text"
              placeholder="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </label>
          <div className="mb-4">
            <label className="mr-2 text-white" htmlFor="sourceChain">
              Select Chain:
            </label>
            <select
              className="input bg-purple-200 text-black"
              id="sourceChain"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="option1">Optimism Goerli</option>
              <option value="option2">Zora Goerli</option>
              <option value="option3">Polygon Mumbai</option>
              <option value="option4">Mode</option>
            </select>
          </div>

          <button
            className="bg-purple-700 text-white rounded p-2 w-full mt-3"
            onClick={write}
          >
            Claim Flirt Capsule
          </button>
        </div>
      </div>
    </>
  );
};

export default Claim;

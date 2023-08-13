'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import { monerochan } from '@/public/assets';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import ipfsHttpClient, { urlSource, create } from 'ipfs-http-client';
import toast, { Toaster } from 'react-hot-toast';
import { useSwitchNetwork } from 'wagmi';

// Infura IPFS client id and Key
const PROJECT_ID = `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`;
const PROJECT_SECRET = `${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`;

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

const Mint = () => {
  const [addr, setAddr] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [time, setTime] = useState<number>(0);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isImageUploading, setImageUploading] = useState(false);
  const [isTransactionLoading, setTransactionLoading] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState('option1');

  // IPFS START

  const auth =
    'Basic ' +
    Buffer.from(PROJECT_ID + ':' + PROJECT_SECRET).toString('base64');

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setProcessing(true); // Start processing

    const form = event.target;
    const files = form.file.files;
    const selectedType = form.type.value;
    const selectedExpiration = form.expiration.value || 'N/A';

    if (!files || files.length === 0 || !selectedType) {
      setProcessing(false); // End processing
      return alert('Please fill all the required fields');
    }

    try {
      // Upload the image file
      const addedImage = await client.add(files[0]);
      const hash = addedImage.cid.toString();
      const fileUrl = `https://roadtoweb3.infura-ipfs.io/ipfs/${hash}`;

      // Create JSON object
      const jsonObject = {
        name,
        description,
        image: fileUrl,
        attributes: [
          { trait_type: 'Type', value: selectedType },
          { trait_type: 'Expiration', value: selectedExpiration },
        ],
      };

      // Convert JSON object to Blob
      const jsonBlob = new Blob([JSON.stringify(jsonObject)], {
        type: 'application/json',
      });

      // Upload JSON Blob to IPFS
      const addedJson = await client.add(jsonBlob);
      const jsonHash = addedJson.cid.toString();
      const jsonFileUrl = `https://roadtoweb3.infura-ipfs.io/ipfs/${jsonHash}`;

      setFileUrl(jsonFileUrl); // Storing the file URL
      setTime(
        selectedExpiration ? new Date(selectedExpiration).getTime() / 1000 : 0
      ); // Storing the Unix time if expiration is selected
      setImageUploaded(true);

      toast.success('Successfully Uploaded!');

      try {
        if (!write) {
          toast.error('Write function is not initialized.');
          return;
        }
        await write();
      } catch (error) {
        // console.error(error);
        toast.error('An error occurred with the transaction.');
      }
    } catch (error) {
      // console.error(error);
      alert('An error occurred while processing your request.');
    }

    setProcessing(false); // End processing
  };

  // IPFS END

  const mintABI = [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'unlockTime',
          type: 'uint256',
        },
        {
          internalType: 'string',
          name: 'contentURI',
          type: 'string',
        },
      ],
      name: 'createFlirt',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  //   const contractAddress = '0x201A4d04C7b52BF4d8EC9eFE888b98e7ECdbf31C';
  const contractAddress = '0x32eF3BE4Bb15492Ca859e5b1776E55671ED81A79'; //op
  const multiCont = chainConfig[selectedOption];
  const { config } = usePrepareContractWrite({
    // address: contractAddress,
    address: multiCont.contractAddress,

    abi: mintABI,
    functionName: 'createFlirt',
    args: [addr, time, fileUrl],
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  // setTransactionHash(data?.hash);

  if (transactionHash) {
    toast.success('Transaction successful!');
  }

  console.log(data?.hash);

  const handleTransaction = async () => {
    if (!write) {
      toast.error('Write function is not initialized.');
      return;
    }

    setTransactionLoading(true); // Start transaction loading
    try {
      await write();
      toast.success('Transaction successful!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred with the transaction.');
    } finally {
      setTransactionLoading(false); // End transaction loading
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-gradient-to-r from-black  via-purple-900 to-black min-h-screen flex flex-col items-center p-8">
        <div className="mt-[12%]">
          <h1 className="text-white text-4xl mb-4">
            Create Time Flirt Capsule
          </h1>
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit}>
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
              <label className="mb-2">
                Name
                <input
                  className="bg-white/[0.15] text-white border-none rounded p-2 mb-2 w-full"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="mb-2">
                Description
                <input
                  className="bg-white/[0.15] text-white border-none rounded p-2 mb-2 w-full"
                  type="text"
                  placeholder="Description Address"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label className="mb-2">
                Address
                <input
                  className="bg-white/[0.15] text-white border-none rounded p-2 mb-2 w-full"
                  type="text"
                  placeholder="Recipient Address"
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                />
              </label>
              <label className="mb-2">
                Type:
                <select
                  name="type"
                  className="mt-1 block w-full p-2 bg-white/[0.15] text-white border-none rounded"
                  required
                >
                  <option value="Video">Video</option>
                  <option value="Note">Note</option>
                  <option value="Memories">Memories</option>
                  <option value="Text">Text</option>
                </select>
              </label>
              <label className="mb-2">
                Expirations:
                <input
                  type="datetime-local"
                  name="expiration"
                  className="mt-1 block w-full p-2 bg-white/[0.15] text-white border-none rounded"
                />
              </label>
              <label className="mb-2">
                File:
                <input
                  type="file"
                  name="file"
                  className="mt-1 block w-full p-2 bg-white/[0.15] text-white border-none rounded"
                />
              </label>

              <button
                className="bg-purple-700 text-white rounded p-2 w-full mt-3"
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Create Capsule'}
              </button>
            </form>
          </div>
          <div className="text-center mt-4">
            {transactionHash && chainConfig[selectedOption] ? (
              <div>
                <p className="text-lg mb-2 text-white">Hash Found:</p>
                <a
                  href={`${chainConfig[selectedOption].explorer}${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {transactionHash}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mint;

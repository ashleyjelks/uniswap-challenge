"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./styles.module.css";
import Image from "next/image";
import abi from "../../contracts/abi.json";

interface RecentTransactionsProps {
  contractAddress: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  contractAddress,
}) => {
  const [mints, setMints] = useState([]);
  const provider = new ethers.providers.Web3Provider(window?.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const icons = [
    "/icons/Confetti__Blue.png",
    "/icons/Confetti__Red.png",
    "/icons/Confetti__Pink.png",
    "/icons/Confetti__Green.png",
  ];

  useEffect(() => {
    const mintListener = async (
      from: string,
      to: string,
      tokenId: { toString: () => string },
      event: {
        transactionHash:
          | ethers.providers.BlockTag
          | Promise<ethers.providers.BlockTag>;
        blockNumber: string | Promise<string>;
      },
    ) => {
      if (from === ethers.constants.AddressZero) {
        try {
          const { blockNumber, transactionHash } = event;
          const block = await provider.getBlock(blockNumber);
          const timestamp = new Date(block.timestamp * 1000).toLocaleString();

          setMints((currentMints) => {
            return [
              ...currentMints,
              {
                tokenId,
                to,
                from,
                blockNumber,
                transactionHash,
                timestamp,
              },
            ];
          });
        } catch (error) {
          console.error("Error listening for latest transactions:", error);
        }
      }
    };

    contract.on("Transfer", mintListener);

    return () => {
      contract.off("Transfer", mintListener);
    };
  }, [contract]);

  return mints.length > 0 ? (
    <div className={styles.recentTransactions}>
      <p className={styles.recentTransactions__header}>Latest Mints</p>
      <div className={styles.recentTransactions__wrapper}>
        {mints.map((mint, index) => {
          const { to, transactionHash, timestamp } = mint;
          return (
            <div
              key={transactionHash + index}
              className={styles.recentTransactions__transaction__wrapper}
            >
              <Image
                height={20}
                width={20}
                src={icons[index % 4]}
                alt="NFT icon"
                style={{ marginRight: 10 }}
              />
              <p
                className={styles.recentTransactions__ts}
              >{`Minted at: ${timestamp}`}</p>
              <p className={styles.recentTransactions__tx}>{`From: ${to}`}</p>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

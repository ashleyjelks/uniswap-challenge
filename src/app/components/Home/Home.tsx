"use client";
import React, { useState } from "react";
import { MobileWalletConnector } from "../MobileWalletConnector/MobileWalletConnector";
import { AppHeader } from "../AppHeader/AppHeader";
import { NFT } from "../NFT/NFT";
import { RecentTransactions } from "../RecentTransactions/RecentTransactions";
import styles from "./styles.module.css";

interface HomeProps {
  isMobile: boolean | undefined;
}

export const Home: React.FC<HomeProps> = ({ isMobile }) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const contractAddress = "0xc3D8457B3d0996E3210E518A9744c17277663d2F";
  const closeMobileModal = () => {
    setIsMobileModalOpen(false);
  };

  return (
    <>
      <AppHeader />
      <NFT isMobile={isMobile} contractAddress={contractAddress} />
      {isMobile && (
        <div
          style={{ display: isMobileModalOpen ? "flex" : "none" }}
          onClick={closeMobileModal}
          className={styles.overlay}
        >
          <div onClick={closeMobileModal}>
            <MobileWalletConnector
              visible={isMobileModalOpen}
              onClose={closeMobileModal}
            />
          </div>
        </div>
      )}
      <RecentTransactions contractAddress={contractAddress} />
    </>
  );
};

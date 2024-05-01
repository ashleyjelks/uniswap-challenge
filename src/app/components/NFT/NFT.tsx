"use client"
import abi from "../../contracts/abi.json";
import Image from "next/image";
import styles from "./styles.module.css";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useConfetti } from "use-confetti-svg";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";


interface NFTProps {
  isMobile: boolean | undefined;
  contractAddress: string;
}

interface SVGProps {
  isMobile: boolean;
}

export const NFT: React.FC<NFTProps> = ({ isMobile, contractAddress }) => {
  const isDevEnvironment = process.env.NODE_ENV === "development";
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);
  const [isError, setIsError] = useState<null | boolean>(null);
  const [_connectWalletError, setConnectWalletError] = useState<boolean>(false);
  const [mintCount, setMintCount] = useState<null | number>(null);
  const provider = new ethers.providers.Web3Provider(window?.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const [showViewMyNFTsButton, setshowViewMyNFTsButton] =
    useState<boolean>(false);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<null | number>(null);
  const [elapsedTime, setElapsedTime] = useState<null | number>(null);
  const { isConnected } = useAccount();
  const [showTooltip, setShowTooltip] = useState(false);

  
  const handleMouseEnter = () => {
    if (!isConnected) {
      setShowTooltip(true);
    }
  };
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const mintNFT = async () => {
    if (!isConnected) {
      setConnectWalletError(true);
      return;
    }
    try {
      setIsMinting(true);
      setStartTime(new Date().getTime());

      const address = await signer.getAddress();
      const transactionResponse = await contract.mint(address);
      const { wait, blockHash, blockNumber } = transactionResponse;
      const receipt = await wait();

      if (isDevEnvironment) {
        console.log(
          `NFT minted with transaction receipt: ${receipt.transactionHash} from ${receipt.from} to ${receipt.to}`,
        );
      }

      setIsMinting(false);
      setStartTime(null);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(null);
        handleRunAnimation();
      }, 1000);
      setshowViewMyNFTsButton(true);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setIsMinting(false);
      setIsError(true);
      setIsSuccess(false);
      setStartTime(null);
      setElapsedTime(null);
      setIsError(null);
    }
  };

  const _mockMint = async () => {
    if (!isConnected) {
      setConnectWalletError(true);
      return;
    }

    setIsMinting(true);
    setStartTime(new Date().getTime());

    setTimeout(() => {
      setIsMinting(false);
      setStartTime(null);
      setElapsedTime(null);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(null);
        handleRunAnimation();
      }, 2000);
      setshowViewMyNFTsButton(true);
    }, 3000);
  };

  const iconSize = [32, 64, 72, 128];
  const mobileIconSize = [20, 30, 40, 50];
  const confetti = [
    "/icons/Confetti__Blue.png",
    "/icons/Confetti__Red.png",
    "/icons/Confetti__Pink.png",
    "/icons/Confetti__Green.png",
  ];
  const { runAnimation } = useConfetti({
    images: (isMobile ? mobileIconSize : iconSize).map((size, index) => {
      return {
        src: confetti[index % 4],
        size,
        weight: isMobile ? 2 : 10,
      };
    }),
    duration: 3000,
    fadeOut: 3000,
    particleCount: 50,
    speed: 15,
    rotate: true,
  });

  const handleRunAnimation = async () => {
    setIsAnimating(true);

    try {
      await runAnimation();
    } catch (error) {
      console.error("Error running animation:", error);
    }
    setIsAnimating(false);
  };

  useEffect(() => {
    const getGasPrice = async () => {
      try {
        const feeData = await provider.getFeeData();
        const gasPrice = ethers.utils.formatEther(feeData.gasPrice!);
        setGasPrice(gasPrice);
      } catch (error) {
        console.error("Error fetching gas price:", error);
      }
    };

    getGasPrice();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isMinting && startTime) {
      interval = setInterval(() => {
        const timeElapsed = Math.floor(
          (new Date().getTime() - startTime) / 1000,
        );
        setElapsedTime(timeElapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMinting, startTime]);

  useEffect(() => {
    const getMintCount = async () => {
      const mntCount = await provider.getTransactionCount(
        "0xc3D8457B3d0996E3210E518A9744c17277663d2F",
        "latest",
      );
      setMintCount(mntCount);
    };

    getMintCount();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.nft__wrapper}>
        <>
          {isMinting ? (
            <MintingSVG isMobile={isMobile} />
          ) : isSuccess ? (
            <SuccessSVG isMobile={isMobile} />
          ) : null}
        </>
        <Image
          height={isMobile ? 20 : 5}
          width={isMobile ? 20 : 5}
          layout="responsive"
          className={
            isMinting
              ? styles.nft__disabled
              : isAnimating
                ? styles.nft__animating
                : styles.nft
          }
          src="/images/NFT.png"
          alt="NFT"
        />
      </div>
      <div className={styles.text__wrapper}>
        {isMinting && elapsedTime && (
          <p
            style={{
              visibility: isMinting && elapsedTime ? "visible" : "hidden",
            }}
            className={styles.mintText__status}
          >{`Minting in progress... ${elapsedTime} seconds elapsed`}</p>
        )}
        {isError && (
          <p className={styles.mintText__error}>
            Error minting NFT. Please ensure you have sufficent ETH in your
            wallet to complete the transaction and try again.
          </p>
        )}
        {showViewMyNFTsButton ? (
          <button
            onClick={() => {
              router.push("/nfts");
            }}
            className={styles.viewNFTsButton}
          >
            View My NFTs
          </button>
        ) : (
          <>
            <p
              className={styles.mintText__status}
            >{`${gasPrice} ETH ; ${mintCount} minted`}</p>
            <button
              onClick={mintNFT}
              className={styles.mintButton}
              disabled={isMinting}
              style={{
                backgroundColor: isMinting ? "#8F8F8F" : "#FC72FF",
                cursor: isMinting || !isConnected ? "not-allowed" : "pointer",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Mint
            </button>
          </>
        )}
        {showTooltip && (
          <p className={styles.tooltip}>
            Please connect your wallet to mint this NFT.
          </p>
        )}
      </div>
    </div>
  );
};

const MintingSVG: React.FC<SVGProps> = ({ isMobile }) => (
  <div className={styles.svg__wrapper}>
    <svg
      width={isMobile ? 900 : 1000}
      height={isMobile ? 900 : 1000}
      viewBox="-45 0 440 440"
    >
      <path
        className={styles.path}
        fill="none"
        strokeDasharray={isMobile ? 450 : 500}
        d="M100,100 h140 a50,50 0 0 1 50,50 v140 a50,50 0 0 1 -50,50 h-140 a50,50 0 0 1 -50,-50 v-140 a50,50 0 0 1 50,-50 z"
      />
    </svg>
  </div>
);

const SuccessSVG: React.FC<SVGProps> = ({ isMobile }) => (
  <div className={styles.svg__wrapper}>
    <svg
      width={isMobile ? 900 : 1000}
      height={isMobile ? 900 : 1000}
      viewBox="-45 0 440 440"
    >
      <path
        className={styles.path}
        fill="none"
        strokeDasharray={isMobile ? 900 : 1000}
        d="M100,100 h140 a50,50 0 0 1 50,50 v140 a50,50 0 0 1 -50,50 h-140 a50,50 0 0 1 -50,-50 v-140 a50,50 0 0 1 50,-50 z"
      />
    </svg>
  </div>
);

import UniswapIcon from "../UniswapIcon";
import styles from "./styles.module.css";
import { Avatar, ConnectKitButton } from "connectkit";
import Link from "next/link";

export const AppHeader = () => {
  return (
    <div className={styles.wrapper}>
      <Link href="https://uniswap.org/">
        <UniswapIcon />
      </Link>
      <ConnectWalletButton />
    </div>
  );
};

const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) =>
        isConnected ? (
          <div onClick={show} style={{ cursor: "pointer" }}>
            <Avatar address={address} size={32} />
          </div>
        ) : (
          <button className={styles.button} onClick={show}>
            Connect
          </button>
        )
      }
    </ConnectKitButton.Custom>
  );
};

import React, { CSSProperties } from "react";
import { useConnect } from "wagmi";
import { CiCircleQuestion } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import styles from "./styles.module.css";

interface RedirectButtonProps {
  url: string;
  marginRight?: string;
  children: string;
}
interface WalletConnectorProps {
  visible: boolean;
  onClose: () => void;
}

export const MobileWalletConnector: React.FC<WalletConnectorProps> = ({
  visible,
  onClose,
}) => {
  const { connectors, connect } = useConnect();

  const RedirectButton = ({
    url,
    children,
    marginRight,
  }: RedirectButtonProps) => {
    const handleClick = () => {
      window.open(url, "_blank");
    };

    return (
      <button
        className={styles.button__redirect}
        onClick={handleClick}
        style={{ marginRight }}
      >
        {children}
      </button>
    );
  };

  const modalVisibility = {
    visibility: visible ? "visible" : "hidden",
  };

  return (
    <div
      className={styles.overlay}
      style={modalVisibility as CSSProperties | undefined}
      onClick={onClose}
    >
      <div className={styles.modal__body} onClick={onClose}>
        <div className={styles.header__wrapper}>
          <CiCircleQuestion className={styles.icon} />
          <p className={styles.header__text}>Connect Wallettt</p>
          <IoMdClose onClick={onClose} className={styles.icon} />
        </div>
        <div className={styles.button__walletWrapper}>
          {connectors.map(
            (connector: {
              icon?: string;
              uid: React.Key | null | undefined;
              name:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
            }) => (
              <button
                key={connector.uid}
                aria-label={`Connect to ${connector.name}`}
                className={styles.button__walletConnect}
                onClick={() => connect({ connector })}
              >
                <img
                  src={
                    connector.name === "WalletConnect"
                      ? "https://walletconnect.com/static/favicon.png"
                      : connector.icon
                  }
                  className={styles.icon__wallet}
                />
                <p className={styles.infoText__dark}>{connector.name}</p>
              </button>
            ),
          )}
        </div>
        <div className={styles.info__wrapper}>
          <p className={styles.info__headerText}>What is a wallet?</p>
          <p className={styles.infoText__light}>
            Wallets are used to send, recieve, and store digital assets.
            Connecting a wallet lets you interact with apps.
          </p>
          <div className={styles.button__redirect__wrapper}>
            <RedirectButton
              url="https://www.coinbase.com/learn/crypto-basics/what-is-a-crypto-wallet"
              marginRight="15px"
            >
              Learn More
            </RedirectButton>
            <RedirectButton url="https://bitpay.com/blog/create-a-crypto-wallet/">
              Get a Wallet
            </RedirectButton>
          </div>
        </div>
      </div>
    </div>
  );
};

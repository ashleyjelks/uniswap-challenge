import React from "react";
import styled from "styled-components";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { CiCircleQuestion } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

interface RedirectButtonProps {
  url: string;
  marginRight?: string;
  children: string;
}
interface WalletConnectorProps {
  visible: boolean;
  onClose: void;
  onVerifySignature: (
    message: string,
    signedMsg: string,
    address: string,
  ) => Promise<boolean | undefined>;
}
const WalletConnector: React.FC<WalletConnectorProps> = ({
  onVerifySignature,
  visible,
  onClose,
}) => {
  const { status, address } = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const handleSignMessage = async () => {
    const message = "I'm signing a message.";

    signMessageAsync({ message })
      .then((signedMsg: string) => {
        return onVerifySignature(message, signedMsg, address!);
      })
      .catch((error) => {
        console.error("Error signing message/verifying signature:", error);
      });
  };

  const buttonStyle = {
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "#000000",
    color: "white",
    margin: "0 10px",
    width: "150px",
  };

  const RedirectButton = ({
    url,
    children,
    marginRight,
  }: RedirectButtonProps) => {
    const handleClick = () => {
      window.open(url, "_blank");
    };

    return (
      <StyledButton onClick={handleClick} style={{ marginRight }}>
        {children}
      </StyledButton>
    );
  };

  return (
    <div style={{ border: "solid 1px red", color: "red" }}>
      I am a happy go lucky girl.
    </div>
  );
};

export default WalletConnector;

//  {/* <button
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               background: "white",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={() =>{}}
//           >
//             <p style={{ fontSize: "10px", color: "#000000" }}>
//               Other Wallet
//             </p>
//             </button> */}

// <div style={{ minHeight: "175px" }}>
//   {error && (
//     <div
//       style={{ fontSize: 12, fontWeight: "bold", color: "red" }}
//     >{`Unable to connect to wallet: ${error.message}`}</div>
//   )}
//   {(status === "reconnecting" || status === "connecting") && (
//     <p style={{ fontSize: 24, fontWeight: "bold" }}>Connecting...</p>
//   )}

//   {
//     // TODO: USE ENUM
//     visible && (
//       <div style={{ margin: "0 10px" }}>
//         <p style={{ fontSize: 24, fontWeight: "bold" }}>
//           Connect Your Wallet
//         </p>
//         {address && <p style={{ fontSize: 14 }}>Your Address: {address}</p>}
//         {connectors.map(
//           (connector: {
//             uid: React.Key | null | undefined;
//             name:
//               | string
//               | number
//               | boolean
//               | React.ReactElement<
//                   any,
//                   string | React.JSXElementConstructor<any>
//                 >
//               | Iterable<React.ReactNode>
//               | React.ReactPortal
//               | null
//               | undefined;
//           }) => (
//             <button
//               style={buttonStyle}
//               key={connector.uid}
//               onClick={() => connect({ connector })}
//               type="button"
//               aria-label={`Connect to ${connector.name}`}
//             >
//               {connector.name}
//             </button>
//           ),
//         )}
//       </div>
//       </ModalOverlay>
//     )
//   }
//   {status === "connected" && (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         marginLeft: "20px",
//       }}
//     >
//       <p style={{ fontSize: 24, fontWeight: "bold" }}>
//         Disconnect Your Wallet
//       </p>
//       {address && <p style={{ fontSize: 14 }}>Your Address: {address}</p>}

//       <div>
//         <button
//           type="button"
//           onClick={() => disconnect()}
//           aria-label="Disconnect your wallet"
//         >
//           Disconnect
//         </button>
//         <button
//           style={buttonStyle}
//           type="button"
//           onClick={() => handleSignMessage()}
//           aria-label="Sign Message"
//         >
//           Sign Message
//         </button>
//       </div>
//     </div>
//   )}
// </div>

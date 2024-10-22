"use client";
import AccountInfo from "./AccountInfo"; // Ensure this component is appropriate for notes
import { useContractProvider } from "./ContractProvider";

const ConnectButton = () => {
  const { connectToSubWallet, isConnected } = useContractProvider();

  if (!isConnected) {
    return (
      <button
        onClick={connectToSubWallet}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect to Note App {/* Update button text */}
      </button>
    );
  }

  return <AccountInfo />; // Display account info once connected
};

export default ConnectButton;

"use client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DedotClient, WsProvider } from "dedot";
import {
  Injected,
  InjectedAccount,
  InjectedWindowProvider,
  InjectedWindow,
} from "@polkadot/extension-inject/types";
import { Contract, ContractMetadata } from "dedot/contracts";
import { TodoAppContractApi } from "@/lib/todo-app";
import todoMetadata from "@/artifacts/todo_app.json" assert { type: "json" };
import { toast } from "sonner";

interface ContextState {
  dedotClient?: DedotClient | null;
  connectToSubWallet?: () => Promise<void>;
  disconnectSubWallet?: () => Promise<void>;
  contract?: Contract<TodoAppContractApi> | null;
  isConnected?: boolean;
  getConnectedAccounts?: () => Promise<InjectedAccount[]>;
  getActiveAccount?: () => Promise<InjectedAccount>;
  signer?: any;
}

const ContractContext = createContext<ContextState>({
  dedotClient: null,
});

export const ROCOCO_CONTRACT = {
  name: "rococo-contracts",
  endpoint: "wss://rococo-contracts-rpc.polkadot.io",
  decimals: 12,
  prefix: 42,
  symbol: "ROC",
};

const ContractProvider: React.FC<
  { autoConnect?: boolean } & PropsWithChildren
> = ({ children, autoConnect }) => {
  const [dedotClient, setDedotClient] = useState<DedotClient | null>(null);
  const [injected, setInjected] = useState<Injected | null>(null);

  const InitClient = useCallback(async () => {
    if (!dedotClient) {
      const wsProvider = new WsProvider(ROCOCO_CONTRACT.endpoint);
      const client = new DedotClient(wsProvider);
      await client.connect();
      setDedotClient(client);
    }
  }, [dedotClient]);

  const injectedWindow = window as Window & InjectedWindow;

  // Get subwallet-js injected provider to connect with SubWallet
  let provider: InjectedWindowProvider | undefined;
  
  if (injectedWindow && injectedWindow.injectedWeb3) {
    provider = injectedWindow.injectedWeb3["subwallet-js"];
  }

  const connectToSubWallet = useCallback(async () => {
    if (!provider) {
      console.error("SubWallet provider is not available.");
      return;
    }

    // Connect with SubWallet from the dapp
    const injected: Injected = await provider.enable!("Todo Dapp");
    setInjected(injected);
  }, [provider]);

  const getConnectedAccounts = async () => {
    if (!injected) return [];
    const accounts: InjectedAccount[] = await injected.accounts.get();
    return accounts;
  };

  const getActiveAccount = async () => {
    const accounts = await getConnectedAccounts();
    return accounts[0];
  };

  const signer = injected?.signer;

  const isConnected = useMemo(() => !!injected, [injected]);

  const disconnectSubWallet = useCallback(async () => {
    if (!injected) return;
    await injected.provider?.disconnect();
    setInjected(null);
  }, [injected]);

  const contract = useMemo(() => {
    if (!dedotClient) return null;
    return new Contract<TodoAppContractApi>(
      dedotClient,
      todoMetadata as ContractMetadata,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESSS as string
    );
  }, [dedotClient]);

  const getAccountBalance = async (account: InjectedAccount) => {
    if (!dedotClient) return;
    const balance = await dedotClient.query.system.account(account.address);
    return balance;
  };

  useEffect(() => {
    toast.promise(InitClient(), {
      loading: "Initializing dedot client",
      success: "Initialized dedot client",
      error: "Failed to initialize dedot client",
    });
    if (autoConnect) {
      connectToSubWallet();
    }
  }, [InitClient, autoConnect, connectToSubWallet]);

  return (
    <ContractContext.Provider
      value={{
        dedotClient,
        connectToSubWallet,
        disconnectSubWallet,
        contract,
        isConnected,
        getConnectedAccounts,
        getActiveAccount,
        signer,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;

export const useContractProvider = () => useContext(ContractContext);

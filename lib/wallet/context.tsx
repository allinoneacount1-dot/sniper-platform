"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: number;
  walletName: string | null;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  balance: 0,
  walletName: null,
});

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: () => void) => void;
      isConnected?: boolean;
      publicKey?: { toString: () => string };
      signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
    solflare?: {
      isSolflare?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
    backpack?: {
      isBackpack?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
  }
}

const WALLET_STORAGE_KEY = "sniper_wallet";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [walletName, setWalletName] = useState<string | null>(null);

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      const res = await fetch(`/api/wallet/balance?address=${addr}`);
      const data = await res.json();
      if (data.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch { /* ignore */ }
  }, []);

  // Check existing connection on mount
  useEffect(() => {
    const init = async () => {
      // Check saved connection
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved) {
        try {
          const { addr, name } = JSON.parse(saved);
          if (addr && name) {
            setAddress(addr);
            setWalletName(name);

            // Verify still connected
            if (name === "phantom" && window.solana?.isConnected) {
              setConnected(true);
              fetchBalance(addr);
            } else if (name === "solflare" && window.solflare?.isConnected) {
              setConnected(true);
              fetchBalance(addr);
            } else if (name === "backpack" && window.backpack?.isConnected) {
              setConnected(true);
              fetchBalance(addr);
            }
          }
        } catch { /* ignore */ }
      }
    };
    init();
  }, [fetchBalance]);

  // Listen for wallet events
  useEffect(() => {
    const handleAccountChange = () => {
      if (window.solana?.publicKey) {
        const addr = window.solana.publicKey.toString();
        setAddress(addr);
        setConnected(true);
        setWalletName("phantom");
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({ addr, name: "phantom" }));
        fetchBalance(addr);
      } else if (!window.solana?.isConnected) {
        setAddress(null);
        setConnected(false);
        setWalletName(null);
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    };

    const handleDisconnect = () => {
      setConnected(false);
      setAddress(null);
      setWalletName(null);
      setBalance(0);
      localStorage.removeItem(WALLET_STORAGE_KEY);
    };

    if (window.solana) {
      window.solana.on("accountChanged", handleAccountChange);
      window.solana.on("disconnect", handleDisconnect);
    }

    return () => {};
  }, [fetchBalance]);

  const connectPhantom = async () => {
    if (!window.solana?.isPhantom) {
      const install = confirm("Phantom wallet not detected. Install Phantom?");
      if (install) window.open("https://phantom.app/download", "_blank");
      return null;
    }
    const result = await window.solana.connect();
    return { addr: result.publicKey.toString(), name: "phantom" as const };
  };

  const connectSolflare = async () => {
    if (!window.solflare?.isSolflare) {
      const install = confirm("Solflare wallet not detected. Install Solflare?");
      if (install) window.open("https://solflare.com", "_blank");
      return null;
    }
    const result = await window.solflare.connect();
    return { addr: result.publicKey.toString(), name: "solflare" as const };
  };

  const connectBackpack = async () => {
    if (!window.backpack?.isBackpack) {
      return null;
    }
    const result = await window.backpack.connect();
    return { addr: result.publicKey.toString(), name: "backpack" as const };
  };

  const connect = useCallback(async () => {
    setConnecting(true);
    let result: { addr: string; name: string } | null = null;

    // Try wallets in order
    try {
      result = await connectPhantom();
    } catch { /* try next */ }

    if (!result) {
      try {
        result = await connectSolflare();
      } catch { /* try next */ }
    }

    if (!result) {
      try {
        result = await connectBackpack();
      } catch { /* none available */ }
    }

    if (!result) {
      alert("No Solana wallet detected. Please install Phantom or Solflare.");
      setConnecting(false);
      return;
    }

    setAddress(result.addr);
    setWalletName(result.name);
    setConnected(true);
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({ addr: result.addr, name: result.name }));
    fetchBalance(result.addr);
    setConnecting(false);
  }, [fetchBalance]);

  const disconnect = useCallback(async () => {
    try {
      if (walletName === "phantom" && window.solana) await window.solana.disconnect();
      else if (walletName === "solflare" && window.solflare) await window.solflare.disconnect();
      else if (walletName === "backpack" && window.backpack) await window.backpack.disconnect();
    } catch { /* ignore */ }

    setConnected(false);
    setAddress(null);
    setWalletName(null);
    setBalance(0);
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }, [walletName]);

  return (
    <WalletContext.Provider value={{ connected, address, connecting, connect, disconnect, balance, walletName }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
